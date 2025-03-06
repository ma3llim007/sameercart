import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getMaxDate, orderShippingActionOptions } from "@/utils";
import { Button } from "@/components/ui/button";
import { FaRegEdit } from "react-icons/fa";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import { orderShippingActionPaymentOptions } from "@/utils/options";
import { shippingOrderScheme } from "@/validation/admin/OrderScheme";
import Loading from "../Loading";
import Select from "@/components/Form/Select";
import Input from "@/components/Form/Input";

const ShippingOrderForm = ({ orderId, setIsMutationIsLoading }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        handleSubmit,
        formState: { errors },
        register,
        setError,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(shippingOrderScheme),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: data => crudService.patch(`/order/update-shipping-order/${orderId}`, true, data),
        onMutate: () => setIsMutationIsLoading(true),
        onSuccess: data => {
            navigate(`/admin/orders/shipping-order`);
            queryClient.invalidateQueries(["viewShippingOrder", orderId]);
            toastService.success(data?.message);
        },
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            setError("root", { message });
        },
        onSettled: () => setIsMutationIsLoading(false),
    });

    return (
        <form className="space-y-5 border-2 rounded-xl mt-4 border-green-700" onSubmit={handleSubmit(data => mutate(data))} encType="multipart/form-data" method="POST">
            <h1 className="text-xl font-bold py-4 px-2 bg-green-700 rounded-t-lg text-white">Order Action</h1>
            {errors.root && (
                <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                    <h4 className="text-white font-bold text-sm">{errors.root.message}</h4>
                </div>
            )}
            <div className="flex flex-wrap my-2 gap-4 lg:gap-0">
                <div className="w-full md:w-1/2 px-2">
                    <Select
                        label="Order Status"
                        placeholder="Select a Order Status"
                        title="Select a Order Status"
                        options={orderShippingActionOptions}
                        defaultValue="default"
                        name="orderStatus"
                        disabled={isPending}
                        {...register("orderStatus")}
                        error={errors.orderStatus?.message}
                        className="text-xl rounded-sm p-3 border border-gray-600 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                    />
                </div>
                <div className="w-full md:w-1/2 px-2">
                    <Input
                        label="Delivery Date"
                        placeholder="Pick A Delivery Date"
                        {...register("completeOrderdate", { valueAsDate: true })}
                        type="date"
                        disabled={isPending}
                        min={new Date().toISOString().split("T")[0]}
                        max={getMaxDate(3).toISOString().split("T")[0]}
                        className="text-xl rounded-sm p-3 border border-gray-600 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        error={errors.completeOrderdate?.message}
                    />
                </div>
            </div>
            <div className="flex flex-wrap">
                <div className="w-full md:w-1/2 px-2">
                    <Select
                        label="Payment Status"
                        placeholder="Select a Payment Status"
                        title="Select a Payment Status"
                        options={orderShippingActionPaymentOptions}
                        defaultValue="default"
                        name="paymentStatus"
                        disabled={isPending}
                        {...register("paymentStatus")}
                        error={errors.paymentStatus?.message}
                        className="text-xl rounded-sm p-3 border border-gray-600 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                    />
                </div>
            </div>
            <div className="w-full border-t px-2">
                <Button type="submit" disabled={isPending} className="Primary my-2 btnXl">
                    {isPending ? (
                        <Loading height="7" weight="7" />
                    ) : (
                        <>
                            <FaRegEdit /> Update
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
};

export default ShippingOrderForm;
