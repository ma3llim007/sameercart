import crudService from "@/api/crudService";
import Loader from "@/client/components/Loader/Loader";
import Badge from "@/components/Badge";
import { Button } from "@/components/ui/button";
import toastService from "@/services/toastService";
import { capitalizeWords, formatDateTime, formatNumberWithCommas, paymentStatusClass, statusClass } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { FaRupeeSign } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Table from "../components/Table";
import { Helmet } from "react-helmet-async";

const CanceledOrder = () => {
    const navigate = useNavigate();

    const { data, isPending } = useQuery({
        queryKey: ["canceledOrder"],
        queryFn: () => crudService.get("order/get-order?orderStatus=Canceled", true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });

    // Order Columns
    const orderColumns = [
        { accessorKey: "no", header: "No." },
        {
            accessorKey: "_id",
            header: "Order No",
        },
        {
            header: "Total Item",
            cell: ({ row }) => <p className="text-center text-base font-bold">{row.original?.orderItems?.length}</p>,
        },
        {
            accessorKey: "totalAmount",
            header: "Total Amount",
            cell: ({ row }) => (
                <p className="flex flex-row items-center justify-center space-x-3 text-base font-bold">
                    <FaRupeeSign size={12} /> {formatNumberWithCommas(row.original?.totalAmount)}
                </p>
            ),
        },
        {
            accessorKey: "orderStatus",
            header: "Order Status",
            cell: ({ row }) => (
                <Badge
                    title={row.original?.orderStatus === "CanceledByUser" ? "Canceled By User" : row.original?.orderStatus === "CanceledByAdmin" ? "Canceled By Admin" : row.original?.orderStatus}
                    className={`${statusClass[row?.original?.orderStatus] || ""} rounded-md !leading-normal`}
                />
            ),
        },
        {
            accessorKey: "paymentType",
            header: "Payment Type",
            cell: ({ row }) => (
                <Badge title={row.original?.paymentType === "COD" ? "Cash On Delivery" : "Paid"} className={`${row.original?.paymentType === "COD" ? "Primary" : "Purple"} rounded-md leading-5`} />
            ),
        },
        {
            accessorKey: "paymentStatus",
            header: "Payment Status",
            cell: ({ row }) => <Badge title={row.original?.paymentStatus} className={`${paymentStatusClass[row?.original?.paymentStatus] || ""} rounded-md`} />,
        },
        {
            header: "Added By",
            cell: ({ row }) => (
                <Link to={`/admin/users/view-user/${row.original?.user?._id}`} className="text-blue-700 dark:text-blue-400 hover:underline">
                    {capitalizeWords(row.original?.user?.fullName)}
                </Link>
            ),
        },
        {
            accessorKey: "shippingAddress",
            header: "Address",
            cell: ({ row }) => (
                <div className="max-w-44 min-w-44 flex flex-col gap-2 items-start">
                    <p>
                        <strong>Street: </strong>
                        {capitalizeWords(row.original?.shippingAddress?.street)}
                    </p>
                    <p>
                        <strong>City: </strong>
                        {capitalizeWords(row.original?.shippingAddress?.city)}
                    </p>
                    <p>
                        <strong>State: </strong>
                        {capitalizeWords(row.original?.shippingAddress?.state)}
                    </p>
                    <p>
                        <strong>Country: </strong>
                        {capitalizeWords(row.original?.shippingAddress?.country)}
                    </p>
                    <p>
                        <strong>Zip Code: </strong>
                        {capitalizeWords(row.original?.shippingAddress?.zip_code)}
                    </p>
                </div>
            ),
        },
        {
            accessorKey: "orderDate",
            header: "Order Date",
            cell: ({ row }) => <p className="text-wrap">{formatDateTime(row.original?.orderDate)}</p>,
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-1 items-center flex-wrap">
                    <Button className="Primary" onClick={() => navigate(`/admin/orders/view-canceled-order/${row.original._id}`)}>
                        View
                    </Button>
                </div>
            ),
        },
    ];

    const orderData = Array.isArray(data?.data) ? data.data.map((order, index) => ({ no: index + 1, ...order })) : [];
    if (isPending) return <Loader />;
    return (
        <>
            <Helmet>
                <title>Canceled Orders | sameerCart</title>
                <meta name="description" content="View and manage all canceled orders in sameerCart admin panel. Check refund and customer queries." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <PageHeader title={"Manage Order's"} controller={"Canceled Order"} controllerUrl={"/admin/orders/canceled-order/"} />
            <Table columns={orderColumns} data={orderData} emptyMessage="Canceled Order Is Not Found" loading={isPending} paginationOptions={{ pageSize: 10 }} sortable />
        </>
    );
};

export default CanceledOrder;
