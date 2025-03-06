import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader/Loader";
import { formatDateTime, formatNumberWithCommas, paymentStatusClass, statusClass } from "@/utils";
import { FaRupeeSign } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Table from "@/admin/components/Table";
import Badge from "@/components/Badge";

const Order = ({ userId }) => {
    const navigate = useNavigate();

    // Fetching User Order
    const { data, isPending: orderIsPending } = useQuery({
        queryKey: ["userOrder", userId],
        queryFn: () => crudService.get(`order/get-orders/`, false),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
        enabled: !!userId,
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
            cell: ({ row }) => <p className="text-center text-base font-bold">{row.original?.orderItemCount}</p>,
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
            accessorKey: "orderDate",
            header: "Order Date",
            cell: ({ row }) => <p className="text-wrap">{formatDateTime(row.original?.orderDate)}</p>,
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-1 items-center flex-wrap">
                    <Button
                        className="Primary"
                        onClick={() => navigate(`/account/view-order/${row.original._id}`)}
                    >
                        View
                    </Button>
                </div>
            ),
        },
    ];
    const orderData = data?.data?.map((data, index) => ({ no: index + 1, ...data })) || [];

    if (orderIsPending) return <Loader />;
    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold px-2 mb-5">Order</h1>
            <Table columns={orderColumns} data={orderData} emptyMessage="Order's Is Empty" paginationOptions={{ pageSize: 10 }} sortable loading={orderIsPending} />
        </div>
    );
};

export default Order;
