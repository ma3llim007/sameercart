import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { FaBackward, FaHome, FaJediOrder } from "react-icons/fa";
import { IoPersonCircleOutline } from "react-icons/io5";
import OrderDetails from "@/admin/components/orders/OrderDetails";
import OrderItem from "@/admin/components/orders/OrderItem";
import { Button } from "@/components/ui/button";

const OrderView = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    // fetching data of order
    const { data, isPending } = useQuery({
        queryKey: ["viewOrder", orderId],
        queryFn: () => crudService.get(`order/view-order/${orderId}`, false),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
        enabled: !!orderId,
        cacheTime: 2 * 60 * 1000, // 2 minutes
    });
    const { orderItems } = data?.data || {};

    if (isPending) return <Loader />;
    return (
        <>
            <div className="w-full my-4 bg-gray-700 bg-opacity-70 py-4 px-5 rounded-md-md shadow-md select-none space-y-5">
                <Breadcrumb className="text-white">
                    <BreadcrumbList className="text-lg">
                        <BreadcrumbItem className="flex items-center">
                            <Link className="flex items-center gap-2" to="/">
                                <FaHome /> Home
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Link className="flex items-center gap-2" to="/account/dashboard">
                                <IoPersonCircleOutline /> Account
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Link className="flex items-center gap-2" to="/account/dashboard">
                                <FaJediOrder /> Order
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{"View Order"}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <hr />
                <div className="space-y-4">
                    <OrderDetails
                        order={{
                            orderId: data?.data?._id,
                            orderDate: data.data?.orderDate,
                            paymentStatus: data.data?.paymentStatus,
                            orderStatus: data.data?.orderStatus,
                            paymentType: data.data?.paymentType,
                            totalAmount: data.data?.totalAmount,
                            additionalInformation: data.data?.additionalInformation,
                            completeOrderdate: data.data?.completeOrderdate,
                        }}
                    />
                    <OrderItem orderItem={orderItems} />
                    <Button className="Secondary" onClick={() => navigate("/account/dashboard/")}>
                        <FaBackward /> Back To Accont Dashboad
                    </Button>
                </div>
            </div>
        </>
    );
};

export default OrderView;
