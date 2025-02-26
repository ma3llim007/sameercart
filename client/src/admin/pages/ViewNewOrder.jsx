import { useQuery } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import { useNavigate, useParams } from "react-router-dom";
import toastService from "@/services/toastService";
import Loader from "@/client/components/Loader/Loader";
import { useEffect, useState } from "react";
import { LoadingOverlay } from "@/components";
import PageHeader from "../components/PageHeader";
import ViewOrderForm from "../components/orders/ViewOrderForm";
import UserDetails from "../components/orders/UserDetails";
import OrderDetails from "../components/orders/OrderDetails";
import OrderItem from "../components/orders/OrderItem";

const ViewNewOrder = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [mutateIsLoading, setMutateIsLoading] = useState(false);

    // fetching data of order
    const { data, isPending } = useQuery({
        queryKey: ["viewNewOrder", orderId],
        queryFn: () => crudService.get(`order/view-order/${orderId}`, true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
        enabled: !!orderId,
        cacheTime: 2 * 60 * 1000, // 2 minutes
    });
    const { user, shippingAddress, orderItems } = data?.data || {};

    useEffect(() => {
        if (!isPending && data?.data?.orderStatus !== "Order") {
            toastService.info("Access Denied: At This Moment You Cannot Access The Page");
            navigate("/admin/orders/new-order/");
        }
    }, [isPending, data, navigate]);

    if (isPending) return <Loader />;
    if (mutateIsLoading) return <LoadingOverlay />;
    return (
        <>
            <PageHeader title={"Manage Order's"} controller={"New Order Listing"} controllerUrl={"/admin/orders/new-order/"} page={"View Order"} />
            <section className="w-full">
                <div className="my-4 w-full container mx-auto border-t-4 border-blue-700 rounded-lg p-4 bg-gray-100 dark:bg-slate-800">
                    <h1 className="text-2xl font-bold underline underline-offset-4 mb-4">View Order</h1>
                    <div className="space-y-4">
                        <ViewOrderForm orderId={orderId} setMutateIsLoading={setMutateIsLoading} />
                        <hr className="!my-6" />
                        <UserDetails userData={user} address={shippingAddress} />
                        <OrderDetails
                            order={{
                                orderId: data?.data?._id,
                                orderDate: data.data?.orderDate,
                                paymentStatus: data.data?.paymentStatus,
                                orderStatus: data.data?.orderStatus,
                                paymentType: data.data?.paymentType,
                                totalAmount: data.data?.totalAmount,
                                additionalInformation: data.data?.additionalInformation,
                            }}
                        />
                        <OrderItem orderItem={orderItems} />
                    </div>
                </div>
            </section>
        </>
    );
};

export default ViewNewOrder;
