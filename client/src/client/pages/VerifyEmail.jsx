import { useForm } from "react-hook-form";
import Input from "@/components/Form/Input";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import { emailVerify } from "@/validation/UserScheme";
import Container from "../components/Container";
import OtpInput from "../components/OtpInput";
import { Helmet } from "react-helmet-async";

const VerifyEmail = () => {
    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue,
        setError,
        resetField,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(emailVerify),
    });
    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: data => crudService.post("users/verify-email", false, data),
        onError: error => {
            const message = error.response?.data?.message || "An unexpected error occurred.";
            resetField("email");
            resetField("otp");
            setError("root", { message });
        },
        onSuccess: data => {
            navigate("/login");
            toastService.success(data.message);
        },
    });

    return (
        <>
            <Helmet>
                <title>Verify Your Email - SameerCart</title>
                <meta name="description" content="Confirm your email address to activate your SameerCart account." />
                <meta name="robots" content="noindex, follow" />
            </Helmet>
            <Container>
                <section className="w-full my-10">
                    <div className="max-w-lg mx-auto border-2 border-gray-700 p-8 rounded-2xl shadow-2xl bg-gray-800 space-y-6 text-white">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-blue-500">Verify Your Account</h1>
                        </div>
                        <form className="space-y-4" onSubmit={handleSubmit(data => mutate(data))}>
                            {errors.root && (
                                <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                                    <p className="text-white font-bold text-sm">{errors.root.message}</p>
                                </div>
                            )}
                            <Input
                                label="Enter Your Email"
                                {...register("email")}
                                className="w-full text-lg rounded px-3 py-3 border border-gray-600 !bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter Your E-Mail"
                                type="email"
                                disabled={isPending}
                                error={errors.email?.message}
                            />
                            <div>
                                <label className="inline-block pl-2 text-base font-bold">
                                    OTP <span className="text-red-500 font-black">*</span>
                                </label>
                                <OtpInput onOtpSubmit={otp => setValue("otp", otp, { shouldValidate: true })} />
                                {errors.otp?.message && <p className="text-red-700 font-bold my-2 text-base px-2">{errors.otp?.message}</p>}
                            </div>
                            <Button disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold p-6 rounded-lg transition duration-300 ease-in-out transform">
                                Verify
                            </Button>
                        </form>
                    </div>
                </section>
            </Container>
        </>
    );
};

export default VerifyEmail;
