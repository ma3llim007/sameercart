import { Suspense, useEffect, useState } from "react";
import {
    ErrorMessage,
    Input,
    Loading,
    PageHeader,
    Select,
    TextArea,
} from "../components";
import { Controller, useForm } from "react-hook-form";
import RichTextEditor from "../components/Form/RichTextEditor";
import Loader from "@/client/components/Loader/Loader";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { hasVariantsOptions, slugTransform } from "@/utils";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";
import { yupResolver } from "@hookform/resolvers/yup";
import { editProductScheme } from "@/validation/admin/ProductScheme";
import { LoadingOverlay } from "@/components";

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
                productPrice,
                productDiscountPrice,
                productShortDescription,
                productBrand,
                productStock,
            } = productData?.data || {};

            setValue("productName", productName);
            setValue("productSlug", productSlug);
            setValue("productDescription", productDescription);
            setValue("productSpecification", productSpecification);
            setValue("productCategoryId", productCategory?.categoryId);
            setValue("productSubCategoryId", productSubCategory?.subCategoryId);
            setValue("productPrice", productPrice);
            setValue("productDiscountPrice", productDiscountPrice);
            setValue("productBrand", productBrand);
            setValue("productStock", productStock);
            setValue("productShortDescription", productShortDescription);
            setSelectedCategory(productCategory?.categoryId);
        }
    }, [productSuccess, productData, setValue]);

    // Handle category change and update sub-category
    useEffect(() => {
        const subCategoryId =
            productData?.data?.productSubCategory?.subCategoryId || "";
        if (selectedCategory) {
            setValue("productSubCategoryId", subCategoryId);
        }
    }, [
        selectedCategory,
        setValue,
        productData?.data?.productSubCategory?.subCategoryId,
    ]);
    const hasVariants = productData?.data?.hasVariants;

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
            formData.append("productDiscountPrice", data?.productDiscountPrice);
            formData.append("productDescription", data?.productDescription);
            formData.append("productSpecification", data?.productSpecification);
            formData.append("productPrice", data?.productPrice);
            formData.append("productBrand", data?.productBrand);
            formData.append(
                "productShortDescription",
                data?.productShortDescription
            );
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
                            <div className="w-full md:w-1/2 px-2 flex-grow">
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
                            <div className="w-full md:w-1/2 px-2 flex-grow">
                                <Input
                                    label="Slug"
                                    placeholder="View The Category Slug"
                                    {...register("productSlug")}
                                    disabled={isPending}
                                    onPaste={e => e.preventDefault()}
                                    onCopy={e => e.preventDefault()}
                                    readOnly
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                    error={errors.productSlug?.message}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap my-2">
                            <div className="w-full md:w-1/2 px-2">
                                <Controller
                                    name="productCategoryId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            label="Select The Category"
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
                            <div className="w-full md:w-1/2 px-2">
                                <Select
                                    label="Select The Sub-Category"
                                    placeholder="Select The Sub-Category"
                                    title="Select The Sub-Category"
                                    options={SubCategoryOptions?.data}
                                    isRequired="true"
                                    disabled={isPending}
                                    {...register("productSubCategoryId")}
                                    error={errors.productSubCategoryId?.message}
                                    defaultValue={
                                        productData?.data.productSubCategory
                                            .subCategoryId
                                    }
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap my-2">
                            <div className="w-full md:w-1/2 px-2">
                                <Controller
                                    control={control}
                                    name="productFeatureImage"
                                    render={({ field }) => (
                                        <Input
                                            label="Select The Product Image"
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
                            <div className="w-full md:w-1/2 px-2">
                                <div className="w-full">
                                    <label className="inline-block mb-2 pl-1 text-base font-bold">
                                        Previous Image
                                    </label>
                                    <img
                                        src={
                                            productData?.data
                                                .productFeatureImage
                                        }
                                        className="max-w-60 max-h-60 object-cover rounded"
                                        alt="Previous Category"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap my-2">
                            <div className="w-full md:w-1/2 px-2">
                                <Select
                                    label="Select The Variants"
                                    placeholder="Select The Variants Options"
                                    title="Specify If This Product Has Variants"
                                    options={hasVariantsOptions}
                                    isRequired="true"
                                    readOnly={true}
                                    disabled={true}
                                    {...register("hasVariants")}
                                    defaultValue={
                                        productData?.data?.hasVariants
                                    }
                                    name="hasVariants"
                                    error={errors.hasVariants?.message}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                />
                            </div>
                        </div>
                        {hasVariants === false && (
                            <div className="flex flex-wrap my-2">
                                <div className="w-full md:w-1/2 px-2">
                                    <Input
                                        label="Product Price"
                                        placeholder="Enter The Product Price"
                                        {...register("productPrice")}
                                        className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                        error={errors.productPrice?.message}
                                    />
                                </div>
                                <div className="w-full md:w-1/2 px-2">
                                    <Input
                                        label="Product Discount Price"
                                        placeholder="Enter The Product Discount Price"
                                        {...register("productDiscountPrice")}
                                        className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                        error={
                                            errors.productDiscountPrice?.message
                                        }
                                    />
                                </div>
                            </div>
                        )}
                        <div className="flex flex-wrap my-2">
                            {hasVariants === false && (
                                <div className="w-full md:w-1/2 px-2">
                                    <Input
                                        label="Product Stock"
                                        placeholder="Enter The Product Stock"
                                        {...register("productStock")}
                                        disabled={true}
                                        className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                        error={errors.productStock?.message}
                                    />
                                </div>
                            )}
                            <div className="w-full md:w-1/2 px-2">
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
