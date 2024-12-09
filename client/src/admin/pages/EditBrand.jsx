import React, { useEffect } from "react";
import { Input, Loading, PageHeader, TextArea } from "../components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaBackward, FaEdit } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { editBrandSchema } from "@/validation/admin/BrandScheme";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import { Link, useNavigate, useParams } from "react-router-dom";
import toastService from "@/services/toastService";

const EditBrand = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { brandId } = useParams();

    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        setError,
        setValue,
    } = useForm({
        resolver: yupResolver(editBrandSchema),
        mode: "onChange",
        defaultValues: {
            brandName: "",
            brandDescription: "",
            brandLogo: "",
        },
    });

    // Fetch Brand Data Based On BrandId
    const { data: brandData, isSuccess } = useQuery({
        queryKey: ["brand", brandId],
        queryFn: () => crudService.get(`brand/get-brand/${brandId}`, true),
        enabled: !!brandId,
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });
    useEffect(() => {
        if (isSuccess && brandData?.data) {
            const { brandName, brandDescription } = brandData?.data;
            setValue("brandName", brandName);
            setValue("brandDescription", brandDescription);
        }
    }, [isSuccess, brandData, setValue]);

    // update the data
    const { mutate, isPending } = useMutation({
        mutationFn: data => {
            const formData = new FormData();
            formData.append("brandName", data?.brandName);
            formData.append("brandDescription", data?.brandDescription);
            if (data?.brandLogo) {
                formData.append("brandLogo", data?.brandLogo);
            }
            formData.append("brandId", brandId);
            return crudService.patch("brand/update-brand", true, formData, "multipart/form-data");
        },
        onSuccess: data => {
            navigate("/admin/brands/brands-list");
            queryClient.invalidateQueries("brandList");
            queryClient.removeQueries(["brand", brandId]);
            toastService.success(data?.message);
        },
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            setError("root", { message });
        },
    });
    
    return (
        <>
            <PageHeader title={"Manage Brands"} controller={"Brands"} controllerUrl={"/admin/brands/brands-list/"} page={"Edit Brand"} />
            <section className="w-full">
                <div className="my-4 w-full container mx-auto border-t-4 border-blue-700 rounded-lg p-2 bg-gray-100 dark:bg-slate-800">
                    <form className="space-y-5" onSubmit={handleSubmit(data => mutate(data))} encType="multipart/form-data">
                        <h1 className="text-xl font-bold my-4 px-2">Edit Brand</h1>
                        {errors.root && (
                            <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                                <h4 className="text-white font-bold text-sm">{errors.root.message}</h4>
                            </div>
                        )}
                        <div className="flex flex-wrap my-2">
                            <div className="w-full md:w-1/2 px-2 flex-grow">
                                <Input
                                    label="Brand Name"
                                    placeholder="Enter The Brand Name"
                                    {...register("brandName")}
                                    disabled={isPending}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                    error={errors.brandName?.message}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap my-2">
                            <div className="w-full md:w-1/2 px-2">
                                <Controller
                                    control={control}
                                    name="brandLogo"
                                    render={({ field }) => (
                                        <Input
                                            label="Select The Brand Image"
                                            title="Select The Brand Image"
                                            type="file"
                                            disabled={isPending}
                                            accept=".jpg, .jpeg, .png, .gif, .svg, .webp"
                                            onChange={e => field.onChange(e.target.files[0])}
                                            className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                            error={errors.brandLogo?.message}
                                        />
                                    )}
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-2">
                                <div className="w-full">
                                    <label className="inline-block mb-2 pl-1 text-base font-bold">Previous Image</label>
                                    <img src={brandData?.data?.brandLogo} className="w-40 h-40 object-cover rounded" alt="Previous Category" />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap my-2">
                            <div className="w-full md:w-1/2 px-2 flex-grow">
                                <TextArea
                                    label="Brand Description"
                                    placeholder="Enter The Description"
                                    {...register("brandDescription")}
                                    disabled={isPending}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                    error={errors.brandDescription?.message}
                                />
                            </div>
                        </div>

                        <div className="w-full border-t !mt-6 space-x-3">
                            <Button disabled={isPending} className="Primary my-2 btnXl">
                                {isPending ? (
                                    <Loading height="7" weight="7" />
                                ) : (
                                    <>
                                        <FaEdit /> Update
                                    </>
                                )}
                            </Button>
                            <Link to="/admin/brands/brands-list">
                                <Button className="Secondary my-2 btnXl">
                                    <FaBackward /> Back
                                </Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default EditBrand;
