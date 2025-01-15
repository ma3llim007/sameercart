import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ButtonWithAlert, Loading, PageHeader, Table } from "../components";
import { formatDateTime } from "@/utils";
import Badge from "@/components/Badge";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components";
import { upperFirst } from "lodash";

const SubCategoryList = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // fetching sub category
    const { data, isLoading } = useQuery({
        queryKey: ["subCategoryList"],
        queryFn: () => crudService.get("sub-category/subcategory", true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });

    // delete sub-category
    const { mutate: deleteSubCategory, isPending: isPendingDeleteSubCategory } =
        useMutation({
            mutationFn: id =>
                crudService.delete(
                    `sub-category/delete-subcategory/${id}`,
                    true
                ),
            onSuccess: data => {
                queryClient.invalidateQueries("subCategoryList");
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

    // toggle sub-category
    const toggleSubCategory = useMutation({
        mutationFn: ({ id, isActive }) =>
            crudService.patch(`sub-category/toggle-subcategory/${id}`, true, {
                isActive,
            }),
        onSuccess: data => {
            queryClient.invalidateQueries("subCategoryList");
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

    // subcategory columns
    const subCategoryColumns = [
        { accessorKey: "no", header: "No." },
        {
            accessorKey: "categoryName",
            header: "Category Name",
            cell: ({ row }) => (
                <p className="font-bold">
                    {upperFirst(row.original.categoryName)}
                </p>
            ),
        },
        { accessorKey: "subCategoryName", header: "Sub Category Name" },
        { accessorKey: "subCategorySlug", header: "Sub Category Slug" },
        {
            accessorKey: "subCategoryImage",
            header: "Sub Category Image",
            cell: ({ row }) => (
                <div className="w-flex flex justify-center">
                    <img
                        src={row.original?.subCategoryImage}
                        className="min-w-28 max-w-28 min-h-20 max-h-20 object-center rounded-md"
                        alt="Sub Category Image"
                    />
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
            cell: ({ row }) => (
                <p className="text-wrap">
                    {formatDateTime(row.original?.updatedAt)}
                </p>
            ),
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-1 items-center flex-wrap">
                    <Button
                        className="Primary"
                        onClick={() =>
                            navigate(
                                `/admin/sub-category/edit-category/${row.original._id}`
                            )
                        }
                    >
                        Edit
                    </Button>
                    |
                    <ButtonWithAlert
                        buttonTitle="Delete"
                        dialogTitle="Are You Sure You Want to Delete This Sub-Category?"
                        dialogDesc="This Action Will Permanently Delete The Sub-Category. Proceed?"
                        dialogActionTitle="Delete Sub-Category"
                        dialogActionfn={() =>
                            deleteSubCategory(row.original?._id)
                        }
                    />
                    |
                    {row.original.isActive ? (
                        <ButtonWithAlert
                            buttonTitle="In-Active"
                            buttonColor="Purple"
                            dialogTitle="Confirm Sub-Category Visibility Change"
                            dialogDesc="Are You Sure You Want To Change The Sub-Category Status To Inactive?"
                            dialogActionTitle="In-Active Category"
                            dialogActionBtnColor="Danger"
                            dialogActionfn={() =>
                                toggleSubCategory.mutate({
                                    id: row.original._id,
                                    isActive: !row.original.isActive,
                                })
                            }
                        />
                    ) : (
                        <ButtonWithAlert
                            buttonTitle="Active"
                            buttonColor="Teal"
                            dialogTitle="Confirm Sub-Category Visibility Change"
                            dialogDesc="Are You Sure You Want To Change The Sub-Category Status To Active?"
                            dialogActionTitle="Active Category"
                            dialogActionfn={() =>
                                toggleSubCategory.mutate({
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

    const subCategoryData =
        data?.data?.map((data, index) => ({ no: index + 1, ...data })) || [];

    if (isLoading) return <Loading />;
    if (isPendingDeleteSubCategory) return <LoadingOverlay />;
    return (
        <>
            <PageHeader
                title="Manage Sub-Category"
                controller="Sub-Category"
                controllerUrl="/admin/sub-category/"
                page="Sub Category's List"
            />
            <Table
                columns={subCategoryColumns}
                data={subCategoryData}
                paginationOptions={{ pageSize: 10 }}
                sortable
                loading={isLoading}
            />
        </>
    );
};

export default SubCategoryList;
