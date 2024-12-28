import React, { useEffect } from "react";
import { Input, Loading, PageHeader } from "../components";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { yupResolver } from "@hookform/resolvers/yup";
import { editVariantScheme } from "@/validation/admin/ProductScheme";

const EditVariant = () => {
    const { productId, variantId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        setError,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(editVariantScheme),
        defaultValues: {
            attributes: [],
        },
    });

    const { data, isLoading, isSuccess } = useQuery({
        queryKey: ["variant", variantId],
        enabled: !!variantId,
        queryFn: () =>
            crudService.get(`variant/variant-by-id/${variantId}`, true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });
    useEffect(() => {
        if (isSuccess && data?.data) {
            const { sku, priceAdjustment, stockQty, attributes } = data?.data;
            setValue("sku", sku);
            setValue("priceAdjustment", priceAdjustment);
            setValue("stockQty", stockQty);

            // Map attributes object into array format
            if (attributes) {
                const attributesArray = Object.entries(attributes).map(
                    ([key, value]) => ({ key, value })
                );
                setValue("attributes", attributesArray);
            }
        }
    }, [isSuccess, data, setValue]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "attributes",
    });

    // update the data
    const { mutate, isPending } = useMutation({
        mutationFn: data => {
            const formData = new FormData();
            formData.append("variantId", variantId);
            formData.append("priceAdjustment", data?.priceAdjustment);
            formData.append("stockQty", data?.stockQty);
            // Convert attributes into an object
            const attributesObject = data?.attributes.reduce((acc, attr) => {
                acc[attr.key.trim()] = attr.value;
                return acc;
            }, {});
            // Convert object into JSON stringify for sending
            formData.append("attributes", JSON.stringify(attributesObject));
            return crudService.patch(`variant/update-variant`, true, formData);
        },
        onSuccess: data => {
            navigate(`/admin/products/variants/${productId}`);
            queryClient.invalidateQueries(["variantList", productId]);
            queryClient.removeQueries(["variant", variantId]);
            toastService.success(data?.message);
            setSkuTrigger(prev => prev + 1);
        },
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            setError("root", { message });
        },
    });

    if (isLoading) return <Loading />;
    return (
        <>
            <PageHeader
                title={"Manage Variant"}
                controller={"Products"}
                controllerUrl={`/admin/products/products-list`}
                subController={"Variants"}
                subControllerUrl={`/admin/products/variants/${productId}`}
                page={"Edit Variant"}
            />
            <section className="w-full">
                <div className="my-4 w-full container mx-auto border-t-4 border-blue-700 rounded-lg p-2 bg-gray-100 dark:bg-slate-800">
                    <form
                        className="space-y-5"
                        onSubmit={handleSubmit(data => mutate(data))}
                        encType="multipart/form-data"
                    >
                        <h1 className="text-xl font-bold my-4 px-2">
                            Edit Variant
                        </h1>
                        {errors.root && (
                            <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                                <h4 className="text-white font-bold text-sm">
                                    {errors.root.message}
                                </h4>
                            </div>
                        )}
                        <div className="flex flex-wrap my-2">
                            <div className="w-full md:w-10/12 px-2 my-2">
                                <Input
                                    label="SKU"
                                    placeholder="SKU"
                                    {...register("sku")}
                                    onPaste={e => e.preventDefault()}
                                    onCopy={e => e.preventDefault()}
                                    readOnly
                                    disabled
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                    error={errors?.sku?.message}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap my-2">
                            <div className="w-full md:w-1/2 px-2 my-2">
                                <Input
                                    label="Price Adjustement"
                                    {...register("priceAdjustment")}
                                    placeholder="Enter The Price Adjustement"
                                    defaultValue="0"
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                    error={errors?.priceAdjustment?.message}
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-2 my-2">
                                <Input
                                    label="Stock Quantity"
                                    placeholder="Enter The Stock Quantity"
                                    defaultValue="0"
                                    {...register("stockQty")}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                    error={errors.stockQty?.message}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap my-2">{}</div>
                        <div className="w-full px-3">
                            <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
                                <h2 className="text-2xl font-bold px-2">
                                    Attribues
                                </h2>
                                <Button
                                    disabled={isPending}
                                    className="Success btnLg flex items-center gap-2"
                                    onClick={() =>
                                        append({ key: "", value: "" })
                                    }
                                >
                                    <FaPlus /> Add Variant
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="flex flex-wrap items-center justify-center gap-4 p-4 shadow-md rounded-lg border"
                                    >
                                        <div className="flex justify-center items-center min-h-[90px]">
                                            <Button
                                                className="Danger flex items-center gap-2 p-5 mt-6 rounded-md"
                                                onClick={() => remove(index)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                placeholder="Key"
                                                disabled={isPending}
                                                label="Key"
                                                {...register(
                                                    `attributes.${index}.key`
                                                )}
                                                className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                                error={
                                                    errors.attributes?.[index]
                                                        ?.key?.message
                                                }
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                placeholder="value"
                                                disabled={isPending}
                                                label="value"
                                                {...register(
                                                    `attributes.${index}.value`
                                                )}
                                                className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                                error={
                                                    errors.attributes?.[index]
                                                        ?.value?.message
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-full border-t !mt-8 px-2">
                            <Button
                                type="submit"
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

export default EditVariant;
