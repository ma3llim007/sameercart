import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/client/components/Loader/Loader";
import Badge from "@/components/Badge";
import { capitalizeWords } from "@/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Table from "../components/Table";
import { Helmet } from "react-helmet-async";

const UserListing = () => {
    const navigate = useNavigate();
    const { data, isPending } = useQuery({
        queryKey: ["userListing"],
        queryFn: () => crudService.get("users/get-users", true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });

    const userColumns = [
        { accessorKey: "no", header: "No." },
        { accessorKey: "username", header: "Username" },
        { accessorKey: "firstName", header: "First Name" },
        { accessorKey: "lastName", header: "Last Name" },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "phoneNumber", header: "Phone Number" },
        {
            accessorKey: "email_verify",
            header: "Email Verify",
            cell: ({ row }) => (
                <Badge
                    title={row.original?.email_verify ? "Email Verify" : "Email Not Verify"}
                    className={`${row.original?.email_verify ? "Success" : "Secondary"} rounded-md text-xs leading-normal`}
                />
            ),
        },
        {
            accessorKey: "authMethod",
            header: "Auth Method",
            cell: ({ row }) => (
                <Badge
                    title={capitalizeWords(row.original?.authMethod)}
                    className={`${row.original?.authMethod === "email" ? "Teal" : row.original?.authMethod === "google" ? "Danger" : "Purple"} rounded-md text-xs`}
                />
            ),
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-1 items-center flex-wrap">
                    <Button className="Primary" onClick={() => navigate(`/admin/users/view-user/${row.original._id}`)}>
                        View
                    </Button>
                </div>
            ),
        },
    ];
    const userData = Array.isArray(data?.data) ? data.data.map((order, index) => ({ no: index + 1, ...order })) : [];
    if (isPending) return <Loader />;
    return (
        <>
            <Helmet>
                <title>Manage Users | sameerCart</title>
                <meta name="description" content="View and manage registered users in sameerCart admin panel. Update user details and permissions." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <PageHeader title={"Manage Order's"} controller={"All Orders"} controllerUrl={"/admin/orders/all-order/"} />
            <Table columns={userColumns} data={userData} emptyMessage="User Is Not Found" loading={isPending} paginationOptions={{ pageSize: 10 }} sortable />
        </>
    );
};

export default UserListing;
