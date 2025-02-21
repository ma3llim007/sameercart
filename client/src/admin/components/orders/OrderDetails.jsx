import { Badge } from "@/components";
import { capitalizeWords, formatDateTime, formatNumberWithCommas, paymentStatusClass, statusClass } from "@/utils";
import { FaRupeeSign } from "react-icons/fa";

const OrderDetails = ({ order }) => {
    return (
        <div className="w-full border bg-gray-950/30 dark:bg-gray-950/50 shadow-md rounded-sm select-none">
            <table className="table-auto w-full text-lg border-collapse select-none">
                <tbody className="divide-y">
                    <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                        <th scope="col" colSpan={2} className="text-left p-3 text-2xl font-bold underline">
                            Order Details
                        </th>
                    </tr>
                    <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                        <th scope="col" className="text-left p-3 font-semibold">
                            Order ID
                        </th>
                        <td className="p-3 text-left">{"#" + order?.orderId}</td>
                    </tr>
                    <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                        <th scope="col" className="text-left p-3 font-semibold">
                            Order Date
                        </th>
                        <td className="p-3 text-left">{formatDateTime(order?.orderDate) || "-"}</td>
                    </tr>
                    <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                        <th scope="col" className="text-left p-3 font-semibold">
                            Order Status
                        </th>
                        <td className="p-3 text-left">
                            <Badge title={order?.orderStatus || "-"} className={`${statusClass[order?.orderStatus] || ""} rounded-md`} />
                        </td>
                    </tr>
                    <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                        <th scope="col" className="text-left p-3 font-semibold">
                            Payment Status
                        </th>
                        <td className="p-3 text-left">
                            <Badge title={order?.paymentStatus || "-"} className={`${paymentStatusClass[order?.paymentStatus] || ""} rounded-md`} />
                        </td>
                    </tr>
                    <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                        <th scope="col" className="text-left p-3 font-semibold">
                            Payment Type
                        </th>
                        <td className="p-3 text-left">
                            <Badge
                                title={order?.paymentType ? (order.paymentType === "COD" ? "Cash On Delivery" : "Paid") : "-"}
                                className={`${order?.paymentType && (order?.paymentType === "COD" ? "Primary" : "Purple")} rounded-md leading-5`}
                            />
                        </td>
                    </tr>
                    <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                        <th scope="col" className="text-left p-3 font-semibold">
                            Total Amount
                        </th>
                        <td className="p-3 text-left flex items-center">
                            <FaRupeeSign size={14} /> {formatNumberWithCommas(order?.totalAmount)}
                        </td>
                    </tr>
                    <tr className="hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-800 transition">
                        <th scope="col" className="text-left p-3 font-semibold">
                            Additional Information
                        </th>
                        <td className="p-3 text-left">{capitalizeWords(order?.additionalInformation) || "-"}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default OrderDetails;
