import crudService from "@/api/crudService";
import { Button } from "@/components/ui/button";
import toastService from "@/services/toastService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ButtonWithAlert, Loading, PageHeader, Table } from "../components";
import { formatDateTime } from "@/utils";
import Badge from "@/components/Badge";

const BrandList = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // fetching brands
    const { data, isLoading } = useQuery({
        queryKey: ["brandList"],
        queryFn: () => crudService.get("/brand/brands", true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });

    // delete brand
    const deleteBrand = useMutation({
        mutationFn: id => crudService.delete(`/brand/delete-brand/${id}`, true),
        onSuccess: data => {
            queryClient.invalidateQueries("brandList");
            toastService.success(data?.message);
        },
        onError: error => {
            const errorMessage = error?.response?.data?.message || error?.message || "An error occurred";
            toastService.error(errorMessage);
        },
    });

    // toggle brand status
    const toggleBrand = useMutation({
        mutationFn: ({ id, isActive }) => crudService.patch(`/brand/toggle-brand/${id}`, true, { isActive }),
        onSuccess: data => {
            queryClient.invalidateQueries("brandList");
            toastService.success(data?.message);
        },
        onError: error => {
            const errorMessage = error?.response?.data?.message || error?.message || "An error occurred";
            toastService.error(errorMessage);
        },
    });

    // brand columns
    const brandColums = [
        { accessorKey: "no", header: "No." },
        { accessorKey: "brandName", header: "Brand Name" },
        {
            accessorKey: "brandLogo",
            header: "Brand Logo",
            cell: ({ row }) => (
                <div className="w-full flex justify-center">
                    <img src={row.original?.brandLogo} className="min-w-28 max-w-28 min-h-20 max-h-20 object-center rounded-md" alt="Brand Logo" />
                </div>
            ),
        },
        {
            accessorKey: "isActive",
            header: "Active Status",
            cell: ({ row }) => (
                <Badge
                    className={`${row.original?.isActive ? "Success" : "Secondary"} hover:pointer-events-none`}
                    title={row.original?.isActive ? "Active" : "InActive"}
                />
            ),
        },
        {
            accessorKey: "updatedAt",
            header: "Date Time",
            cell: ({ row }) => <p className="text-wrap">{formatDateTime(row.original?.updatedAt)}</p>,
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-1 items-center flex-wrap">
                    <Button className="Primary" onClick={() => navigate(`/admin/brands/edit-brand/${row.original._id}`)}>
                        Edit
                    </Button>
                    |
                    <Button className="Success" onClick={() => navigate(`/admin/brands/view-brand/${row.original._id}`)}>
                        View
                    </Button>
                    |
                    <ButtonWithAlert
                        buttonTitle="Delete"
                        dialogTitle="Are You Sure You Want to Delete This Brand?"
                        dialogDesc="This action will permanently delete the Brand. Proceed?"
                        dialogActionTitle="Delete Brand"
                        dialogActionfn={() => deleteBrand.mutate(row.original?._id)}
                    />
                    |
                    {row.original.isActive ? (
                        <ButtonWithAlert
                            buttonTitle="In-Active"
                            buttonColor="Purple"
                            dialogTitle="Confirm Brand Visibility Change"
                            dialogDesc="Are You Sure You Want To Change The Brand Status To Inactive?"
                            dialogActionTitle="In-Active Brand"
                            dialogActionBtnColor="Danger"
                            dialogActionfn={() => toggleBrand.mutate({ id: row.original._id, isActive: !row.original.isActive })}
                        />
                    ) : (
                        <ButtonWithAlert
                            buttonTitle="Active"
                            buttonColor="Teal"
                            dialogTitle="Confirm Brand Visibility Change"
                            dialogDesc="Are You Sure You Want To Change The Brand Status To Active?"
                            dialogActionTitle="Active Brand"
                            dialogActionfn={() => toggleBrand.mutate({ id: row.original._id, isActive: !row.original.isActive })}
                        />
                    )}
                </div>
            ),
        },
    ];

    const brandData = data?.data?.map((data, index) => ({ no: index + 1, ...data })) || [];

    if (isLoading) return <Loading />;
    return (
        <>
            <PageHeader title={"Manage Brands"} controller={"Brands"} controllerUrl={"/admin/brands/brands-list/"} page={"Brands's List"} />
            <Table columns={brandColums} data={brandData} paginationOptions={{ pageSize: 10 }} sortable loading={isLoading} />
        </>
    );
};

export default BrandList;
