import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ChangePassword, Container, Dashboard, Order, ProfileInformation } from "../components";
import { TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import { useDispatch, useSelector } from "react-redux";
import { userLogOut } from "@/features/home/userAuthSlice";
import toastService from "@/services/toastService";
import { storePersistor } from "@/store";
import Loader from "../components/Loader/Loader";

const MyAccount = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { _id: userId } = useSelector(state => state.userAuth?.user || {});

    const { mutate, isPending } = useMutation({
        mutationFn: () => crudService.post("/users/log-out", false),
        onSuccess: data => {
            dispatch(userLogOut());
            toastService.info(data?.message || "Logged out successfully");
            // Ensure storePersistor exists before calling purge()
            if (storePersistor?.purge) {
                storePersistor.purge();
            }
            navigate("/");
        },
        onError: error => {
            toastService.error(error?.response?.data?.message || "Something went wrong while logging out");
        },
    });

    // Fetching User Data
    const { data, isPending: DataIsPending } = useQuery({
        queryKey: ["userData", userId],
        queryFn: () => crudService.get("users/dashboard/", false),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
        enabled: !!userId,
    });

    if (isPending || DataIsPending) return <Loader />;
    return (
        <Container>
            <section className="w-full my-10 rounded-lg shadow-lg mx-auto select-none">
                <Tabs defaultValue={activeTab} className="flex flex-col md:flex-row gap-5">
                    {/* Sidebar Tabs List */}
                    <TabsList className="flex flex-col justify-start gap-4 bg-dark-dark p-4 rounded-lg w-4/5 md:w-48 lg:w-56 order-2 md:order-1 mx-auto h-max shadow-2xl">
                        {["dashboard", "profileInformation", "changePassword", "order"].map(tab => (
                            <TabsTrigger
                                key={tab}
                                value={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative border px-4 text-base py-2 text-center lg:text-start text-white font-bold transition-all duration-300 ease-in-out rounded-md hover:bg-blue-950 ${activeTab === tab && "bg-blue-950"}`}
                            >
                                {tab === activeTab && (
                                    <motion.div layoutId="active-tab" className="absolute inset-0 bg-blue-950 rounded-md" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                                )}
                                <span className="relative z-10">{tab.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}</span>
                            </TabsTrigger>
                        ))}
                        {/* New Links for Cart & Wishlist */}
                        <Link to="/cart" className="border px-4 py-2 rounded-md font-bold text-white text-center lg:text-start hover:bg-blue-950">
                            Cart
                        </Link>
                        <Link to="/wishlist" className="border px-4 py-2 rounded-md font-bold text-white text-center lg:text-start hover:bg-blue-950">
                            Wishlist
                        </Link>
                        <p onClick={mutate} className="border px-4 py-2 rounded-md font-bold text-white text-center lg:text-start hover:bg-blue-950 cursor-pointer">
                            Logout
                        </p>
                    </TabsList>
                    <div className="flex-1 bg-gray-300 dark:bg-gray-800 p-2 rounded-lg w-full order-1 lg:order-2 shadow-2xl">
                        <TabsContent value="dashboard">
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                                <Dashboard user={data?.data} />
                            </motion.div>
                        </TabsContent>
                        <TabsContent value="profileInformation">
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                                <ProfileInformation data={data?.data} setActiveTab={setActiveTab} />
                            </motion.div>
                        </TabsContent>
                        <TabsContent value="changePassword">
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                                <ChangePassword />
                            </motion.div>
                        </TabsContent>
                        <TabsContent value="order">
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                                <Order userId={userId} />
                            </motion.div>
                        </TabsContent>
                    </div>
                </Tabs>
            </section>
        </Container>
    );
};

export default MyAccount;
