import crudService from "@/api/crudService";
import Loader from "@/client/components/Loader/Loader";
import toastService from "@/services/toastService";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import UserDetails from "../components/orders/UserDetails";
import OrderDetails from "../components/orders/OrderDetails";
import OrderItem from "../components/orders/OrderItem";
import { Helmet } from "react-helmet-async";

const ViewCanceledOrder = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    // fetching data of order
    const { data, isPending } = useQuery({
        queryKey: ["viewCanceledOrder", orderId],
        queryFn: () => crudService.get(`order/view-order/${orderId}`, true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
        enabled: !!orderId,
        cacheTime: 2 * 60 * 1000, // 2 minutes
    });
    const { user, shippingAddress, orderItems } = data?.data || {};

    useEffect(() => {
        if (!isPending && data?.data?.orderStatus !== "CanceledByUser" && data?.data?.orderStatus !== "CanceledByAdmin") {
            toastService.info("Access Denied: At This Moment You Cannot Access The Page");
            navigate("/admin/orders/canceled-order/");
        }
    }, [isPending, data, navigate]);

    if (isPending) return <Loader />;
    return (
        <>
            <Helmet>
                <title>Canceled Orders | sameerCart</title>
                <meta name="description" content="View and manage all canceled orders in sameerCart admin panel. Check refund and customer queries." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <PageHeader title={"Manage Order's"} controller={"Canceled Order Listing"} controllerUrl={"/admin/orders/canceled-order/"} page={"View Canceled Order"} />
            <section className="w-full">
                <div className="my-4 w-full container mx-auto border-t-4 border-blue-700 rounded-lg p-4 bg-gray-100 dark:bg-slate-800">
                    <h1 className="text-2xl font-bold underline underline-offset-4 mb-4">View Order</h1>
                    <div className="space-y-4">
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
                                orderCancelReason: data.data?.orderCancelReason,
                            }}
                        />
                        <OrderItem orderItem={orderItems} />
                    </div>
                </div>
            </section>
        </>
    );
};

export default ViewCanceledOrder;
