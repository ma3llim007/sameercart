import { Suspense, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import Loader from "@/client/components/Loader/Loader";
import RichTextEditor from "../../components/Form/RichTextEditor";
import { productTypeOptions, slugTransform } from "@/utils";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import DOMPurify from "dompurify";
import { addProductScheme } from "@/validation/admin/ProductScheme";
import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import LoadingOverlay from "@/components/LoadingOverlay";
import Input from "@/components/Form/Input";
import Select from "@/components/Form/Select";
import TextArea from "@/components/Form/TextArea";
import { Helmet } from "react-helmet-async";

const AddProducts = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const {
        handleSubmit,
        register,
        formState: { errors },
        watch,
        control,
        setValue,
        setError,
    } = useForm({
        resolver: yupResolver(addProductScheme),
        mode: "onChange",
    });

    // Updating the slug value on title change
    useEffect(() => {
        const updateSlug = (name, value) => {
            if (name === "productName") {
                const transformedSlug = slugTransform(value.productName || "");
                setValue("productSlug", transformedSlug, {
                    shouldValidate: true,
                });
            }
        };
        const subscription = watch((value, { name }) => {
            updateSlug(name, value);
        });

        return () => subscription.unsubscribe();
    }, [watch, setValue]);
    const productType = watch("productType");

    // Fetching The Category Data For Options
    const { data: categoryOptions } = useQuery({
        queryKey: ["categoryOptions"],
        queryFn: () => crudService.get("category/options-category", true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });

    // Fetching The Sub-Category Data For Options Based On Category
    const { data: SubCategoryOptions } = useQuery({
        queryKey: ["subCategoryOptions", selectedCategory],
        queryFn: () => {
            if (selectedCategory) {
                return crudService.get(`sub-category/get-subcategory-option/${selectedCategory}`, true);
            }
            return Promise.resolve([]);
        },
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });

    // add new product
    const { mutate, isPending } = useMutation({
        mutationFn: data => {
            const { productDescription, productSpecification } = data;

            // Sanitize the productDescription and productSpecification
            const sanitizeProductDescription = DOMPurify.sanitize(productDescription);
            const sanitizeProductSpecification = DOMPurify.sanitize(productSpecification);

            // Create a new data object with sanitized content
            const sanitizedData = {
                ...data,
                productDescription: sanitizeProductDescription,
                productSpecification: sanitizeProductSpecification,
            };

            return crudService.post("product/add-product", true, sanitizedData, "multipart/form-data");
        },
        onSuccess: data => {
            navigate("/admin/products/products-list");
            queryClient.invalidateQueries("productsList");
            toastService.success(data?.message);
        },
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            setError("root", { message });
        },
    });

    if (isPending) return <LoadingOverlay />;
    return (
        <>
            <Helmet>
                <title>Add New Product | sameerCart</title>
                <meta name="description" content="Add a new product to sameerCart store. Upload images, set pricing, and manage inventory." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <PageHeader title={"Manage Products"} controller={"Products"} controllerUrl={"/admin/products/products-list"} page={"Add Product's"} />
            <section className="w-full">
                <div className="my-4 w-full container mx-auto border-t-4 border-blue-700 rounded-lg p-2 bg-gray-100 dark:bg-slate-800">
                    <form className="space-y-5" onSubmit={handleSubmit(data => mutate(data))} encType="multipart/form-data">
                        <h1 className="text-xl font-bold my-4 px-2">Add Products</h1>
                        {errors.root && (
                            <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                                <h4 className="text-white font-bold text-sm">{errors.root.message}</h4>
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
                                    placeholder="View The Product Slug"
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
                            <div className="w-full lg:w-1/2 px-2 my-2">
                                <Controller
                                    name="productCategoryId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            label="Product Category"
                                            placeholder="Select The Category"
                                            title="Select The Category"
                                            options={categoryOptions?.data}
                                            disabled={isPending}
                                            {...register("productCategoryId")}
                                            onChange={e => {
                                                field.onChange(e.target.value);
                                                setSelectedCategory(e.target.value);
                                            }}
                                            value={field.value}
                                            error={errors.productCategoryId?.message}
                                            className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                        />
                                    )}
                                />
                            </div>
                            <div className="w-full lg:w-1/2 px-2 my-2">
                                <Select
                                    label="Product Sub-Category"
                                    placeholder="Select The Sub-Category"
                                    title="Select The Sub-Category"
                                    options={SubCategoryOptions?.data}
                                    disabled={isPending}
                                    {...register("productSubCategoryId")}
                                    defaultValue="default"
                                    error={errors.productSubCategoryId?.message}
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
                                            additionalTitle="Note:- [For Best View Of Product Image Width:500px, Height:500px]"
                                            type="file"
                                            disabled={isPending}
                                            accept=".jpg, .jpeg, .png, .gif, .svg, .webp"
                                            onChange={e => {
                                                field.onChange(e.target.files[0]);
                                            }}
                                            className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                            error={errors.productFeatureImage?.message}
                                        />
                                    )}
                                />
                            </div>
                            <div className="w-full lg:w-1/2 px-2">
                                <Select
                                    label="Product Type"
                                    placeholder="Select The Product Type"
                                    title="Select The Product Type"
                                    options={productTypeOptions}
                                    disabled={isPending}
                                    {...register("productType")}
                                    defaultValue="default"
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
                                        {...register("basePrice")}
                                        className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                        error={errors.basePrice?.message}
                                    />
                                </div>
                                <div className="w-full lg:w-1/2 px-2">
                                    <Input
                                        label="Product Discount Price"
                                        placeholder="Enter The Product Discount Price"
                                        {...register("productDiscountPrice")}
                                        className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                        error={errors.productDiscountPrice?.message}
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
                                        {...register("productStock")}
                                        disabled={isPending}
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
                                    placeholder="Enter The Product Specification"
                                    {...register("productSpecification")}
                                    error={errors.productSpecification?.message}
                                    className="text-xl rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                                />
                            </Suspense>
                        </div>
                        <div className="w-full border-t !mt-6">
                            <Button disabled={isPending} className="Primary my-2 btnXl">
                                {isPending ? (
                                    <Loading height="7" weight="7" />
                                ) : (
                                    <>
                                        <FaPlus /> Add
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

export default AddProducts;
