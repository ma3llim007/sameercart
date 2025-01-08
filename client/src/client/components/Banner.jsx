import { motion } from "framer-motion";
import bannerImage from "../assets/banner/delivery.webp";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
const Banner = ({
    image = bannerImage,
    title,
    controller,
    controllerUrl,
    subController,
    subControllerUrl,
    page,
}) => {
    return (
        <section className="w-full h-96 relative select-none">
            <img
                loading="lazy"
                className="w-full h-full object-cover"
                src={image}
                alt={title || "Banner Image"}
            />
            <div className="absolute w-full h-full top-0 left-0 right-0 text-white bg-black bg-opacity-50 flex justify-center items-center">
                <motion.div
                    className="container mx-auto text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <motion.h1
                        className="text-3xl md:text-4xl font-bold underline decoration-4 underline-offset-4"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.4,
                        }}
                    >
                        {title}
                    </motion.h1>
                    {controller || page && (
                        <motion.div
                            className="justify-center items-center hidden md:flex my-4 text-lg"
                            initial={{ y: 60, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                duration: 0.8,
                                delay: 0.7,
                            }}
                        >
                            <Breadcrumb className="text-lg">
                                <BreadcrumbList className="text-lg">
                                    <BreadcrumbItem>
                                        <Link
                                            className="flex gap-2 items-center"
                                            to={"/"}
                                        >
                                            Home
                                        </Link>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    {controller && controllerUrl && (
                                        <BreadcrumbItem>
                                            <BreadcrumbLink
                                                href={controllerUrl}
                                            >
                                                {controller}
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                    )}

                                    {subController && subControllerUrl && (
                                        <>
                                            <BreadcrumbSeparator />
                                            <BreadcrumbItem>
                                                <BreadcrumbLink
                                                    href={controllerUrl}
                                                >
                                                    {controller}
                                                </BreadcrumbLink>
                                            </BreadcrumbItem>
                                            <BreadcrumbSeparator />
                                        </>
                                    )}
                                    {page && (
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>
                                                {page}
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    )}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default Banner;
