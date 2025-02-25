import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Loader from "../Loader/Loader";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogOut } from "@/features/home/userAuthSlice";
import { storePersistor } from "@/store";
import { changePasswordSchema } from "@/validation/UserScheme";

const ChangePassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        reset,
    } = useForm({ mode: "onChange", resolver: yupResolver(changePasswordSchema) });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Change Password
    const { mutate, isPending } = useMutation({
        mutationFn: data => crudService.post("users/change-password", false, { currentPassword: data.currentPassword, password: data.newPassword }),
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
            const message = error?.response?.data?.message || error?.message;
            reset();
            setError("root", { message });
        },
    });
    if (isPending) return <Loader />;
    return (
        <>
            <h1 className="text-2xl font-bold px-2 mb-5">Change Password</h1>
            <form className="space-y-5" onSubmit={handleSubmit(data => mutate(data))}>
                {errors.root && (
                    <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                        <p className="text-white font-bold text-sm">{errors.root.message}</p>
                    </div>
                )}
                <div className="flex flex-wrap my-2 gap-4 lg:gap-0">
                    <div className="w-full lg:w-1/2 px-2">
                        <label htmlFor={"newPassword"} className="inline-block pl-1 text-base font-bold mb-2">
                            New Password <span className="text-red-500 font-black">*</span>
                        </label>
                        <div className="relative w-full">
                            <input
                                id="newPassword"
                                placeholder="Enter Your New Password"
                                type={showPassword ? "text" : "password"}
                                {...register("newPassword")}
                                disabled={isPending}
                                onCopy={e => e.preventDefault()}
                                onPaste={e => e.preventDefault()}
                                className="w-full text-lg rounded px-3 py-3 border border-gray-600 !bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                            />
                            <button onClick={() => setShowPassword(prev => !prev)} type="button" className="absolute top-4 right-3 flex items-center justify-center">
                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                            {errors.newPassword?.message && <p className="text-red-700 font-bold my-2 text-base px-2">{errors.newPassword?.message}</p>}
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 px-2">
                        <label htmlFor={"confirmPassword"} className="inline-block pl-1 text-base font-bold mb-2">
                            Confrim Password <span className="text-red-500 font-black">*</span>
                        </label>
                        <div className="relative w-full">
                            <input
                                id="confirmPassword"
                                placeholder="Enter Your Confrim Password"
                                type={showPassword ? "text" : "password"}
                                {...register("confirmPassword")}
                                disabled={isPending}
                                onCopy={e => e.preventDefault()}
                                onPaste={e => e.preventDefault()}
                                className="w-full text-lg rounded px-3 py-3 border border-gray-600 !bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                            />
                            <button onClick={() => setShowPassword(prev => !prev)} type="button" className="absolute top-4 right-3 flex items-center justify-center">
                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                            {errors.confirmPassword?.message && <p className="text-red-700 font-bold my-2 text-base px-2">{errors.confirmPassword?.message}</p>}
                        </div>
                    </div>
                </div>

                <div className="px-2 max-w-60">
                    <Button disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold p-6 rounded transition duration-300 ease-in-out transform">
                        {isPending ? "Updating..." : "Update Password"}
                    </Button>
                </div>
            </form>
        </>
    );
};

export default ChangePassword;
