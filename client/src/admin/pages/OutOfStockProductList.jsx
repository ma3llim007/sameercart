import crudService from "@/api/crudService";
import Loader from "@/client/components/Loader/Loader";
import toastService from "@/services/toastService";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Table from "../components/Table";
import { upperFirst } from "lodash";
import { Badge } from "@/components";
import { FaEye } from "react-icons/fa";
import { formatDateTime } from "@/utils";
import { Button } from "@/components/ui/button";

const OutOfStockProductList = () => {
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ["outOfStockProductsList"],
        queryFn: () => crudService.get("product/out-of-stock-products", true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
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
            accessorKey: "updatedAt",
            header: "Date Time",
            cell: ({ row }) => <p className="text-wrap">{formatDateTime(row.original?.updatedAt)}</p>,
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-y-2 gap-x-0.5 items-center justify-center flex-wrap">
                    <Button className="Info" onClick={() => navigate(`/admin/products/view-product/${row.original._id}`)}>
                        View
                    </Button>
                    {row.original.productType === "variable" ? (
                        <>
                            |
                            <Button onClick={() => navigate(`/admin/products/variants/${row.original._id}`)} className="Purple">
                                Variant
                            </Button>
                        </>
                    ) : (
                        <>
                            |
                            <Button className="Primary" onClick={() => navigate(`/admin/products/update-stock/${row.original._id}`)}>
                                Update Stock
                            </Button>
                        </>
                    )}
                </div>
            ),
        },
    ];
    const productData = data?.data?.map((data, index) => ({ no: index + 1, ...data })) || [];

    if (isLoading) return <Loader />;
    return (
        <>
            <PageHeader title={"Manage Product"} controller={"Product"} controllerUrl={"/admin/products/products-list"} page={"Out Of Stock Product's List"} />
            <Table columns={productColums} data={productData} paginationOptions={{ pageSize: 10 }} sortable loading={isLoading} />
        </>
    );
};

export default OutOfStockProductList;
