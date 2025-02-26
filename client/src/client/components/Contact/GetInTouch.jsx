import crudService from "@/api/crudService";
import { Input, TextArea } from "@/components";
import { Button } from "@/components/ui/button";
import toastService from "@/services/toastService";
import { contactUsScheme } from "@/validation/UserScheme";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaFacebook, FaGlobe, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaTwitter } from "react-icons/fa";
import { IoLocation } from "react-icons/io5";
import Loader from "../Loader/Loader";

const GetInTouch = () => {
    const {
        handleSubmit,
        register,
        formState: { errors },
        setError,
        reset,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(contactUsScheme),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: data => crudService.post("/contacts/add-contact", false, data),
        onSuccess: data => {
            toastService.success(data?.message);
            reset();
        },
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            setError("root", { message });
        },
    });

    if (isPending) return <Loader />;
    return (
        <section className="w-full my-20">
            <h1 className="text-3xl mb-5 font-bold underline underline-offset-2 decoration-2 text-center text-light-blue dark:text-dark-light">Get In Touch</h1>
            <div className="flex flex-col lg:flex-row gap-5">
                <div className="max-w-fit min-h-fit max-h-fit flex flex-col gap-5 bg-light-gray/50 dark:bg-dark-gray/30 p-10 rounded-lg">
                    <div className="flex gap-5 items-center group">
                        <div className="w-12 h-12 border rounded-full inline-flex justify-center items-center group-hover:bg-light-deep group-hover:text-white transition-colors duration-300 ease-in-out transform">
                            <FaPhoneAlt className="text-lg" />
                        </div>
                        <div className="space-y-1">
                            <p className="hover:text-light-deep hover:dark:text-dark-hoverLink transition-opacity duration-300 ease-in-out transform">
                                <a href="tel:9885191161">+91 98851 91161</a>
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 group items-center">
                        <div className="w-12 h-12 border rounded-full inline-flex justify-center items-center group-hover:bg-light-deep group-hover:text-white transition-colors duration-300 ease-in-out transform">
                            <FaGlobe className="text-lg" />
                        </div>
                        <div className="space-y-1">
                            <p className="hover:text-light-deep hover:dark:text-dark-hoverLink transition-opacity duration-300 ease-in-out transform">
                                <a href="mailto:mohdsameer68257@gmail.com">mohdsameer68257@gmail.com</a>
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 group items-center">
                        <div className="w-12 h-12 border rounded-full inline-flex justify-center items-center group-hover:bg-light-deep group-hover:text-white transition-colors duration-300 ease-in-out transform">
                            <IoLocation className="text-lg" />
                        </div>
                        <div className="space-y-1">
                            <p className="hover:text-light-deep hover:dark:text-dark-hoverLink transition-opacity duration-300 ease-in-out transform">Hyderabad, Telangana</p>
                        </div>
                    </div>
                    <div className="w-full mx-auto">
                        <h2 className="text-3xl font-bold">Follow Us:</h2>
                        <ul className="flex flex-wrap justify-start gap-3 items-center mt-5">
                            <li className="bg-light-deep p-2 rounded-full">
                                <a target="_blank" href="https://www.facebook.com/Ma3llim007/">
                                    <FaFacebook className="font-bold text-xl text-light-textWhite" />
                                </a>
                            </li>
                            <li className="bg-light-deep p-2 rounded-full">
                                <a target="_blank" href="https://x.com/ma_3llim_007">
                                    <FaTwitter className="font-bold text-xl text-light-textWhite" />
                                </a>
                            </li>
                            <li className="bg-light-deep p-2 rounded-full">
                                <a target="_blank" href="https://www.instagram.com/ma_3llim_007/">
                                    <FaInstagram className="font-bold text-xl text-light-textWhite" />
                                </a>
                            </li>
                            <li className="bg-light-deep p-2 rounded-full">
                                <a target="_blank" href="https://www.linkedin.com/in/mohdsameer-dev/">
                                    <FaLinkedinIn className="font-bold text-xl text-light-textWhite" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="w-full flex-grow bg-light-gray/50 dark:bg-dark-gray/30 p-5 rounded-lg">
                    <form onSubmit={handleSubmit(data => mutate(data))} className="space-y-5">
                        {errors.root && (
                            <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                                <h4 className="text-white font-bold text-sm">{errors.root.message}</h4>
                            </div>
                        )}
                        <div className="flex flex-wrap my-2 gap-4 md:gap-0">
                            <div className="w-full md:w-1/2 px-2">
                                <Input
                                    placeholder="Enter Your First Name"
                                    {...register("firstName")}
                                    disabled={isPending}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    error={errors.firstName?.message}
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-2">
                                <Input
                                    placeholder="Enter Your Last Name"
                                    {...register("lastName")}
                                    disabled={isPending}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    error={errors.lastName?.message}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap my-2 gap-4 md:gap-0">
                            <div className="w-full md:w-1/2 px-2">
                                <Input
                                    placeholder="Enter Your Email"
                                    {...register("email")}
                                    type="email"
                                    disabled={isPending}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    error={errors.email?.message}
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-2">
                                <Input
                                    placeholder="Enter Your Phone Number"
                                    {...register("phoneNumber")}
                                    disabled={isPending}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    error={errors.phoneNumber?.message}
                                />
                            </div>
                        </div>
                        <div className="w-full px-2">
                            <Input
                                placeholder="Enter Your Subject"
                                {...register("subject")}
                                disabled={isPending}
                                className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                error={errors.subject?.message}
                            />
                        </div>
                        <div className="w-full px-2">
                            <TextArea
                                placeholder="Enter Your Message"
                                {...register("message")}
                                disabled={isPending}
                                rows={4}
                                className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                error={errors.message?.message}
                            />
                        </div>
                        <div className="w-full px-2">
                            <Button className="Primary btnLg">Send</Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default GetInTouch;
