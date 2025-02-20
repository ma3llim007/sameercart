import { useQuery } from "@tanstack/react-query";
import { Input, Loading, PageHeader, Select, ShippingAddress, UserDetails } from "../components";
import crudService from "@/api/crudService";
import { useParams } from "react-router-dom";
import toastService from "@/services/toastService";
import Loader from "@/client/components/Loader/Loader";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { orderViewActionOptions } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { newOrderScheme } from "@/validation";

const ViewNewOrder = () => {
    const { orderId } = useParams();
    const {
        handleSubmit,
        formState: { errors },
        register,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(newOrderScheme),
    });

    // fetching data of order
    const { data, isPending } = useQuery({
        queryKey: ["viewNewOrder", orderId],
        queryFn: () => crudService.get(`order/view-order/${orderId}`, true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
        enabled: !!orderId,
    });
    if (isPending) return <Loader />;
    const { user, shippingAddress } = data?.data || {};

    return (
        <>
            <PageHeader title={"Manage Order's"} controller={"Order"} controllerUrl={"/admin/orders/new-order/"} page={"View Order"} />
            <section className="w-full">
                <div className="my-4 w-full container mx-auto border-t-4 border-blue-700 rounded-lg p-4 bg-gray-100 dark:bg-slate-800">
                    <h1 className="text-2xl font-bold underline underline-offset-4 mb-4">View Order</h1>

                    <div className="space-y-4">
                        <form className="space-y-5 border-2 rounded-xl mt-4 border-green-700" onSubmit={handleSubmit(data => mutate(data))} encType="multipart/form-data" method="POST">
                            <h1 className="text-xl font-bold py-4 px-2 bg-green-700 rounded-t-lg">Order Action</h1>
                            {errors.root && (
                                <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                                    <h4 className="text-white font-bold text-sm">{errors.root.message}</h4>
                                </div>
                            )}
                            <div className="flex flex-wrap my-2">
                                <div className="w-full md:w-1/2 px-2 my-2">
                                    {/* <Input
                                        label="Variant Base Price"
                                        {...register("basePrice")}
                                        placeholder="Enter The Variant Base Price"
                                        className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                        error={errors?.basePrice?.message}
                                    /> */}
                                    <Select
                                        label="Order Status"
                                        placeholder="Select a Order Status"
                                        title="Select a Order Status"
                                        options={orderViewActionOptions}
                                        defaultValue="default"
                                        name="productType"
                                        {...register("orderStatus")}
                                        error={errors.orderStatus?.message}
                                        className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                    />
                                </div>
                                <div className="w-full md:w-1/2 px-2 my-2">
                                    <Input
                                        label="Variant Discount Price"
                                        {...register("discountPrice")}
                                        placeholder="Enter The Variant Discount Price"
                                        className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                        error={errors?.discountPrice?.message}
                                    />
                                </div>
                            </div>
                            <div className="w-full border-t px-2">
                                <Button type="submit" disabled={isPending} className="Primary my-2 btnXl">
                                    {isPending ? (
                                        <Loading height="7" weight="7" />
                                    ) : (
                                        <>
                                            <FaPlus /> Add
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                        <UserDetails userData={user} />
                        <ShippingAddress address={shippingAddress} />
                    </div>
                </div>
            </section>
        </>
    );
};

export default ViewNewOrder;
