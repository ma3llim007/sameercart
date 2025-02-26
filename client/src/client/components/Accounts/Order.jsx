import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader/Loader";
import { formatDateTime, formatNumberWithCommas } from "@/utils";
import { FaRupeeSign } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Table from "@/admin/components/Table";

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
    const orderColums = [
        { accessorKey: "no", header: "No" },
        {
            accessorKey: "_id",
            header: "Order Id",
            cell: ({ getValue }) => "#" + getValue(),
        },
        {
            accessorKey: "orderDate",
            header: "Order Date",
            cell: ({ row }) => <p className="text-wrap">{formatDateTime(row.original?.orderDate)}</p>,
        },
        {
            accessorKey: "orderStatus",
            header: "Order Status",
        },
        {
            header: "Total",
            cell: ({ row }) => (
                <p className="flex items-center text-base">
                    <FaRupeeSign size={13} /> {formatNumberWithCommas(row.original?.totalAmount)} Of {row.original?.orderItemCount} items
                </p>
            ),
        },
        {
            header: "View",
            cell: ({ row }) => (
                <Button onClick={() => navigate(`/account/view-order/${row.original?._id}`)} className="Secondary">
                    View
                </Button>
            ),
        },
    ];
    const orderData = data?.data?.map((data, index) => ({ no: index + 1, ...data })) || [];

    if (orderIsPending) return <Loader />;
    return (
        <div className="w-full overflow-auto">
            <h1 className="text-2xl font-bold px-2 mb-5">Order</h1>
            <Table columns={orderColums} data={orderData} emptyMessage="Order's Is Empty" paginationOptions={{ pageSize: 10 }} sortable loading={orderIsPending} />
        </div>
    );
};

export default Order;
