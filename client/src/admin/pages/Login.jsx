import React from "react";
import Input from "../components/Form/Input";
import { Button } from "@/components/ui/button";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { LoginApi } from "../api/authApi";

const loginScheme = Yup.object().shape({
    email: Yup.string().required("Email Is Required").email("Enter a Valid Email"),
    password: Yup.string()
        .required("Password Is Required")
        .min(8, "Password Must Be At Least 8 Characters")
        .max(16, "Password Should Be Must Under 16 Characters"),
});

const Login = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({ resolver: yupResolver(loginScheme) });

    // Mutation Login
    const { mutate, isError, error, isPending, status } = useMutation({
        mutationFn: LoginApi,
        onError: error => {
            const message = error.response?.data?.message || "Login failed";
            setError("root", { message });
        },
        onSuccess: data => {
            console.log("Login successful:", data);
        },
    });

    const formSubmithandler = async data => {
        mutate(data);
    };
    return (
        <section className="w-screen h-screen bg-gray-400">
            <div className="container mx-auto flex justify-center items-center h-full">
                <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
                    <h1 className="text-3xl font-bold text-center">Admin Panel</h1>
                    <p className="text-base text-center mb-6 text-gray-600">Sign in to start your session</p>
                    {errors.root && (
                        <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                            <p className="text-white font-bold text-sm">{errors.root.message}</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit(formSubmithandler)} className="space-y-4">
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
                            <Button variant="adPrimary" size="lg">
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
