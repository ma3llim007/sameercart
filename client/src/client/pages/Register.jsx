import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Banner, Container } from "../components";
import { Link } from "react-router-dom";
import bannerImage from "../assets/banner/basket_banner.webp";
import { Button } from "@/components/ui/button";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Input } from "@/components";

const Register = () => {
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
                    <div className="max-w-lg mx-auto border-2 p-4 rounded-2xl shadow-2xl bg-gray-600 space-y-4 text-white">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold underline">Sign Up</h1>
                            <p>Create Your Free Account 😎</p>
                        </div>
                        <form action="" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button className="Danger text-xl font-bold p-6">
                                    <FaGoogle /> Google
                                </Button>
                                <Button className="Primary text-xl font-bold p-6">
                                    <FaFacebook /> Facebook
                                </Button>
                            </div>
                            <hr />
                            <Input placeholder="Enter Your E-Mail" type="email" />
                            <Input placeholder="Enter Your Username" />
                            <Input placeholder="Enter Your Password" type="password" />
                            <Button className="Primary btnFull">Sign Up</Button>
                        </form>
                        <p>
                            By Signing Up You Agree To Our <Link to={"/terms-and-conditions"}>Terms of Service.</Link>
                        </p>
                        <div className="mt-5 text-center">
                            <p className="font-bold">
                                Not A Member? <Link to={`/login`}>Sign Up Now</Link>
                            </p>
                        </div>
                    </div>
                </section>
            </Container>
        </>
    );
};

export default Register;
