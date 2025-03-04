import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { Input } from "@/components";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Loading from "../components/Loading";
import { FaEdit } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { editProductStock } from "@/validation/admin/ProductScheme";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";

const UpdateStock = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(editProductStock),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: data => crudService.patch(`product/update-stock/${productId}`, true, data),
        onSuccess: data => {
            navigate(`/admin/products/products-stock-list`);
            queryClient.invalidateQueries(["outOfStockProductsList"]);
            toastService.success(data?.message);
        },
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            setError("root", { message });
        },
    });
    return (
        <>
            <PageHeader
                title={"Manage Product"}
                controller={"Product's List"}
                controllerUrl={"/admin/products/products-list"}
                subController={"Out Of Stock Product's List"}
                subControllerUrl={"/admin/products/products-stock-list"}
                page={"Update Prodcut Stock"}
            />
            <section className="w-full">
                <div className="my-4 w-full container mx-auto border-t-4 border-blue-700 rounded-lg p-2 bg-gray-100 dark:bg-slate-800">
                    <form className="space-y-5" onSubmit={handleSubmit(data => mutate(data))} encType="multipart/form-data">
                        <h1 className="text-xl font-bold my-4 px-2">Update Product Stock</h1>
                        {errors.root && (
                            <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                                <h4 className="text-white font-bold text-sm">{errors.root.message}</h4>
                            </div>
                        )}
                        <div className="flex flex-wrap my-2 gap-4 lg:gap-0">
                            <div className="w-full lg:w-1/2 px-2">
                                <Input
                                    label="Product Stock"
                                    placeholder="Enter The Product Stock"
                                    {...register("productStock")}
                                    disabled={isPending}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                    error={errors.productStock?.message}
                                />
                            </div>
                        </div>
                        <div className="w-full border-t !mt-6">
                            <Button disabled={isPending} className="Primary my-2 btnXl">
                                {isPending ? (
                                    <Loading height="7" weight="7" />
                                ) : (
                                    <>
                                        <FaEdit /> Update
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default UpdateStock;
