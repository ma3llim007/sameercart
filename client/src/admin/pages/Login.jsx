import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toastService from "@/services/toastService";
import Input from "@/components/Form/Input";
import crudService from "@/api/crudService";
import { login } from "@/features/admin/authSlice";
import { adminLoginSchema } from "@/validation/admin/AdminLoginSchema";
import { Helmet } from "react-helmet-async";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        resetField,
    } = useForm({
        resolver: yupResolver(adminLoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // Mutation Login
    const { mutate } = useMutation({
        mutationFn: data => crudService.post("auth/login", true, data),
        onError: error => {
            const message = error.response?.data?.message || "An unexpected error occurred.";
            setError("root", { message });
            resetField("email");
            resetField("password");
        },
        onSuccess: data => {
            const { admin, accessToken } = data?.data || {};
            dispatch(login({ admin, accessToken }));
            navigate("/admin/dashboard");
            toastService.success("Admin Login Sucessfully!");
        },
    });

    const formSubmithandler = async data => {
        mutate(data);
    };
    return (
        <>
            <Helmet>
                <title>Admin Login | sameerCart</title>
                <meta name="description" content="Secure login to access the admin panel of sameerCart. Manage products, orders, and users efficiently." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <section className="w-screen h-screen bg-slate-950">
                <div className="container mx-auto flex justify-center items-center h-full">
                    <div className="bg-stone-50 rounded-lg shadow-2xl p-8 w-full max-w-md text-black">
                        <h1 className="text-3xl font-bold text-center">Admin Panel</h1>
                        <p className="text-base text-center mb-6 text-gray-600">Sign in to start your session</p>
                        {errors.root && (
                            <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                                <p className="text-white font-bold text-sm">{errors.root.message}</p>
                            </div>
                        )}
                        <form onSubmit={handleSubmit(formSubmithandler)} className="space-y-4">
                            <Input
                                placeholder="Enter The Email"
                                {...register("email")}
                                className="text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                                error={errors.email?.message}
                            />
                            <Input
                                placeholder="Enter The Password"
                                type="password"
                                {...register("password")}
                                className="text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                                error={errors.password?.message}
                            />
                            <div className="flex flex-col md:flex-row gap-2 justify-between items-center">
                                <div className="flex gap-2 items-center cursor-pointer">
                                    <input type="checkbox" name="remember" id="remember" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 scale-125 cursor-pointer" />
                                    <label htmlFor="remember" className="text-xl cursor-pointer">
                                        Remember Me
                                    </label>
                                </div>
                                <Button className="Primary" size="lg">
                                    Sign In
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Login;
