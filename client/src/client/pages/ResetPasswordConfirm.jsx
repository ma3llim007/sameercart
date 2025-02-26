import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Loader from "../components/Loader/Loader";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { yupResolver } from "@hookform/resolvers/yup";
import crudService from "@/api/crudService";
import { useNavigate, useParams } from "react-router-dom";
import toastService from "@/services/toastService";
import { resetPasswordConfrim } from "@/validation/UserScheme";
import Container from "../components/Container";

const ResetPasswordConfirm = () => {
    const {
        handleSubmit,
        reset,
        formState: { errors },
        register,
        setError,
    } = useForm({ mode: "onChange", resolver: yupResolver(resetPasswordConfrim) });
    const [showPassword, setShowPassword] = useState(false);
    const { userId, token } = useParams();
    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: data => crudService.post(`/users/reset-password/${userId}/:${token}`, false, { password: data.new_password }),
        onSuccess: data => {
            navigate("/login");
            toastService.success(data?.message);
        },
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            reset();
            setError("root", { message });
        },
    });

    if (isPending) return <Loader />;
    return (
        <Container>
            <section className="w-full my-10">
                <div className="max-w-lg mx-auto border-2 border-gray-700 p-5 rounded-2xl shadow-2xl bg-gray-800 space-y-6 text-white">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-blue-500">Reset Password</h1>
                    </div>
                    <form className="space-y-5" onSubmit={handleSubmit(data => mutate(data))}>
                        {errors.root && (
                            <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                                <p className="text-white font-bold text-sm">{errors.root.message}</p>
                            </div>
                        )}
                        <div>
                            <label htmlFor={"new_password"} className="inline-block pl-1 text-base font-bold mb-2">
                                New Password <span className="text-red-500 font-black">*</span>
                            </label>
                            <div className="relative w-full">
                                <input
                                    id="new_password"
                                    placeholder="Enter Your New Password"
                                    type={showPassword ? "text" : "password"}
                                    {...register("new_password")}
                                    disabled={isPending}
                                    className="w-full text-lg rounded px-3 py-3 border border-gray-600 !bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                                />
                                <button onClick={() => setShowPassword(prev => !prev)} type="button" className="absolute top-4 right-3 flex items-center justify-center">
                                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </button>
                                {errors.new_password?.message && <p className="text-red-700 font-bold my-2 text-base px-2">{errors.new_password?.message}</p>}
                            </div>
                        </div>
                        <div>
                            <label htmlFor={"confirm_password"} className="inline-block pl-1 text-base font-bold mb-2">
                                Confirm Password <span className="text-red-500 font-black">*</span>
                            </label>
                            <div className="relative w-full">
                                <input
                                    id="confirm_password"
                                    placeholder="Enter Your Confirm Password"
                                    type={showPassword ? "text" : "password"}
                                    {...register("confirm_password")}
                                    disabled={isPending}
                                    className="w-full text-lg rounded px-3 py-3 border border-gray-600 !bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                                />
                                <button onClick={() => setShowPassword(prev => !prev)} type="button" className="absolute top-4 right-3 flex items-center justify-center">
                                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </button>
                                {errors.confirm_password?.message && <p className="text-red-700 font-bold my-2 text-base px-2">{errors.confirm_password?.message}</p>}
                            </div>
                        </div>
                        <Button disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold p-6 rounded-lg transition duration-300 ease-in-out transform">
                            Login
                        </Button>
                    </form>
                </div>
            </section>
        </Container>
    );
};

export default ResetPasswordConfirm;
