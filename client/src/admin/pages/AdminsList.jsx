import React from "react";
import { ButtonWithAlert, Loading, Table } from "../components";
import { useQuery } from "@tanstack/react-query";
import toastService from "@/services/toastService";
import Badge from "@/components/Badge";
import { Button } from "@/components/ui/button";
import crudService from "@/api/crudService";

const AdminsList = () => {
    const { data: adminData, isLoading } = useQuery({
        queryKey: ["adminsList"],
        queryFn: () => crudService.get("auth/admin-list",true),
        onError: err => {
            toastService.error("Error fetching admin data:", err.message);
        },
    });

    const handleDeleteAdmin = id => {
        console.log(id);
    };

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
                    <ButtonWithAlert
                        buttonTitle="Delete"
                        dialogTitle="Delete Admin ?"
                        dialogDesc="Are You Sure Want To Delete Admin."
                        dialogActionBtnColor="Primary"
                        dialogActionfn={() => handleDeleteAdmin(row.original?._id)}
                    />
                </div>
            ),
        },
    ];

    const newAdminData = adminData?.data?.map((admin, index) => ({
        no: index + 1,
        ...admin,
    }));

    if (isLoading) return <Loading />;
    return <Table columns={adminColumns} data={newAdminData} paginationOptions={{ pageSize: 10 }} sortable loading={isLoading} />;
};

export default AdminsList;
