import React from "react";
import { Loading, Table } from "../components";
import { useQuery } from "@tanstack/react-query";
import { adminListSer } from "../services/adminService";

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
            console.error("Error fetching admin data:", err.message);
        },
    });

    const adminColumns = [
        { accessorKey: "no", header: "No." },
        { accessorKey: "username", header: "Username" },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "fullName", header: "Full Name" },
        { accessorKey: "phoneNumber", header: "Phone Number" },
        { accessorKey: "activeStatus", header: "Active Status" },
        { accessorKey: "ownerShip", header: "Owner Ship" },
    ];

    const newAdminData = adminData.map((admin, index) => ({
        no: index + 1,
        ...admin,
    }));
    if (isLoading) return <Loading />;
    if (isError) return <div className="container mx-auto my-5 bg-red-500 rounded-md w-full p-5"><h5 className="text-lg font-bold text-white">Error loading admin data: {error.message}</h5></div>;
    return <Table columns={adminColumns} data={newAdminData} paginationOptions={{ pageSize: 10 }} sortable loading={isLoading} />;
};

export default AdminsList;
