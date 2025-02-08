import { useForm } from "react-hook-form";
import { Container } from "../components";
import { Input } from "@/components";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPassword } from "@/validation";

const ResetPassword = () => {
    let isPending = false;
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({ mode: "onChange", resolver: yupResolver(resetPassword) });

    const mutate = data => {
        console.log(data);
    };
    return (
        <Container>
            <section className="w-full my-10">
                <div className="max-w-lg mx-auto border-2 border-gray-700 px-3 py-5 rounded-2xl shadow-2xl bg-gray-800 space-y-6 text-white">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-blue-500">Reset Password</h1>
                    </div>
                    <form className="space-y-5" onSubmit={handleSubmit(data => mutate(data))}>
                        {errors.root && (
                            <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                                <p className="text-white font-bold text-sm">{errors.root.message}</p>
                            </div>
                        )}
                        <Input
                            {...register("email")}
                            className="w-full text-lg rounded px-3 py-3 border border-gray-600 !bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter Your E-Mail"
                            type="email"
                            disabled={isPending}
                            error={errors.email?.message}
                        />
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold p-6 rounded-lg transition duration-300 ease-in-out transform">Send</Button>
                    </form>
                    <div className="mt-6">
                        <p className="font-semibold text-gray-300">
                            Don&apos;t Have An Account?{" "}
                            <Link to="/register" className="text-blue-500 hover:underline">
                                Create An Account
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </Container>
    );
};

export default ResetPassword;
