import crudService from "@/api/crudService";
import Loader from "@/client/components/Loader/Loader";
import toastService from "@/services/toastService";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FaBackward } from "react-icons/fa6";
import PageHeader from "../components/PageHeader";
import UserDetails from "../components/orders/UserDetails";
import { Helmet } from "react-helmet-async";

const ViewUser = () => {
    const navigate = useNavigate();
    const { userId } = useParams();

    // fetching data of order
    const { data, isPending } = useQuery({
        queryKey: ["userDetails", userId],
        queryFn: () => crudService.get(`users/view-user/${userId}`, true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
        enabled: !!userId,
        cacheTime: 2 * 60 * 1000, // 2 minutes
    });

    if (isPending) return <Loader />;
    return (
        <>
            <Helmet>
                <title>View User Profile | sameerCart</title>
                <meta name="description" content="Check detailed profile information of a registered user in sameerCart admin panel." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <PageHeader title={"Manage User's"} controller={"All Users"} controllerUrl={"/admin/users/user-list/"} />
            <section className="w-full">
                <div className="my-4 w-full container mx-auto border-t-4 border-blue-700 rounded-lg p-4 bg-gray-100 dark:bg-slate-800 space-y-4">
                    <UserDetails userData={data?.data} address={data?.data?.address} isViewUserPage={true} />
                    <Button className="Primary" onClick={() => navigate("/admin/users/user-list/")}>
                        <FaBackward /> Back To User Listing
                    </Button>
                </div>
            </section>
        </>
    );
};

export default ViewUser;
