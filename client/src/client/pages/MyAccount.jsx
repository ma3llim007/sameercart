import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ChangePassword, Container } from "../components";
import { TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import { useDispatch } from "react-redux";
import { userLogOut } from "@/features/home/userAuthSlice";
import toastService from "@/services/toastService";
import { storePersistor } from "@/store";
import Loader from "../components/Loader/Loader";

const MyAccount = () => {
    const [activeTab, setActiveTab] = useState("account");
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    if (isPending) return <Loader />;
    return (
        <Container>
            <section className="w-full my-10 rounded-lg shadow-lg mx-auto select-none">
                <Tabs defaultValue="account" className="flex flex-col md:flex-row gap-5">
                    {/* Sidebar Tabs List */}
                    <TabsList className="flex flex-col justify-start gap-4 bg-dark-dark p-4 rounded-lg shadow-lg w-4/5 md:w-48 lg:w-56 order-2 md:order-1 mx-auto">
                        {["account", "address", "changePassword", "order"].map(tab => (
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
                    <div className="flex-1 bg-gray-800 p-4 rounded-lg shadow-md w-full order-1 lg:order-2">
                        <TabsContent value="account">
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                                <h2 className="text-xl font-semibold mb-2">Account Information</h2>
                                <p className="text-gray-400">Manage your account settings here.</p>
                            </motion.div>
                        </TabsContent>
                        <TabsContent value="address">
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-white">
                                <h2 className="text-xl font-semibold mb-2">Address Details</h2>
                                <p className="text-gray-400">Update your shipping and billing addresses.</p>
                            </motion.div>
                        </TabsContent>
                        <TabsContent value="changePassword">
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-white">
                                <ChangePassword />
                            </motion.div>
                        </TabsContent>
                        <TabsContent value="order">
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-white">
                                <h2 className="text-xl font-semibold mb-2">Order History</h2>
                                <p className="text-gray-400">View and manage your past orders.</p>
                            </motion.div>
                        </TabsContent>
                    </div>
                </Tabs>
            </section>
        </Container>
    );
};

export default MyAccount;
