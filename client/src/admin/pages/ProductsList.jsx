import crudService from "@/api/crudService";
import Loader from "@/client/components/Loader/Loader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDateTime } from "@/utils";
import { Button } from "@/components/ui/button";
import Badge from "@/components/Badge";
import { Link, useNavigate } from "react-router-dom";
import toastService from "@/services/toastService";
import { LoadingOverlay } from "@/components";
import { upperFirst } from "lodash";
import { FaEye } from "react-icons/fa";
import Table from "../components/Table";
import PageHeader from "../components/PageHeader";
import ButtonWithAlert from "../components/ButtonWithAlert";

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
        mutationFn: productId => crudService.delete(`/product/delete-product/${productId}`, true),
        onSuccess: data => {
            queryClient.invalidateQueries("categoryList");
            toastService.success(data?.message);
        },
        onError: error => {
            const errorMessage = error?.response?.data?.message || error?.message || "An error occurred";
            toastService.error(errorMessage);
        },
    });
    // product columns
    const productColums = [
        { accessorKey: "no", header: "No." },
        {
            accessorKey: "productName",
            header: "Product Name",
            cell: ({ row }) => (
                <div className="w-full flex flex-col gap-3">
                    <p>{upperFirst(row.original?.productName)}</p>
                    <div className="flex items-center gap-2">
                        <Badge title={upperFirst(row.original?.productType)}></Badge>
                        <Link to={`/product-details/${row.original?.productSlug}`} target="_blank">
                            <Badge className="Secondary flex items-center gap-1 text-base" title={<FaEye />} />
                        </Link>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "productFeatureImage",
            header: "Product Feature Image",
            cell: ({ row }) => (
                <div className="w-full flex justify-center">
                    <img src={row.original?.productFeatureImage} className="min-w-28 max-w-28 min-h-28 max-h-28 object-cover rounded-md" alt="Product Image" />
                </div>
            ),
        },
        {
            accessorKey: "productCategory.categoryName",
            header: "Product Category",
            cell: ({ getValue }) => upperFirst(getValue()),
        },
        {
            accessorKey: "productSubCategory.subCategoryName",
            header: "Product Sub-Category",
            cell: ({ getValue }) => upperFirst(getValue()),
        },
        {
            accessorKey: "updatedAt",
            header: "Date Time",
            cell: ({ row }) => <p className="text-wrap">{formatDateTime(row.original?.updatedAt)}</p>,
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-y-2 gap-x-0.5 items-center justify-center flex-wrap">
                    <Button className="Primary" onClick={() => navigate(`/admin/products/edit-product/${row.original._id}`)}>
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
                    <Button className="Info" onClick={() => navigate(`/admin/products/view-product/${row.original._id}`)}>
                        View
                    </Button>
                    {row.original.productType === "variable" && (
                        <>
                            |
                            <Button onClick={() => navigate(`/admin/products/variants/${row.original._id}`)} className="Purple">
                                Variant
                            </Button>
                        </>
                    )}
                </div>
            ),
        },
    ];
    const productData = data?.data?.map((data, index) => ({ no: index + 1, ...data })) || [];

    if (isLoading) return <Loader />;
    if (deleteIsPending) return <LoadingOverlay />;
    return (
        <>
            <PageHeader title={"Manage Product"} controller={"Product"} controllerUrl={"/admin/products/products-list"} page={"Product's List"} />
            <Table columns={productColums} data={productData} paginationOptions={{ pageSize: 10 }} sortable loading={isLoading} />
        </>
    );
};

export default ProductsList;
