import crudService from "@/api/crudService";
import Loader from "@/client/components/Loader/Loader";
import toastService from "@/services/toastService";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ShippingOrderForm from "../components/orders/ShippingOrderForm";
import PageHeader from "../components/PageHeader";
import UserDetails from "../components/orders/UserDetails";
import OrderDetails from "../components/orders/OrderDetails";
import OrderItem from "../components/orders/OrderItem";
import LoadingOverlay from "@/components/LoadingOverlay";
import { Helmet } from "react-helmet-async";

const ViewShippingOrder = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [isMutationIsLoading, setIsMutationIsLoading] = useState(false);

    // fetching data of order
    const { data, isPending } = useQuery({
        queryKey: ["viewShippingOrder", orderId],
        queryFn: () => crudService.get(`order/view-order/${orderId}`, true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
        enabled: !!orderId,
        cacheTime: 2 * 60 * 1000, // 2 minutes
    });
    const { user, shippingAddress, orderItems } = data?.data || {};

    useEffect(() => {
        if (!isPending && data?.data?.orderStatus !== "Shipping") {
            toastService.info("Access Denied: At This Moment You Cannot Access The Page");
            navigate("/admin/orders/shipping-order/");
        }
    }, [isPending, data, navigate]);

    if (isPending) return <Loader />;
    if (isMutationIsLoading) return <LoadingOverlay />;
    return (
        <>
            <Helmet>
                <title>View Shipping Order | sameerCart</title>
                <meta name="description" content="Check details of a shipping order in sameerCart admin panel, including tracking and delivery status." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <PageHeader title={"Manage Order's"} controller={"Shipping Order Listing"} controllerUrl={"/admin/orders/shipping-order/"} page={"View Shipping Order"} />
            <section className="w-full">
                <div className="my-4 w-full container mx-auto border-t-4 border-blue-700 rounded-lg p-4 bg-gray-100 dark:bg-slate-800">
                    <h1 className="text-2xl font-bold underline underline-offset-4 mb-4">View Order</h1>
                    <div className="space-y-4">
                        <ShippingOrderForm orderId={orderId} setIsMutationIsLoading={setIsMutationIsLoading} />
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

export default ViewShippingOrder;
