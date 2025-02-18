import { Container, OAuthButtons } from "../components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Input } from "@/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginUser } from "@/validation/UserScheme";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "@/features/home/userAuthSlice";

const Login = () => {
    const {
        handleSubmit,
        register,
        formState: { errors },
        setError,
        reset,
    } = useForm({
        resolver: yupResolver(loginUser),
        mode: "onChange",
    });
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.userAuth);
    const location = useLocation();
    const errorMessage = location.state;

    // Ensure toast doesn't trigger infinitely
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/account/dashboard");
        }
    }, [isAuthenticated, navigate]);

    // Mutation
    const { mutate, isPending } = useMutation({
        mutationFn: data => crudService.post("users/login", false, data),
        onSuccess: data => {
            const { _id, firstName, lastName, email } = data?.data?.user || {};
            dispatch(userLogin({ _id, firstName, lastName, email }));
            navigate("/account/dashboard");
            toastService.success(data?.message);
        },
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            reset();
            setError("root", { message });
        },
    });
    return (
        <Container>
            <section className="w-full my-10">
                <div className="max-w-lg mx-auto border-2 border-gray-700 p-5 rounded-2xl shadow-2xl bg-gray-800 space-y-6 text-white">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-blue-500">Login</h1>
                    </div>
                    <OAuthButtons isPending={isPending} />
                    <form className="space-y-5" onSubmit={handleSubmit(data => mutate(data))}>
                        <div className="relative flex items-center justify-center">
                            <hr className="w-full border-gray-600" />
                            <span className="absolute bg-gray-800 px-4 text-gray-400">or</span>
                        </div>
                        {errors.root && (
                            <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                                <p className="text-white font-bold text-sm">{errors.root.message}</p>
                            </div>
                        )}
                        {errorMessage && (
                            <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                                <p className="text-white font-bold text-sm">{errorMessage}</p>
                            </div>
                        )}
                        <Input
                            {...register("email")}
                            className="w-full text-lg rounded px-3 py-3 border border-gray-600 !bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            label="E-Mail"
                            placeholder="Enter Your E-Mail"
                            type="email"
                            disabled={isPending}
                            error={errors.email?.message}
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
                                    disabled={isPending}
                                    onCopy={e => e.preventDefault()}
                                    onPaste={e => e.preventDefault()}
                                    className="w-full text-lg rounded px-3 py-3 border border-gray-600 !bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                                />
                                <button onClick={() => setShowPassword(prev => !prev)} type="button" className="absolute top-4 right-3 flex items-center justify-center">
                                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </button>
                                {errors.password?.message && <p className="text-red-700 font-bold my-2 text-base px-2">{errors.password?.message}</p>}
                                <Link to={"/forgot-password"}>
                                    <p className="text-light-blue font-bold mt-4 text-base px-2">Forgot Password ?</p>
                                </Link>
                            </div>
                        </div>
                        <Button disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold p-6 rounded-lg transition duration-300 ease-in-out transform">
                            Login
                        </Button>
                    </form>
                    <p className="font-semibold text-gray-300">
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

export default Login;
