import React from "react";
import { Input, PageHeader } from "../components";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

const AddAdmins = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm();

    return (
        <>
            <PageHeader title={"Manage Admin"} controller={"Admin"} controllerUrl={"/admin/admins/"} page={"Add Admin's"} />
            <section className="w-full ">
                <div className="my-4 w-full container mx-auto border-t-4 border-blue-700 rounded-lg p-2 bg-gray-100 dark:bg-slate-800">
                    <h1 className="text-xl font-bold my-4">Add Admin</h1>
                    <form className="space-y-5">
                        <div className="flex flex-wrap my-2">
                            <div className="w-full md:w-1/2 px-2">
                                <Input
                                    label="Username"
                                    placeholder="Enter The Username"
                                    {...register("username")}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    error={errors.username?.message}
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-2">
                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="Enter The Email"
                                    {...register("email")}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    error={errors.email?.message}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap my-2">
                            <div className="w-full md:w-1/2 px-2">
                                <Input
                                    label="Full Name"
                                    placeholder="Enter The Full Name"
                                    {...register("fullName")}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    error={errors.fullName?.message}
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-2">
                                <Input
                                    label="Phone Number"
                                    placeholder="Enter The Phone Number"
                                    {...register("phoneNumber")}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    error={errors.phoneNumber?.message}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap mt-2">
                            <div className="w-full md:w-1/2 px-2">
                                <Input
                                    label="Password"
                                    placeholder="Enter The Password"
                                    {...register("password")}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    error={errors.password?.message}
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-2">
                                <Input
                                    label="Confirm Password"
                                    placeholder="Enter The Confirm Password"
                                    {...register("phoneNumber")}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    error={errors.passwordConfirm?.message}
                                />
                            </div>
                        </div>
                        <div className="w-full border-t !mt-6">
                            <Button className="adPrimary my-2 btnXl">Add</Button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default AddAdmins;
