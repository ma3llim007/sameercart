import React from "react";
import { Input, Loading, PageHeader, TextArea } from "../components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { addBrandSchema } from "@/validation/admin/BrandScheme";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import { useNavigate } from "react-router-dom";
import toastService from "@/services/toastService";

const AddBrands = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        setError,
    } = useForm({
        resolver: yupResolver(addBrandSchema),
        mode: "onChange",
    });

    const { mutate, isPending } = useMutation({
        mutationFn: data => crudService.post("/brand/add-brand", true, data, "multipart/form-data"),
        onSuccess: data => {
            navigate("/admin/brands/brands-list");
            queryClient.invalidateQueries("adminsList");
            toastService.success(data?.message);
        },
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            setError("root", { message });
        },
    });
    return (
        <>
            <PageHeader title={"Manage Brands"} controller={"Brands"} controllerUrl={"/admin/brands/brands-list/"} page={"Add Brands's"} />
            <section className="w-full">
                <div className="my-4 w-full container mx-auto border-t-4 border-blue-700 rounded-lg p-2 bg-gray-100 dark:bg-slate-800">
                    <form className="space-y-5" onSubmit={handleSubmit(data => mutate(data))} encType="multipart/form-data">
                        <h1 className="text-xl font-bold my-4 px-2">Add Brand</h1>
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

export default AddBrands;
