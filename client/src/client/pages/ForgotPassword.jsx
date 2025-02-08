import { Input } from "@/components";
import { Container } from "../components";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPassword } from "@/validation";
import { useMutation } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import Loader from "../components/Loader/Loader";
import { useEffect, useState } from "react";

const ForgotPassword = () => {
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        setError,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(forgotPassword),
    });
    const [message, setMessage] = useState(null);

    const { mutate, isPending } = useMutation({
        mutationFn: data => crudService.post("users/forgot-password", false, data),
        onSuccess: data => {
            setMessage(data?.message);
            reset();
        },
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            reset();
            setError("root", { message });
        },
    });

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 15000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    if (isPending) return <Loader />;
    return (
        <Container>
            <section className="w-full my-10">
                <div className="max-w-lg mx-auto border-2 border-gray-700 px-5 py-10 rounded-2xl shadow-2xl bg-gray-800 space-y-2 text-white">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-blue-500">Reset Password</h1>
                    </div>
                    <form className="space-y-5" onSubmit={handleSubmit(data => mutate(data))}>
                        {errors.root && (
                            <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                                <p className="text-white font-bold text-sm">{errors.root.message}</p>
                            </div>
                        )}
                        {message && (
                            <div className="w-full my-4 bg-green-600 text-center rounded-md border-2 border-green-800 py-3 px-4">
                                <p className="text-white font-bold text-lg">{message}</p>
                            </div>
                        )}
                        <Input
                            label="E-Mail"
                            {...register("email")}
                            className="w-full text-lg rounded px-3 py-3 border border-gray-600 !bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter Your E-Mail"
                            type="email"
                            disabled={isPending}
                            error={errors.email?.message}
                        />
                        <Button isPending={isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold p-6 rounded-lg transition duration-300 ease-in-out transform">
                            Send
                        </Button>
                    </form>
                    <p className="font-semibold text-gray-300 pl-1">
                        Don&apos;t Have An Account?{" "}
                        <Link to="/register" className="text-blue-500 hover:underline">
                            Create An Account
                        </Link>
                    </p>
                </div>
            </section>
        </Container>
    );
};

export default ForgotPassword;
