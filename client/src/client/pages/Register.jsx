import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Banner, Container } from "../components";
import { Link } from "react-router-dom";
import bannerImage from "../assets/banner/basket_banner.webp";
import { Button } from "@/components/ui/button";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Input } from "@/components";
import { useMutation } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import { useForm } from "react-hook-form";

const Register = () => {
    const {
        handleSubmit,
        register,
        formState: { errors },
        setError,
    } = useForm({
        mode: "onChange",
    });
    // Mutation With Google And Facebook
    const { mutate: mutationGoogle } = useMutation({
        mutationFn: async () => {
            try {
                const response = await crudService.get("users/auth/google");
                console.log(response);
                // Redirect the user to Google's OAuth page
                if (response.data && response.data.redirectUrl) {
                    window.location.href = response.data.redirectUrl;
                }
            } catch (error) {
                const message = error.response?.data?.message || error?.message || "An unexpected error occurred.";
                // Handle error (display message, etc.)
                console.error(message);
            }
        },
        onError: error => {
            const message = error.response?.data?.message || error?.message || "An unexpected error occurred.";
            setError("root", { message });
        },
    });
    return (
        <>
            <Banner title={"Register"} image={bannerImage}>
                <Breadcrumb>
                    <BreadcrumbList className="text-lg">
                        <BreadcrumbItem>
                            <Link to="/">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{"Register"}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </Banner>
            <Container>
                <section className="w-full my-10">
                    <section className="w-full my-10">
                        <div className="max-w-lg mx-auto border-2 border-gray-700 p-8 rounded-2xl shadow-2xl bg-gray-800 space-y-6 text-white">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold text-blue-500 mb-2">Sign Up</h1>
                                <p className="text-gray-300">Create Your Free Account 😎</p>
                            </div>
                            {errors.root && (
                                <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                                    <p className="text-white font-bold text-sm">{errors.root.message}</p>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button
                                    onClick={() => mutationGoogle()}
                                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold p-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                                >
                                    <FaGoogle /> Google
                                </Button>
                                <Button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold p-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                                    <FaFacebook /> Facebook
                                </Button>
                            </div>
                            <form action="" className="space-y-6">
                                <div className="relative flex items-center justify-center">
                                    <hr className="w-full border-gray-600" />
                                    <span className="absolute bg-gray-800 px-4 text-gray-400">or</span>
                                </div>
                                <Input
                                    className="w-full text-lg rounded-lg px-3 py-3 border border-gray-600 !bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter Your E-Mail"
                                    type="email"
                                />
                                <Input
                                    className="w-full text-lg rounded-lg px-3 py-3 border border-gray-600 !bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter Your Username"
                                />
                                <Input
                                    className="w-full text-lg rounded-lg px-3 py-3 border border-gray-600 !bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter Your Password"
                                    type="password"
                                />
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold p-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                                    Sign Up
                                </Button>
                            </form>
                            <p className="text-center text-gray-400">
                                By signing up, you agree to our{" "}
                                <Link to="/terms-and-conditions" className="text-blue-500 hover:underline">
                                    Terms of Service
                                </Link>
                                .
                            </p>
                            <div className="mt-6 text-center">
                                <p className="font-semibold text-gray-300">
                                    Already a member?{" "}
                                    <Link to="/login" className="text-blue-500 hover:underline">
                                        Log In
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </section>
                </section>
            </Container>
        </>
    );
};

export default Register;
