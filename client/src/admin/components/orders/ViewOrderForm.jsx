import { getMaxDate, orderViewActionOptions } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FaRegEdit } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import { useNavigate } from "react-router-dom";
import toastService from "@/services/toastService";
import { newOrderScheme } from "@/validation/admin/OrderScheme";
import { Input, Select, TextArea } from "@/components";
import Loading from "../Loading";

const ViewOrderForm = ({ orderId, setMutateIsLoading }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        handleSubmit,
        formState: { errors },
        register,
        watch,
        setError,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(newOrderScheme),
    });
    const orderStatusCurrentValue = watch("orderStatus");

    const { mutate, isPending } = useMutation({
        mutationFn: data => crudService.patch(`/order/update-view-order/${orderId}`, true, data),
        onMutate: () => setMutateIsLoading(true),
        onSuccess: data => {
            navigate(`/admin/orders/new-order`);
            queryClient.invalidateQueries(["viewNewOrder", orderId]);
            toastService.success(data?.message);
        },
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            setError("root", { message });
        },
        onSettled: () => setMutateIsLoading(false),
    });
    return (
        <form className="space-y-5 border-2 rounded-xl mt-4 border-green-700" onSubmit={handleSubmit(data => mutate(data))} encType="multipart/form-data" method="POST">
            <h1 className="text-xl font-bold py-4 px-2 bg-green-700 rounded-t-lg text-white">Order Action</h1>
            {errors.root && (
                <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                    <h4 className="text-white font-bold text-sm">{errors.root.message}</h4>
                </div>
            )}
            <div className="flex flex-wrap my-2">
                <div className="w-full md:w-1/2 px-2 my-2">
                    <Select
                        label="Order Status"
                        placeholder="Select a Order Status"
                        title="Select a Order Status"
                        options={orderViewActionOptions}
                        defaultValue="default"
                        name="orderStatus"
                        disabled={isPending}
                        {...register("orderStatus")}
                        error={errors.orderStatus?.message}
                        className="text-xl rounded-sm p-3 border border-gray-600 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                    />
                </div>
                {orderStatusCurrentValue === "Shipping" && (
                    <div className="w-full md:w-1/2 px-2 my-2">
                        <Input
                            label="Expected Delivery Date"
                            placeholder="Pick A Delivery Date"
                            {...register("orderShippingDate")}
                            type="date"
                            disabled={isPending}
                            max={getMaxDate().toISOString().split("T")[0]}
                            className="text-xl rounded-sm p-3 border border-gray-600 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            error={errors.orderShippingDate?.message}
                        />
                    </div>
                )}
            </div>
            {orderStatusCurrentValue === "CanceledByAdmin" && (
                <div className="flex flex-wrap gap-2 lg:gap-0">
                    <div className="w-full lg:w-1/2 flex-grow px-2">
                        <TextArea
                            label="Cancellation Reason"
                            disabled={isPending}
                            placeholder="Provide A Reason For Cancellation (e.g., Incorrect Order, Change Of Mind, Delayed Delivery)."
                            className={`w-full text-lg rounded px-3 py-3 border border-gray-600 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 cursor-auto`}
                            {...register("orderCancelReason")}
                            error={errors.orderCancelReason?.message}
                        />
                    </div>
                </div>
            )}
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

export default ViewOrderForm;
