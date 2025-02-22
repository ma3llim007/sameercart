import crudService from "@/api/crudService";
import Loader from "@/client/components/Loader/Loader";
import toastService from "@/services/toastService";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OrderDetails, OrderItem, PageHeader, UserDetails } from "../components";
import ShippingOrderForm from "../components/orders/ShippingOrderForm";

const ViewShippingOrder = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

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
        if (!isPending && data?.data?.orderStatus !== "Shipped") {
            toastService.info("Access Denied: At This Moment You Cannot Access The Page");
            navigate("/admin/orders/shipping-order/");
        }
    }, [isPending, data, navigate]);

    if (isPending) return <Loader />;
    return (
        <>
            <PageHeader title={"Manage Order's"} controller={"Shipping Order Listing"} controllerUrl={"/admin/orders/shipping-order/"} page={"View Shipping Order"} />
            <section className="w-full">
                <div className="my-4 w-full container mx-auto border-t-4 border-blue-700 rounded-lg p-4 bg-gray-100 dark:bg-slate-800">
                    <h1 className="text-2xl font-bold underline underline-offset-4 mb-4">View Order</h1>
                    <div className="space-y-4">
                        <ShippingOrderForm orderId={orderId} />
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
