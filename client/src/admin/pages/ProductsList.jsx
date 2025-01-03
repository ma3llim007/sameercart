import crudService from "@/api/crudService";
import Loader from "@/client/components/Loader/Loader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { ButtonWithAlert, PageHeader, Table } from "../components";
import { formatDateTime } from "@/utils";
import { Button } from "@/components/ui/button";
import Badge from "@/components/Badge";
import { useNavigate } from "react-router-dom";
import toastService from "@/services/toastService";
import { LoadingOverlay } from "@/components";

const ProductsList = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ["productsList"],
        queryFn: () => crudService.get("product/products", true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });

    // Delete Product
    const { mutate: deleteProduct, isPending: deleteIsPending } = useMutation({
        mutationFn: productId =>
            crudService.delete(`/product/delete-product/${productId}`, true),
        onSuccess: data => {
            queryClient.invalidateQueries("categoryList");
            toastService.success(data?.message);
        },
        onError: error => {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "An error occurred";
            toastService.error(errorMessage);
        },
    });
    // product columns
    const productColums = [
        { accessorKey: "no", header: "No." },
        {
            accessorKey: "productName",
            header: "Product Name",
        },
        {
            accessorKey: "productSlug",
            header: "Product Slug",
        },
        {
            accessorKey: "productFeatureImage",
            header: "Product Feature Image",
            cell: ({ row }) => (
                <div className="w-full flex justify-center">
                    <img
                        src={row.original?.productFeatureImage}
                        className="min-w-28 max-w-28 min-h-20 max-h-20 object-center rounded-md"
                        alt="Category Image"
                    />
                </div>
            ),
        },
        {
            accessorKey: "productBrand.brandName",
            header: "Product Brand",
        },
        {
            accessorKey: "productCategory.categoryName",
            header: "Product Category",
        },
        {
            accessorKey: "productSubCategory.subCategoryName",
            header: "Product Sub-Category",
        },
        {
            accessorKey: "hasVariants",
            header: "Variants",
            cell: ({ row }) =>
                row.original?.hasVariants ? (
                    <Badge title="Has Variants" />
                ) : (
                    <Badge title="No Variants" className="Secondary" />
                ),
        },
        {
            accessorKey: "updatedAt",
            header: "Date Time",
            cell: ({ row }) => (
                <p className="text-wrap">
                    {formatDateTime(row.original?.updatedAt)}
                </p>
            ),
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-y-2 gap-x-0.5 items-center justify-center flex-wrap">
                    <Button
                        className="Primary"
                        onClick={() =>
                            navigate(
                                `/admin/products/edit-product/${row.original._id}`
                            )
                        }
                    >
                        Edit
                    </Button>
                    |
                    <ButtonWithAlert
                        buttonTitle="Delete"
                        dialogTitle="Are You Sure You Want to Delete This Product?"
                        dialogDesc="This action will permanently delete the Product. Proceed?"
                        dialogActionTitle="Delete Product"
                        dialogActionfn={() => deleteProduct(row.original?._id)}
                    />
                    |
                    <Button
                        className="Info"
                        onClick={() =>
                            navigate(
                                `/admin/products/view-product/${row.original._id}`
                            )
                        }
                    >
                        View
                    </Button>
                    {row.original.hasVariants && (
                        <>
                            |
                            <Button
                                onClick={() =>
                                    navigate(
                                        `/admin/products/variants/${row.original._id}`
                                    )
                                }
                                className="Purple"
                            >
                                Variant
                            </Button>
                        </>
                    )}
                </div>
            ),
        },
    ];
    const productData =
        data?.data?.map((data, index) => ({ no: index + 1, ...data })) || [];

    if (isLoading) return <Loader />;
    if (deleteIsPending) return <LoadingOverlay />;
    return (
        <>
            <PageHeader
                title={"Manage Product"}
                controller={"Product"}
                controllerUrl={"/admin/products/products-list"}
                page={"Product's List"}
            />
            <Table
                columns={productColums}
                data={productData}
                paginationOptions={{ pageSize: 10 }}
                sortable
                loading={isLoading}
            />
        </>
    );
};

export default ProductsList;
