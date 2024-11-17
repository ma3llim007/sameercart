import React, { useEffect } from "react";
import { Input, Loading, PageHeader } from "../components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editCategorySchema } from "@/validation/admin/categorySchema";
import { PreventAction, slugTransform } from "@/utils";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";
import crudService from "@/api/crudService";

const EditCategory = () => {
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
        resolver: yupResolver(editCategorySchema),
        mode: "onChange",
        defaultValues: {
            categoryName: "",
            categorySlug: "",
            categoryImage: "",
        },
    });
    const { categoryId } = useParams();

    // Fetch category data based on categoryId
    const { data: categoryData, isSuccess } = useQuery({
        queryKey: ["category", categoryId],
        queryFn: () => crudService.get(`category/get-category/${categoryId}`, true),
        enabled: !!categoryId,
        onError: err => {
            toastService.error("Error fetching categories data:", err.message);
        },
    });
    useEffect(() => {
        if (isSuccess && categoryData?.data) {
            const { categoryName, categorySlug } = categoryData?.data;
            setValue("categoryName", categoryName);
            setValue("categorySlug", categorySlug);
        }
    }, [isSuccess, categoryData, setValue]);

    // update the data
    const { mutate, isPending } = useMutation({
        // mutationFn: data => crudService.patch("category/update-category", true, data, "multipart/form-data"),
        mutationFn: data => {
            const formData = new FormData();
            formData.append("categoryName", data?.categoryName);
            formData.append("categorySlug", data?.categorySlug);
            if (data?.categoryImage) {
                formData.append("categoryImage", data?.categoryImage);
            }
            formData.append("categoryId", categoryId);
            return crudService.patch("category/update-category", true, formData, "multipart/form-data");
        },
        onSuccess: data => {
            navigate("/admin/category/category-list");
            queryClient.invalidateQueries("categoryList");
            toastService.success(data?.message);
        },
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            setError("root", { message });
        },
    });

    // Automatically update slug when category name changes
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
            <PageHeader title={"Manage Category"} controller={"Category"} controllerUrl={"/admin/category/edit-category/"} page={"Edit Category"} />
            <section className="w-full">
                <div className="my-4 w-full container mx-auto border-t-4 border-blue-700 rounded-lg p-2 bg-gray-100 dark:bg-slate-800">
                    <form className="space-y-5" onSubmit={handleSubmit(data => mutate(data))} encType="multipart/form-data">
                        <h1 className="text-xl font-bold my-4 px-2">Edit Category</h1>
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
                            <div className="w-full md:w-1/2 px-2 flex-grow">
                                <Input
                                    label="Slug"
                                    placeholder="View The Category Slug"
                                    {...register("categorySlug")}
                                    disabled={isPending}
                                    onPaste={PreventAction}
                                    onCopy={PreventAction}
                                    readOnly
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    error={errors.categorySlug?.message}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap my-2">
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
                            <div className="w-full md:w-1/2 px-2">
                                <div className="w-full">
                                    <label className="inline-block mb-2 pl-1 text-base font-bold">Previous Image</label>
                                    <img src={categoryData?.data?.categoryImage} className="w-40 h-40 object-cover rounded" alt="Previous Category" />
                                </div>
                            </div>
                        </div>
                        <div className="w-full border-t !mt-6">
                            <Button disabled={isPending} className="Primary my-2 btnXl">
                                {isPending ? (
                                    <Loading height="7" weight="7" />
                                ) : (
                                    <>
                                        <FaEdit /> Add
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

export default EditCategory;
