import { capitalizeWords, formatDateTime } from "@/utils";
import { Table } from "../index";
import { upperFirst } from "lodash";
import { Badge } from "@/components";
import { FaRupeeSign } from "react-icons/fa";

const OrderItem = ({ orderItem }) => {
    // Order Item Columns
    const orderItemColums = [
        { accessorKey: "no", header: "No." },
        {
            accessorKey: "productName",
            header: "Product Name",
            cell: ({ row }) => (
                <div className="w-full flex flex-col gap-3">
                    <p>{upperFirst(row.original?.productName)}</p>
                    {row.original?.variant?.attributes &&
                        row.original?.variant?.attributes.map(attr => (
                            <Badge key={attr._id} title={`${capitalizeWords(attr.name)}: ${capitalizeWords(attr.value)}`} className="max-w-fit Primary rounded-md px-2" />
                        ))}
                </div>
            ),
        },
        {
            accessorKey: "price",
            header: "Price Name",
            cell: ({ row }) => (
                <div className="flex items-center gap-1 text-base justify-center">
                    <FaRupeeSign size={12} />
                    <span>{row.original?.price}</span>
                </div>
            ),
        },
        {
            accessorKey: "quantity",
            header: "Quantity",
            cell: ({ row }) => <div className="flex items-center gap-1 text-base justify-center">{row.original?.quantity}</div>,
        },
        {
            accessorKey: "totalPrice",
            header: "Total Price",
            cell: ({ row }) => (
                <div className="flex items-center gap-1 text-base justify-center">
                    <FaRupeeSign size={12} />
                    <span>{row.original?.totalPrice}</span>
                </div>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "created At",
            cell: ({ row }) => <p className="text-wrap">{formatDateTime(row.original?.createdAt) || "-"}</p>,
        },
    ];
    const orderItemData = orderItem.map((item, index) => ({ no: index + 1, ...item })) || [];
    return (
        <div className="w-full border bg-gray-700/20 dark:bg-gray-950/50 shadow-md rounded-sm select-none">
            <h3 className="text-2xl font-bold mt-5 px-4">Order Item Details</h3>
            <Table data={orderItemData} columns={orderItemColums} emptyMessage="No Order Item Found" sortable paginationOptions={{ pageSize: 10 }} />
        </div>
    );
};

export default OrderItem;
