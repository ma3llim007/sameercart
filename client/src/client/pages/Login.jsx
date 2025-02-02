import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Banner, Container } from "../components";
import { Link } from "react-router-dom";
import bannerImage from "../assets/banner/basket_banner.webp";
import { Button } from "@/components/ui/button";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Input } from "@/components";

const Login = () => {
    return (
        <div>
            <Banner title={"Login"} image={bannerImage}>
                <Breadcrumb>
                    <BreadcrumbList className="text-lg">
                        <BreadcrumbItem>
                            <Link to="/">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{"Login"}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </Banner>
            <Container>
                <section className="w-full my-10">
                    <section className="w-full my-10">
                        <div className="max-w-lg mx-auto border-2 border-gray-700 p-8 rounded-2xl shadow-2xl bg-gray-800 space-y-6 text-white">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold text-blue-500 mb-2">Login</h1>
                            </div>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Button className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold p-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                                        <FaGoogle /> Google
                                    </Button>
                                    <Button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold p-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                                        <FaFacebook /> Facebook
                                    </Button>
                                </div>
                                <div className="relative flex items-center justify-center">
                                    <hr className="w-full border-gray-600" />
                                    <span className="absolute bg-gray-800 px-4 text-gray-400">or</span>
                                </div>
                                <Input
                                    className="w-full text-lg rounded-lg px-3 py-3 border border-gray-600 !bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter Your E-Mail"
                                    type="email"
                                />
                                <div>
                                    <Input
                                        className="w-full text-lg rounded-lg px-3 py-3 border border-gray-600 !bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter Your Password"
                                        type="password"
                                    />
                                    <p className="mt-1">
                                        Forgot Your Password?{" "}
                                        <Link to={"/forgot-password"} className="text-blue-500 hover:underline">
                                            Reset It
                                        </Link>
                                    </p>
                                </div>
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
                                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                                    Don't have an account?{" "}
                                    <Link to="/register" className="text-blue-500 hover:underline">
                                        Sign up here
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </section>
                </section>
            </Container>
        </div>
    );
};

export default Login;
