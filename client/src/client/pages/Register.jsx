import { Container } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FaEye, FaEyeSlash, FaFacebook, FaGoogle } from "react-icons/fa";
import { Input } from "@/components";
import { useMutation } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerUser } from "@/validation";
import Loader from "../components/Loader/Loader";
import { useEffect, useState } from "react";

const Register = () => {
    const {
        handleSubmit,
        register,
        formState: { errors },
        setError,
        reset,
    } = useForm({
        resolver: yupResolver(registerUser),
        mode: "onChange",
    });
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    // Mutation With Google And Facebook
    // const { mutate: mutationGoogle } = useMutation({
    //     mutationFn: async () => {
    //         try {
    //             const response = await crudService.get("users/auth/google");
    //             console.log(response);
    //             // Redirect the user to Google's OAuth page
    //             if (response.data && response.data.redirectUrl) {
    //                 window.location.href = response.data.redirectUrl;
    //             }
    //         } catch (error) {
    //             const message = error.response?.data?.message || error?.message || "An unexpected error occurred.";
    //             // Handle error (display message, etc.)
    //             console.error(message);
    //         }
    //     },
    //     onError: error => {
    //         const message = error.response?.data?.message || error?.message || "An unexpected error occurred.";
    //         setError("root", { message });
    //     },
    // });

    // Mutation
    const { mutate, isPending } = useMutation({
        mutationFn: data => crudService.post("users/register", false, data),
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
            <section className="w-full my-5 select-none">
                <div className="max-w-lg mx-auto border-2 border-gray-700 px-3 py-2 rounded-2xl shadow-2xl bg-gray-800 space-y-4 text-white">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-blue-500 mb-1">Register</h1>
                        <p className="text-gray-300">Create Your Free Account 😎</p>
                    </div>
                    <div className="flex justify-center space-x-4">
                        <div
                            className="flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full transition duration-300 hover:bg-red-700 hover:scale-105 cursor-pointer"
                            onClick={() => console.log("FaGoogle")}
                        >
                            <FaGoogle className="text-2xl" />
                        </div>
                        <div
                            className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full transition duration-300 hover:bg-blue-700 hover:scale-105 cursor-pointer"
                            onClick={() => console.log("FaFacebook")}
                        >
                            <FaFacebook className="text-2xl" />
                        </div>
                    </div>
                    <form className="space-y-4" onSubmit={handleSubmit(data => mutate(data))}>
                        <div className="relative flex items-center justify-center">
                            <hr className="w-full border-gray-600" />
                            <span className="absolute bg-gray-800 px-4 text-gray-400">Or</span>
                        </div>
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
                            label="First Name"
                            placeholder="Enter Your First Name"
                            {...register("firstName")}
                            disabled={isPending}
                            error={errors.firstName?.message}
                            className="w-full text-lg rounded px-3 py-3 border border-gray-600 !bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Input
                            label="Last Name"
                            placeholder="Enter Your Last Name"
                            {...register("lastName")}
                            error={errors.lastName?.message}
                            disabled={isPending}
                            className="w-full text-lg rounded px-3 py-3 border border-gray-600 !bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Input
                            type="email"
                            label="Email"
                            placeholder="Enter Your Email"
                            {...register("email")}
                            error={errors.email?.message}
                            disabled={isPending}
                            className="w-full text-lg rounded px-3 py-3 border border-gray-600 !bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div>
                            <label htmlFor={"password"} className="inline-block pl-1 text-base font-bold mb-2">
                                Password <span className="text-red-500 font-black">*</span>
                            </label>
                            <div className="relative w-full">
                                <input
                                    id="password"
                                    placeholder="Enter Your Password"
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    onCopy={e => e.preventDefault()}
                                    onPaste={e => e.preventDefault()}
                                    disabled={isPending}
                                    className="w-full text-lg rounded px-3 py-3 border border-gray-600 !bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                                />
                                <button onClick={() => setShowPassword(prev => !prev)} type="button" className="absolute top-4 right-3 flex items-center justify-center">
                                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </button>
                                {errors.password?.message && <p className="text-red-700 font-bold my-2 text-base px-2">{errors.password?.message}</p>}
                            </div>
                        </div>
                        <Button disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold p-6 rounded-lg transition duration-300 ease-in-out transform">
                            Register
                        </Button>
                    </form>
                    <div className="mt-6 pl-2">
                        <p className="font-semibold text-gray-300">
                            Already An User ?{" "}
                            <Link to="/login" className="text-blue-500 hover:underline">
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </Container>
    );
};

export default Register;
