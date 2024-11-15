import React, { useEffect } from "react";
import { Input, Loading, PageHeader } from "../components";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { yupResolver } from "@hookform/resolvers/yup";
import { addCategoryScheme } from "@/validation";
import { slugTransform } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import { useNavigate } from "react-router-dom";
import toastService from "@/services/toastService";

const AddCategory = () => {
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
        resolver: yupResolver(addCategoryScheme),
        mode: "onChange",
    });

    const { mutate, isPending } = useMutation({
        mutationFn: data => crudService.post("category/add-category", true, data, "multipart/form-data"),
        onSuccess: data => {
            navigate("/admin/category/category-list");
            queryClient.invalidateQueries("adminsList");
            toastService.success(data?.message);
        },
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            setError("root", { message });
        },
    });

    // Updating the slug value on title change
    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "categoryName" && value.categoryName) {
                const transfromedSlug = slugTransform(value.categoryName);
                setValue("categorySlug", transfromedSlug, { shouldValidate: true });
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, setValue]);

    return (
        <>
            <PageHeader title={"Manage Category"} controller={"Category"} controllerUrl={"/admin/category/add-category/"} page={"Add Category's"} />
            <section className="w-full">
                <div className="my-4 w-full container mx-auto border-t-4 border-blue-700 rounded-lg p-2 bg-gray-100 dark:bg-slate-800">
                    <form className="space-y-5" onSubmit={handleSubmit(data => mutate(data))} encType="multipart/form-data">
                        <h1 className="text-xl font-bold my-4 px-2">Add Category</h1>
                        {errors.root && (
                            <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                                <h4 className="text-white font-bold text-sm">{errors.root.message}</h4>
                            </div>
                        )}
                        <div className="flex flex-wrap my-2">
                            <div className="w-full md:w-1/2 px-2 flex-grow">
                                <Input
                                    label="Category Name"
                                    placeholder="Enter The Category Name"
                                    {...register("categoryName")}
                                    disabled={isPending}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    error={errors.categoryName?.message}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap my-2">
                            <div className="w-full md:w-1/2 px-2">
                                <Input
                                    label="Slug"
                                    placeholder="View The Category Slug"
                                    {...register("categorySlug")}
                                    disabled={isPending}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    error={errors.categorySlug?.message}
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-2">
                                <Controller
                                    control={control}
                                    name="categoryImage"
                                    render={({ field }) => (
                                        <Input
                                            label="Select The Category Image"
                                            title="Select The Category Image"
                                            type="file"
                                            disabled={isPending}
                                            accept=".jpg, .jpeg, .png, .gif, .svg, .webp"
                                            onChange={e => field.onChange(e.target.files[0])}
                                            className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            error={errors.categoryImage?.message}
                                        />
                                    )}
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

export default AddCategory;