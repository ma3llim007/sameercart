import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import { formatDateTime } from "@/utils";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components";
import Loader from "@/client/components/Loader/Loader";
import ButtonWithAlert from "../components/ButtonWithAlert";
import PageHeader from "../components/PageHeader";
import Table from "../components/Table";

const BlogList = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        data,
        isPending: blogIsPending,
        isLoading,
    } = useQuery({
        queryKey: ["blogList"],
        queryFn: () => crudService.get("blog/blogs", true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });

    // delete Category
    const { mutate: deleteBlog, isPending: deleteIsPending } = useMutation({
        mutationFn: id => crudService.delete(`blog/delete-blog/${id}`, true),
        onSuccess: data => {
            queryClient.invalidateQueries("blogList");
            toastService.success(data?.message);
        },
        onError: error => {
            const errorMessage = error?.response?.data?.message || error?.message || "An error occurred";
            toastService.error(errorMessage);
        },
    });

    const blogColums = [
        { accessorKey: "no", header: "No." },
        { accessorKey: "blogTitle", header: "Title" },
        { accessorKey: "blogSlug", header: "Slug" },
        {
            accessorKey: "blogFeatureImage",
            header: "Feature Image",
            cell: ({ row }) => (
                <div className="w-full flex justify-center">
                    <img src={row.original?.blogFeatureImage} className="min-w-28 max-w-28 min-h-20 max-h-20 object-center rounded-md" alt="Blog Feature Image" />
                </div>
            ),
        },
        { accessorKey: "blogShortDescription", header: "Short Description" },
        {
            accessorKey: "updatedAt",
            header: "Date Time",
            cell: ({ row }) => <p className="text-wrap">{formatDateTime(row.original?.updatedAt)}</p>,
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-1 items-center flex-wrap">
                    <Button className="Primary" onClick={() => navigate(`/admin/blogs/edit-blog/${row.original._id}`)}>
                        Edit
                    </Button>
                    |
                    <ButtonWithAlert
                        buttonTitle="Delete"
                        dialogTitle="Are You Sure You Want to Delete This Blog?"
                        dialogDesc="This Action Will Permanently Delete The Blog. Proceed?"
                        dialogActionTitle="Delete Blog"
                        dialogActionfn={() => deleteBlog(row.original?._id)}
                    />
                </div>
            ),
        },
    ];

    const blogData = Array.isArray(data?.data) ? data?.data?.map((item, index) => ({ no: index + 1, ...item })) : [];

    if (blogIsPending) return <Loader />;
    if (deleteIsPending) return <LoadingOverlay />;
    return (
        <>
            <PageHeader title={"Manage Blogs"} controller={"Blogs"} controllerUrl={"/admin/blogs/blog-list"} page={"Blog's List"} />
            <Table columns={blogColums} data={blogData} paginationOptions={{ pageSize: 10 }} sortable loading={isLoading} />
        </>
    );
};

export default BlogList;
