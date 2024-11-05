import React from "react";
import { Loading, Table } from "../components";
import { useQuery } from "@tanstack/react-query";
import { adminListSer } from "../services/adminService";
import toastService from "@/services/toastService";
import Badge from "@/components/Badge";
import { Button } from "@/components/ui/button";

const AdminsList = () => {
    const {
        data: adminData = [],
        isError,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["admins"],
        queryFn: adminListSer,
        staleTime: 10 * 60 * 1000,
        retry: 2,
        onError: err => {
            toastService.error("Error fetching admin data:", err.message);
        },
    });

    const adminColumns = [
        { accessorKey: "no", header: "No." },
        { accessorKey: "username", header: "Username" },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "fullName", header: "Full Name" },
        { accessorKey: "phoneNumber", header: "Phone Number" },
        {
            accessorKey: "isActive",
            header: "Active Status",
            cell: ({ row }) => (
                <Badge className={row.original.isActive ? "Success" : "Secondary"} title={row.original.isActive ? "Active" : "InActive"} />
            ),
        },
        {
            accessorKey: "asOwnerShip",
            header: "Owner Ship",
            cell: ({ row }) => (
                <Badge className={row.original.asOwnerShip ? "Success" : "Secondary"} title={row.original.asOwnerShip ? "Owner" : "Not Owner"} />
            ),
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex space-x-4">
                    <Button onClick={() => console.log(row.original._id)}>Edit</Button>
                    <Button>Delete</Button>
                </div>
            ),
        },
    ];

    const newAdminData = adminData.map((admin, index) => ({
        no: index + 1,
        ...admin,
    }));

    if (isLoading) return <Loading />;
    return <Table columns={adminColumns} data={newAdminData} paginationOptions={{ pageSize: 10 }} sortable loading={isLoading} />;
};

export default AdminsList;
