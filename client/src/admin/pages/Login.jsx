import React from "react";
import Input from "../components/Form/Input";
import { Button } from "@/components/ui/button";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { adminLogin } from "../services/adminAuth";
import { login as AdminLogin } from "../api/authenticationApi";

const loginScheme = Yup.object().shape({
    email: Yup.string().required("Email Is Required").email("Enter a Valid Email"),
    password: Yup.string().required("Password Is Required").min(8, "Password Must Be At Least 8 Characters"),
});

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(loginScheme) });
    const { mutate: login, isLoading, isError } = adminLogin();

    const loginAdmin = async data => {
        console.log(data);
        login(data)
        console.log(isLoading);
        console.log(isError);
    };

    return (
        <section className="w-screen h-screen bg-gray-400">
            <div className="container mx-auto flex justify-center items-center h-full">
                <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
                    <h1 className="text-3xl font-bold text-center mb-4">Admin Panel</h1>
                    <p className="text-base text-center mb-6 text-gray-600">Sign in to start your session</p>
                    <form onSubmit={handleSubmit(loginAdmin)} className="space-y-4">
                        <Input
                            placeholder="Email"
                            {...register("email")}
                            className="text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            error={errors.email?.message}
                        />
                        <Input
                            placeholder="Password"
                            type="password"
                            {...register("password")}
                            className="text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            error={errors.password?.message}
                        />
                        <div className="flex flex-col md:flex-row gap-2 justify-between items-center">
                            <div className="flex gap-2 items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    id="remember"
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 scale-125 cursor-pointer"
                                />
                                <label htmlFor="remember" className="text-xl cursor-pointer">
                                    Remember Me
                                </label>
                            </div>
                            <Button variant="adPrimary" size="md">
                                Sign In
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Login;
