import React, { Suspense, useEffect, useState } from "react";
import { Input, Loading, PageHeader, Select } from "../components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import Loader from "@/client/components/Loader/Loader";
import RichTextEditor from "../components/Form/RichTextEditor";
import { hasVariantsOptions, slugTransform } from "@/utils";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import DOMPurify from "dompurify";
import { addProductScheme } from "@/validation";
import { LoadingOverlay } from "@/components";

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
    const hasVariants = watch("hasVariants");

    // Fetching The Brand Data For Options
    const { data: brandOption, isLoading } = useQuery({
        queryKey: ["brandOptions"],
        queryFn: () => crudService.get("brand/get-brands-options", true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });

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
                return crudService.get(
                    `sub-category/get-subcategory-option/${selectedCategory}`,
                    true
                );
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
            const sanitizeProductDescription =
                DOMPurify.sanitize(productDescription);
            const sanitizeProductSpecification =
                DOMPurify.sanitize(productSpecification);

            // Create a new data object with sanitized content
            const sanitizedData = {
                ...data,
                productDescription: sanitizeProductDescription,
                productSpecification: sanitizeProductSpecification,
            };
            return crudService.post(
                "product/add-product",
                true,
                sanitizedData,
                "multipart/form-data"
            );
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

    if (isLoading) return <Loading />;
    if (isPending) return <LoadingOverlay />;
    return (
        <>
            <PageHeader
                title={"Manage Products"}
                controller={"Products"}
                controllerUrl={"/admin/products/products-list"}
                page={"Add Product's"}
            />
            <section className="w-full">
                <div className="my-4 w-full container mx-auto border-t-4 border-blue-700 rounded-lg p-2 bg-gray-100 dark:bg-slate-800">
                    <form
                        className="space-y-5"
                        onSubmit={handleSubmit(data => mutate(data))}
                        encType="multipart/form-data"
                    >
                        <h1 className="text-xl font-bold my-4 px-2">
                            Add Products
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
                                <Input
                                    label="Product Price"
                                    placeholder="Enter The Product Price"
                                    {...register("productPrice")}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                    error={errors.productPrice?.message}
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-2">
                                <Select
                                    label="Select The Brand"
                                    placeholder="Select The Brand"
                                    title="Select The Brand"
                                    options={brandOption?.data}
                                    isRequired="true"
                                    disabled={isPending}
                                    {...register("productBrand")}
                                    error={errors.productBrand?.message}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
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
                                            value={field.value}
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
                                    defaultValue="default"
                                    error={errors.productSubCategoryId?.message}
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
                                            type="file"
                                            disabled={isPending}
                                            accept=".jpg, .jpeg, .png, .gif, .svg, .webp"
                                            onChange={e => {
                                                field.onChange(
                                                    e.target.files[0]
                                                );
                                            }}
                                            className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                            error={
                                                errors.productFeatureImage
                                                    ?.message
                                            }
                                        />
                                    )}
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-2">
                                <Select
                                    label="Select The Variants"
                                    placeholder="Select The Variants Options"
                                    title="Specify If This Product Has Variants"
                                    options={hasVariantsOptions}
                                    isRequired="true"
                                    disabled={isPending}
                                    {...register("hasVariants")}
                                    defaultValue="default"
                                    name="hasVariants"
                                    error={errors.hasVariants?.message}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                />
                            </div>
                        </div>
                        {hasVariants === "false" && (
                            <div className="flex flex-wrap my-2">
                                <div className="w-full md:w-1/2 px-2">
                                    <Input
                                        label="Product Stock"
                                        placeholder="Enter The Product Stock"
                                        {...register("productStock")}
                                        disabled={isPending}
                                        className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                        error={errors.productStock?.message}
                                    />
                                </div>
                            </div>
                        )}
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
                            <Button
                                disabled={isPending}
                                className="Primary my-2 btnXl"
                            >
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
