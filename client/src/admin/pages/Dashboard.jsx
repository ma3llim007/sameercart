import { FaBlogger, FaBorderAll, FaCube, FaCubes, FaPlus, FaProductHunt, FaShippingFast, FaUser } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import { TbShoppingCartCancel } from "react-icons/tb";
import { CiDeliveryTruck } from "react-icons/ci";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import Loading from "../components/Loading";

const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#a855f7", "#6366f1", "#ec4899", "#22d3ee", "#84cc16", "#f43f5e", "#eab308", "#14b8a6", "#db2777", "#8b5cf6"];

const Dashboard = () => {
    // Fetch Dashboard Statistics
    const { data, isLoading } = useQuery({
        queryKey: ["dashboard"],
        queryFn: () => crudService.get(`dashboard/dashboard`, true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });

    // Fetch Order Statistics
    const { data: orderData, isLoading: orderIsLoading } = useQuery({
        queryKey: ["orderStats"],
        queryFn: () => crudService.get(`dashboard/orders-chart`, true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });

    // Fetch Products By Category
    const { data: productByCategory, isLoading: productByCategoryIsLoading } = useQuery({
        queryKey: ["productByCategory"],
        queryFn: () => crudService.get(`dashboard/products-by-category-chart`, true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });

    const dashboradData = data?.data || {};
    const cards = [
        { count: dashboradData?.totalUser, Icon: FaUser, label: "User" },
        { count: dashboradData?.totalCategory, Icon: FaCube, label: "Category" },
        { count: dashboradData?.totalSubCategory, Icon: FaCubes, label: "Sub-Category" },
        { count: dashboradData?.totalProducts, Icon: FaProductHunt, label: "Products" },
        { count: dashboradData?.totalNewOrders, Icon: FaPlus, label: "New Orders" },
        { count: dashboradData?.totalShipping, Icon: FaShippingFast, label: "Shipping Orders" },
        { count: dashboradData?.totalCancelledOrders, Icon: TbShoppingCartCancel, label: "Cancelled Orders" },
        { count: dashboradData?.totalDeliveryOrders, Icon: CiDeliveryTruck, label: "Delivery Orders" },
        { count: dashboradData?.totalAllOrders, Icon: FaBorderAll, label: "Total Orders" },
        { count: dashboradData?.totalBlogs, Icon: FaBlogger, label: "Blogs" },
    ];

    // Convert month numbers to short names (Jan, Feb, etc.)
    const userChartDataForm = dashboradData?.userChartData?.map(data => ({
        ...data,
        month: new Date(2023, data.month - 1).toLocaleString("en-US", { month: "short" }),
    }));

    if (isLoading || !data || orderIsLoading || productByCategoryIsLoading) {
        return <Loading />;
    }

    return (
        <>
            <PageHeader title={"Dashboard"} controller={"Dashboard"} controllerUrl={"/admin/dashboard/"} />
            <section className="container mx-auto px-4 mb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 select-none">
                    {cards.map((Card, index) => (
                        <div
                            key={index}
                            className="w-full border border-white/30 dark:border-black/30 p-3 rounded-md shadow-lg shadow-black/40 dark:shadow-gray-500/10 flex flex-col transition-transform transform hover:scale-105 space-y-1 bg-white/10 dark:bg-black/30 backdrop-blur-xl backdrop-saturate-150"
                        >
                            <div className="flex items-center gap-3 text-3xl font-semibold">
                                {Card.Icon && <Card.Icon size={25} />}
                                <h4 className="">{Card.count}</h4>
                            </div>
                            <p className="text-lg font-bold">{Card.label}</p>
                        </div>
                    ))}
                </div>
                <hr className="my-5" />
                <div className="flex flex-col gap-5">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>User Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={userChartDataForm}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <div className="flex gap-4">
                        <div className="w-full">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Status Distribution</CardTitle>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={orderData?.data}
                                                    dataKey="count"
                                                    nameKey="_id"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    label={({ _id, percent }) => `${_id}: ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {orderData?.data.map((entry, index) => (
                                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                    <div className="w-full">
                        <Card>
                            <CardHeader>
                                <CardTitle>Products by Category</CardTitle>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={productByCategory?.data}
                                                dataKey="count"
                                                nameKey="category"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                fill="#8884d8"
                                                label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {productByCategory?.data.map((entry, index) => (
                                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Dashboard;
