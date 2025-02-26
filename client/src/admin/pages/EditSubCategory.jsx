import crudService from "@/api/crudService";
import { editSubCategoryScheme } from "@/validation/admin/subCategoyrSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { slugTransform } from "@/utils";
import { FaEdit } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import toastService from "@/services/toastService";
import Loading from "../components/Loading";
import PageHeader from "../components/PageHeader";
import { Input, Select } from "@/components";

const EditSubCategory = () => {
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
        resolver: yupResolver(editSubCategoryScheme),
        mode: "onChange",
        defaultValues: {
            parentCategory: "",
            subCategoryName: "",
            subCategorySlug: "",
            subCategoryImage: "",
        },
    });
    const { subCategoryId } = useParams();

    // get the cateogry for options
    const { data: categoryOptions, isLoading } = useQuery({
        queryKey: ["categoryOptions"],
        queryFn: () => crudService.get("category/options-category", true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });

    // Fetch sub-category data based on subCategoryId
    const { data: subCategoryData, isSuccess } = useQuery({
        queryKey: ["subCategoryDetails", subCategoryId],
        queryFn: () => crudService.get(`sub-category/get-subcategory/${subCategoryId}`, true),
        enabled: !!subCategoryId,
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });
    // setting the value to forms
    useEffect(() => {
        if (isSuccess && subCategoryData?.data) {
            const { subCategoryName, subCategorySlug, parentCategory } = subCategoryData?.data[0] || {};
            setValue("parentCategory", parentCategory);
            setValue("subCategoryName", subCategoryName);
            setValue("subCategorySlug", subCategorySlug);
        }
    }, [isSuccess, subCategoryData, setValue]);

    // update the data
    const { mutate, isPending } = useMutation({
        mutationFn: data => {
            const formData = new FormData();
            formData.append("parentCategory", data?.parentCategory);
            formData.append("subCategoryName", data?.subCategoryName);
            formData.append("subCategorySlug", data?.subCategorySlug);
            if (data?.subCategoryImage) formData.append("subCategoryImage", data?.subCategoryImage);
            formData.append("subCategoryId", subCategoryId);
            return crudService.patch("sub-category/update-subcategory/", true, formData, "multipart/form-data");
        },
        onSuccess: data => {
            navigate("/admin/sub-category/");
            queryClient.invalidateQueries("subCategoryList");
            queryClient.removeQueries(["subCategoryDetails", subCategoryId]);
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
            <PageHeader title="Manage Sub-Category" controller="Sub-Category" controllerUrl="/admin/sub-category/" page="Edit Sub Category" />
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
                                    disabled={isPending}
                                    {...register("parentCategory")}
                                    defaultValue={subCategoryData?.data[0]?.parentCategory}
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
                        <div className="flex flex-wrap my-2">
                            <div className="w-full md:w-1/2 px-2">
                                <Controller
                                    control={control}
                                    name="subCategoryImage"
                                    render={({ field }) => (
                                        <Input
                                            label="Select The Sub-Category Image"
                                            additionalTitle="Note:- [For Best View Of Sub Category Image Width:350px, Height:250px]"
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
                            <div className="w-full md:w-1/2 px-2">
                                <div className="w-full">
                                    <label className="inline-block mb-2 pl-1 text-base font-bold">Previous Image</label>
                                    <img src={subCategoryData?.data[0]?.subCategoryImage} className="max-w-60 max-h-40 object-cover rounded" alt="Previous Category" />
                                </div>
                            </div>
                        </div>
                        <div className="w-full border-t !mt-6">
                            <Button disabled={isPending} className="Success my-2 btnXl">
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

export default EditSubCategory;
