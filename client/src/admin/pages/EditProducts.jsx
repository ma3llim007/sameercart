import { Suspense, useEffect, useState } from "react";
import {
    ErrorMessage,
    Input,
    Loading,
    PageHeader,
    Select,
    TextArea,
} from "../components";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import RichTextEditor from "../components/Form/RichTextEditor";
import Loader from "@/client/components/Loader/Loader";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { slugTransform, productTypeOptions } from "@/utils";
import { Button } from "@/components/ui/button";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { yupResolver } from "@hookform/resolvers/yup";
import { editProductScheme } from "@/validation/admin/ProductScheme";
import { LoadingOverlay } from "@/components";
import DOMPurify from "dompurify";

const EditProducts = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const {
        handleSubmit,
        control,
        register,
        formState: { errors },
        setValue,
        watch,
        setError,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(editProductScheme),
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "attributes",
    });

    // fetching the product Data based on ProductId
    const {
        data: productData,
        isSuccess: productSuccess,
        isError: productError,
    } = useQuery({
        queryKey: ["product", productId],
        queryFn: () =>
            crudService.get(`product/get-product/${productId}`, true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });

    // Fetching The Category Data For Options
    const { data: categoryOptions, isError: categoryError } = useQuery({
        queryKey: ["categoryOptions"],
        queryFn: () => crudService.get("category/options-category", true),
        onError: err => {
            toastService.error(
                err?.message || "Failed to fetch Category Options."
            );
        },
    });

    // Fetching The Sub-Category Data For Options Based On Category
    const { data: SubCategoryOptions, isError: subcategoryError } = useQuery({
        queryKey: ["subCategoryOptions", selectedCategory],
        queryFn: () => {
            if (selectedCategory) {
                return crudService.get(
                    `sub-category/get-subcategory-option/${selectedCategory}`,
                    true
                );
            }
            return Promise.resolve([]);
        },
        enabled: !!selectedCategory && productSuccess,
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });

    // Automatically update slug when product name changes
    useEffect(() => {
        const UpdateSlug = (name, value) => {
            if (name === "productName") {
                const transformedSlug = slugTransform(value.productName || "");
                setValue("productSlug", transformedSlug, {
                    shouldValidate: true,
                });
            }
        };

        const subscription = watch((value, { name }) => {
            UpdateSlug(name, value);
        });

        return () => subscription.unsubscribe();
    }, [watch, setValue]);

    // Update form values when product data is fetched
    useEffect(() => {
        if (productSuccess && productData?.data) {
            const {
                productName,
                productSlug,
                productDescription,
                productSpecification,
                productCategory,
                productSubCategory,
                productType,
                basePrice,
                productDiscountPrice,
                productStock,
                productBrand,
                productShortDescription,
                attributes,
            } = productData?.data || {};
            setValue("productName", productName);
            setValue("productSlug", productSlug);
            setValue("basePrice", basePrice);
            setValue("productCategoryId", productCategory?.categoryId);
            setValue("productSubCategoryId", productSubCategory?.subCategoryId);
            setValue("productType", productType);
            setValue("productDiscountPrice", productDiscountPrice);
            setValue("productDescription", productDescription);
            setValue("productSpecification", productSpecification);
            setValue("productStock", productStock);
            setValue("productBrand", productBrand);
            setValue("productShortDescription", productShortDescription);
            const convertAttribute = attributes.map(attribute => ({
                ...attribute,
                options: attribute.options.join(","),
            }));
            setValue("attributes", convertAttribute);
            setSelectedCategory(productCategory?.categoryId);
        }
    }, [productSuccess, productData, setValue]);

    // Sync sub-category with category change
    useEffect(() => {
        if (selectedCategory) {
            if (productData?.data?.productSubCategory?.subCategoryId) {
                setValue(
                    "productSubCategoryId",
                    productData.data.productSubCategory.subCategoryId
                );
            } else {
                setValue("productSubCategoryId", "");
            }
        } else {
            setValue("productSubCategoryId", "");
        }
    }, [
        selectedCategory,
        productData?.data?.productSubCategory?.subCategoryId,
        setValue,
    ]);
    const productType = productData?.data?.productType;

    // Update the Data
    const { mutate, isPending } = useMutation({
        mutationFn: data => {
            const formData = new FormData();
            formData.append("productName", data?.productName);
            formData.append("productSlug", data?.productSlug);
            formData.append("productCategoryId", data?.productCategoryId);
            formData.append("productSubCategoryId", data?.productSubCategoryId);
            if (data?.productFeatureImage)
                formData.append(
                    "productFeatureImage",
                    data?.productFeatureImage
                );
            if (data?.basePrice) {
                formData.append("basePrice", data?.basePrice);
            }
            if (data?.productDiscountPrice) {
                formData.append(
                    "productDiscountPrice",
                    data?.productDiscountPrice
                );
            }
            formData.append("productStock", data?.productStock);
            formData.append("productBrand", data?.productBrand);
            formData.append(
                "productShortDescription",
                data?.productShortDescription
            );
            formData.append(
                "productDescription",
                DOMPurify.sanitize(data?.productDescription)
            );
            formData.append(
                "productSpecification",
                DOMPurify.sanitize(data?.productSpecification)
            );
            const convertedAttributes = data?.attributes.map(attribute => ({
                ...attribute,
                options: attribute.options
                    .split(",")
                    .map(option => option.trim()),
            }));
            formData.append("attributes", JSON.stringify(convertedAttributes));
            formData.append("productId", productId);

            return crudService.patch(
                "/product/edit-product",
                true,
                formData,
                "multipart/form-data"
            );
        },
        onSuccess: data => {
            navigate("/admin/products/products-list");
            queryClient.invalidateQueries("productsList");
            queryClient.removeQueries(["product", productId]);
            queryClient.removeQueries("categoryOptions");
            toastService.success(data?.message);
        },
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            setError("root", { message });
        },
    });

    if (productError || categoryError || subcategoryError) {
        return (
            <ErrorMessage
                message={"Error Loading Data. Please Try Again Later."}
            />
        );
    }

    if (isPending) {
        return <LoadingOverlay />;
    }
    return (
        <>
            <PageHeader
                title={"Manage Products"}
                controller={"Products"}
                controllerUrl={"/admin/products/products-list"}
                page={"Edit Product's"}
            />
            <section className="w-full">
                <div className="my-4 w-full container mx-auto border-t-4 border-blue-700 rounded-lg p-2 bg-gray-100 dark:bg-slate-800">
                    <form
                        className="space-y-5"
                        onSubmit={handleSubmit(data => mutate(data))}
                        encType="multipart/form-data"
                    >
                        <h1 className="text-xl font-bold my-4 px-2">
                            Edit Products
                        </h1>
                        {errors.root && (
                            <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                                <h4 className="text-white font-bold text-sm">
                                    {errors.root.message}
                                </h4>
                            </div>
                        )}
                        <div className="flex flex-wrap my-2">
                            <div className="w-full lg:w-1/2 px-2 flex-grow">
                                <Input
                                    label="Product Name"
                                    placeholder="Enter The Product Name"
                                    {...register("productName")}
                                    disabled={isPending}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                    error={errors.productName?.message}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap my-2">
                            <div className="w-full lg:w-1/2 px-2 flex-grow">
                                <Input
                                    label="Product Slug"
                                    placeholder="View The Category Slug"
                                    {...register("productSlug")}
                                    disabled={isPending}
                                    onPaste={e => e.preventDefault()}
                                    onCopy={e => e.preventDefault()}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                    error={errors.productSlug?.message}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap my-2 gap-4 lg:gap-0">
                            <div className="w-full lg:w-1/2 px-2">
                                <Controller
                                    name="productCategoryId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            label="Product Category"
                                            placeholder="Select The Category"
                                            title="Select The Category"
                                            options={categoryOptions?.data}
                                            isRequired="true"
                                            disabled={isPending}
                                            {...register("productCategoryId")}
                                            onChange={e => {
                                                field.onChange(e.target.value);
                                                setSelectedCategory(
                                                    e.target.value
                                                );
                                            }}
                                            error={
                                                errors.productCategoryId
                                                    ?.message
                                            }
                                            className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                        />
                                    )}
                                />
                            </div>
                            <div className="w-full lg:w-1/2 px-2">
                                <Select
                                    label="Product Sub-Category"
                                    placeholder="Select The Sub-Category"
                                    title="Select The Sub-Category"
                                    options={SubCategoryOptions?.data || []}
                                    isRequired="true"
                                    disabled={isPending}
                                    {...register("productSubCategoryId")}
                                    error={errors.productSubCategoryId?.message}
                                    defaultValue={
                                        productData?.data.productSubCategory
                                            .subCategoryId || ""
                                    }
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap my-2 gap-4 lg:gap-0">
                            <div className="w-full lg:w-1/2 px-2">
                                <Controller
                                    control={control}
                                    name="productFeatureImage"
                                    render={({ field }) => (
                                        <Input
                                            label="Product Image"
                                            title="Select The Product Image"
                                            additionalTitle="Note:- [For Best View Of Product Image Width:350px, Height:250px]"
                                            type="file"
                                            disabled={isPending}
                                            accept=".jpg, .jpeg, .png, .gif, .svg, .webp"
                                            onChange={e => {
                                                field.onChange(
                                                    e.target.files[0]
                                                );
                                            }}
                                            className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            error={
                                                errors.productFeatureImage
                                                    ?.message
                                            }
                                        />
                                    )}
                                />
                            </div>
                            <div className="w-full lg:w-1/2 px-2">
                                <div className="w-full">
                                    <label className="inline-block mb-2 pl-1 text-base font-bold">
                                        Product Previous Image
                                    </label>
                                    <img
                                        src={
                                            productData?.data
                                                .productFeatureImage
                                        }
                                        className="max-w-96 max-h-80 object-cover rounded"
                                        alt="Previous Category"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap my-2">
                            <div className="w-full lg:w-1/2 px-2">
                                <Select
                                    label="Product Type"
                                    placeholder="Select The Product Type"
                                    options={productTypeOptions}
                                    isRequired="true"
                                    readOnly
                                    disabled
                                    {...register("productType")}
                                    defaultValue={
                                        productData?.data?.productType
                                    }
                                    name="productType"
                                    error={errors.productType?.message}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                />
                            </div>
                        </div>
                        {productType === "simple" && (
                            <div className="flex flex-wrap my-2 gap-4 lg:gap-0">
                                <div className="w-full lg:w-1/2 px-2">
                                    <Input
                                        label="Base Product Price"
                                        placeholder="Enter The Base Product Price"
                                        disabled={isPending}
                                        {...register("basePrice")}
                                        className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                        error={errors.basePrice?.message}
                                    />
                                </div>
                                <div className="w-full lg:w-1/2 px-2">
                                    <Input
                                        label="Product Discount Price"
                                        placeholder="Enter The Product Discount Price"
                                        disabled={isPending}
                                        {...register("productDiscountPrice")}
                                        className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                        error={
                                            errors.productDiscountPrice?.message
                                        }
                                    />
                                </div>
                            </div>
                        )}
                        <div className="flex flex-wrap my-2 gap-4 lg:gap-0">
                            {productType === "simple" && (
                                <div className="w-full lg:w-1/2 px-2">
                                    <Input
                                        label="Product Stock"
                                        placeholder="Enter The Product Stock"
                                        disabled={isPending}
                                        {...register("productStock")}
                                        className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                        error={errors.productStock?.message}
                                    />
                                </div>
                            )}
                            <div className="w-full lg:w-1/2 px-2">
                                <Input
                                    label="Product Brand"
                                    placeholder="Enter The Product Brand"
                                    {...register("productBrand")}
                                    disabled={isPending}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                    error={errors.productBrand?.message}
                                />
                            </div>
                        </div>
                        <div className="w-full px-2">
                            <TextArea
                                name="productShortDescription"
                                label="Product Short Description"
                                placeholder="Enter The Product Short Description"
                                error={errors.productShortDescription?.message}
                                className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                rows={2}
                                {...register("productShortDescription")}
                                disabled={isPending}
                            />
                        </div>
                        <div className="w-full px-2">
                            <Suspense fallback={<Loader />}>
                                <RichTextEditor
                                    name="productDescription"
                                    label="Product Description"
                                    control={control}
                                    placeholder="Enter The Product Description"
                                    {...register("productDescription")}
                                    error={errors.productDescription?.message}
                                    disabled={isPending}
                                    className="text-xl rounded-sm focus:ring-2 focus:ring-blue-800"
                                />
                            </Suspense>
                        </div>
                        <div className="w-full px-2">
                            <Suspense fallback={<Loader />}>
                                <RichTextEditor
                                    name="productSpecification"
                                    label="Product Specification"
                                    control={control}
                                    disabled={isPending}
                                    placeholder="Enter The Product Specification"
                                    {...register("productSpecification")}
                                    error={errors.productSpecification?.message}
                                    className="text-xl rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                                />
                            </Suspense>
                        </div>
                        {productType === "variable" && (
                            <>
                                <hr />
                                <div className="w-full border rounded-lg py-4 px-3 bg-stone-800">
                                    <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
                                        <h2 className="text-2xl font-bold px-2 underline">
                                            Attribues
                                        </h2>
                                        <Button
                                            disabled={isPending}
                                            className="Success btnLg flex items-center gap-2"
                                            onClick={() =>
                                                append({
                                                    name: "",
                                                    options: "",
                                                })
                                            }
                                        >
                                            <FaPlus /> Add Variant
                                        </Button>
                                    </div>
                                    <div className="space-y-4">
                                        {fields.map((field, index) => (
                                            <div
                                                key={field.id}
                                                className="w-full flex flex-col lg:flex-row items-center gap-4 p-4 shadow-sm rounded-lg border bg-white text-black dark:bg-slate-800 dark:text-white min-h-[120px]"
                                            >
                                                <div className="w-20">
                                                    <Button
                                                        className="Danger inline-flex items-center gap-2 p-5 mt-6 rounded-md"
                                                        onClick={() =>
                                                            remove(index)
                                                        }
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </div>
                                                <div className="flex-grow flex-col lg:flex-row flex">
                                                    <div className="w-full lg:w-1/2 px-2">
                                                        <Input
                                                            placeholder="Enter The Name"
                                                            label="Name"
                                                            {...register(
                                                                `attributes.${index}.name`
                                                            )}
                                                            className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                                            error={
                                                                errors
                                                                    .attributes?.[
                                                                    index
                                                                ]?.name?.message
                                                            }
                                                        />
                                                    </div>
                                                    <div className="w-full lg:w-1/2 px-2">
                                                        <Input
                                                            placeholder="Enter The Value"
                                                            label="value"
                                                            {...register(
                                                                `attributes.${index}.options`
                                                            )}
                                                            className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                                            error={
                                                                errors
                                                                    .attributes?.[
                                                                    index
                                                                ]?.options
                                                                    ?.message
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="w-full border-t !mt-6">
                            <Button
                                disabled={isPending}
                                className="Primary my-2 btnXl"
                            >
                                {isPending ? (
                                    <Loading height="7" weight="7" />
                                ) : (
                                    <>
                                        <FaEdit /> Update
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default EditProducts;
