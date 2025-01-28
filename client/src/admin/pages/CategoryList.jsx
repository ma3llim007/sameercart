import { ButtonWithAlert, PageHeader, Table } from "../components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import crudService from "@/api/crudService";
import Badge from "@/components/Badge";
import { Button } from "@/components/ui/button";
import toastService from "@/services/toastService";
import { formatDateTime } from "@/utils";
import { LoadingOverlay } from "@/components";
import { upperFirst } from "lodash";

const CategoryList = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // fetching category
    const { data, isLoading } = useQuery({
        queryKey: ["categoryList"],
        queryFn: () => crudService.get("category/categories", true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });

    // delete Category
    const { mutate: deleteCategory, isPending } = useMutation({
        mutationFn: id => crudService.delete(`category/delete-category/${id}`, true),
        onSuccess: data => {
            queryClient.invalidateQueries("categoryList");
            toastService.success(data?.message);
        },
        onError: error => {
            const errorMessage = error?.response?.data?.message || error?.message || "An error occurred";
            toastService.error(errorMessage);
        },
    });

    // toggle category status
    const toggleCategoryStatus = useMutation({
        mutationFn: ({ id, isActive }) =>
            crudService.patch(`category/toggle-category/${id}`, true, {
                isActive,
            }),
        onSuccess: data => {
            queryClient.invalidateQueries("categoryList");
            toastService.success(data?.message);
        },
        onError: error => {
            toastService.error(error.response?.data.message);
        },
    });

    // category columns
    const categoryColums = [
        { accessorKey: "no", header: "No." },
        {
            accessorKey: "categoryName",
            header: "Category Name",
            cell: ({ getValue }) => upperFirst(getValue()),
        },
        { accessorKey: "categorySlug", header: "Category Slug" },
        {
            accessorKey: "categoryImage",
            header: "Category Image",
            cell: ({ row }) => (
                <div className="w-full flex justify-center">
                    <img src={row.original?.categoryImage} className="min-w-28 max-w-28 min-h-20 max-h-20 object-center rounded-md" alt="Category Image" />
                </div>
            ),
        },
        {
            accessorKey: "isActive",
            header: "Active Status",
            cell: ({ row }) => <Badge className={`${row.original?.isActive ? "Success" : "Secondary"} hover:pointer-events-none`} title={row.original?.isActive ? "Active" : "InActive"} />,
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
                    <Button className="Primary" onClick={() => navigate(`/admin/category/edit-category/${row.original._id}`)}>
                        Edit
                    </Button>
                    |
                    <ButtonWithAlert
                        buttonTitle="Delete"
                        dialogTitle="Are You Sure You Want to Delete This Category?"
                        dialogDesc="This action will permanently delete the category. Proceed?"
                        dialogActionTitle="Delete Category"
                        dialogActionfn={() => deleteCategory(row.original?._id)}
                    />
                    |
                    {row.original.isActive ? (
                        <ButtonWithAlert
                            buttonTitle="In-Active"
                            buttonColor="Purple"
                            dialogTitle="Confirm Category Visibility Change"
                            dialogDesc="Are You Sure You Want To Change The Category Status To Inactive?"
                            dialogActionTitle="In-Active Category"
                            dialogActionBtnColor="Danger"
                            dialogActionfn={() =>
                                toggleCategoryStatus.mutate({
                                    id: row.original._id,
                                    isActive: !row.original.isActive,
                                })
                            }
                        />
                    ) : (
                        <ButtonWithAlert
                            buttonTitle="Active"
                            buttonColor="Teal"
                            dialogTitle="Confirm Category Visibility Change"
                            dialogDesc="Are You Sure You Want To Change The Category Status To Active?"
                            dialogActionTitle="Active Category"
                            dialogActionfn={() =>
                                toggleCategoryStatus.mutate({
                                    id: row.original._id,
                                    isActive: !row.original.isActive,
                                })
                            }
                        />
                    )}
                </div>
            ),
        },
    ];
    const categoryData = data?.data?.map((data, index) => ({ no: index + 1, ...data })) || [];

    if (isLoading || isPending) return <LoadingOverlay />;
    return (
        <>
            <PageHeader title={"Manage Category"} controller={"Category"} controllerUrl={"/admin/category/category-list/"} page={"Category's List"} />
            <Table columns={categoryColums} data={categoryData} paginationOptions={{ pageSize: 10 }} sortable loading={isLoading} />
        </>
    );
};

export default CategoryList;
