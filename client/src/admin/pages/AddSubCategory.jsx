import React, { useEffect } from "react";
import { Input, Loading, PageHeader, Select } from "../components";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { slugTransform } from "@/utils";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import crudService from "@/api/crudService";
import { yupResolver } from "@hookform/resolvers/yup";
import { addSubCategoryScheme } from "@/validation/admin/subCategoyrSchema";
import { useNavigate } from "react-router-dom";
import toastService from "@/services/toastService";

const AddSubCategory = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const {
        handleSubmit,
        register,
        formState: { errors },
        watch,
        control,
        setValue,
        setError,
    } = useForm({
        resolver: yupResolver(addSubCategoryScheme),
        mode: "onChange",
    });

    // get the cateogry for options
    const { data: categoryOptions, isLoading } = useQuery({
        queryKey: ["categoryOptions"],
        queryFn: () => crudService.get("category/options-category", true),
        onError: err => {
            toastService.error("Error fetching categories data:", err.message);
        },
    });

    // Insert The Sub Category
    const { mutate, isPending } = useMutation({
        mutationFn: data => crudService.post("sub-category/add-subcategory", true, data, "multipart/form-data"),
        onSuccess: data => {
            navigate("/admin/sub-category/subcategory-list");
            queryClient.invalidateQueries("subCategoryList");
            toastService.success(data?.message);
        },
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            setError("root", { message });
        },
    });

    // Automatically update slug when sub-category name changes
    useEffect(() => {
        const UpdateSlug = (name, value) => {
            if (name === "subCategoryName") {
                const transformedSlug = slugTransform(value.subCategoryName || "");
                setValue("subCategorySlug", transformedSlug, { shouldValidate: true });
            }
        };

        const subscription = watch((value, { name }) => {
            UpdateSlug(name, value);
        });

        return () => subscription.unsubscribe();
    }, [watch, setValue]);

    if (isLoading) return <Loading />;
    return (
        <>
            <PageHeader title="Manage Sub-Category" controller="Sub-Category" controllerUrl="/admin/sub-category/" page="Add Sub Category's" />
            <section className="w-full">
                <div className="my-4 w-full container mx-auto border-t-4 border-blue-700 rounded-lg p-2 bg-gray-100 dark:bg-slate-800">
                    <form className="space-y-5" onSubmit={handleSubmit(data => mutate(data))} encType="multipart/form-data">
                        <h1 className="text-xl font-bold my-4 px-2">Add Sub-Category</h1>
                        {errors.root && (
                            <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                                <h4 className="text-white font-bold text-sm">{errors.root.message}</h4>
                            </div>
                        )}
                        <div className="flex flex-wrap my-2">
                            <div className="w-full md:w-1/2 px-2">
                                <Select
                                    label="Select The Category"
                                    placeholder="Select The Category"
                                    title="Select The Category"
                                    options={categoryOptions?.data}
                                    error={errors.parentCategory?.message}
                                    isRequired="true"
                                    disabled={isPending}
                                    {...register("parentCategory")}
                                    defaultValue="default"
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-2">
                                <Controller
                                    control={control}
                                    name="subCategoryImage"
                                    render={({ field }) => (
                                        <Input
                                            label="Select The Sub-Category Image"
                                            title="Select The Sub-Category Image"
                                            type="file"
                                            disabled={isPending}
                                            accept=".jpg, .jpeg, .png, .gif, .svg, .webp"
                                            onChange={e => field.onChange(e.target.files[0])}
                                            className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            error={errors.subCategoryImage?.message}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap my-2">
                            <div className="w-full md:w-1/2 px-2">
                                <Input
                                    label="Sub-Category Name"
                                    placeholder="Enter The Sub-Category Name"
                                    {...register("subCategoryName")}
                                    disabled={isPending}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    error={errors.subCategoryName?.message}
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-2">
                                <Input
                                    label="Sub-Category Slug"
                                    placeholder="View The Sub-Category Slug"
                                    {...register("subCategorySlug")}
                                    disabled={isPending}
                                    onPaste={e => e.preventDefault()}
                                    onCopy={e => e.preventDefault()}
                                    readOnly
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    error={errors.subCategorySlug?.message}
                                />
                            </div>
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

export default AddSubCategory;
