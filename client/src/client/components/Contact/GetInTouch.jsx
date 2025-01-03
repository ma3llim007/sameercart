import { Button } from "@/components/ui/button";
import React from "react";
import {
    FaFacebook,
    FaGlobe,
    FaGoogle,
    FaInstagram,
    FaLinkedinIn,
    FaPhoneAlt,
    FaTwitter,
} from "react-icons/fa";
import { IoLocation } from "react-icons/io5";

const GetInTouch = () => {
    return (
        <section className="w-full my-20">
            <div className="w-full mb-5">
                <h1 className="text-3xl font-bold underline underline-offset-2 decoration-2 text-center text-light-blue dark:text-dark-light">
                    Get In Touch
                </h1>
            </div>
            <div className="grid grid-cols-3 gap-10 items-center place-content-center">
                <div className="flex flex-col gap-10 bg-light-gray/50 dark:bg-dark-gray/30 p-10 rounded-lg">
                    <div className="flex gap-5 items-center group">
                        <div className="w-12 h-12 border rounded-full inline-flex justify-center items-center group-hover:bg-light-deep group-hover:text-white transition-colors duration-300 ease-in-out transform">
                            <FaPhoneAlt className="text-lg" />
                        </div>
                        <div className="space-y-1">
                            <p className="hover:text-light-deep hover:dark:text-dark-hoverLink transition-opacity duration-300 ease-in-out transform">
                                <a href="tel:9885191161">+91 98851 91161</a>
                            </p>
                            <p className="hover:text-light-deep hover:dark:text-dark-hoverLink transition-opacity duration-300 ease-in-out transform">
                                <a href="tel:9885191161">+91 98851 91161</a>
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 group">
                        <div className="w-12 h-12 border rounded-full inline-flex justify-center items-center group-hover:bg-light-deep group-hover:text-white transition-colors duration-300 ease-in-out transform">
                            <FaGlobe className="text-lg" />
                        </div>
                        <div className="space-y-1">
                            <p className="hover:text-light-deep hover:dark:text-dark-hoverLink transition-opacity duration-300 ease-in-out transform">
                                <a href="mailto:mohdsameer68257@gmail.com">
                                    mohdsameer68257@gmail.com
                                </a>
                            </p>
                            <p className="hover:text-light-deep hover:dark:text-dark-hoverLink transition-opacity duration-300 ease-in-out transform">
                                <a href="mailto:mohdsameer68257@gmail.com">
                                    mohdsameer68257@gmail.com
                                </a>
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 group">
                        <div className="w-12 h-12 border rounded-full inline-flex justify-center items-center group-hover:bg-light-deep group-hover:text-white transition-colors duration-300 ease-in-out transform">
                            <IoLocation className="text-lg" />
                        </div>
                        <div className="space-y-1">
                            <p className="hover:text-light-deep hover:dark:text-dark-hoverLink transition-opacity duration-300 ease-in-out transform">
                                Address goes here,
                            </p>
                            <p className="hover:text-light-deep hover:dark:text-dark-hoverLink transition-opacity duration-300 ease-in-out transform">
                                Address goes here,
                            </p>
                        </div>
                    </div>
                    <div className="w-full my-4 mx-auto">
                        <h2 className="text-3xl my-3 font-bold">Follow Us:</h2>
                        <ul className="flex flex-wrap justify-start gap-3 items-center mt-5">
                            <li className="bg-light-deep p-2 rounded-full">
                                <a target="_blank" href="#">
                                    <FaFacebook className="font-bold text-xl text-light-textWhite" />
                                </a>
                            </li>
                            <li className="bg-light-deep p-2 rounded-full">
                                <a
                                    target="_blank"
                                    href="https://x.com/ma_3llim_007"
                                >
                                    <FaTwitter className="font-bold text-xl text-light-textWhite" />
                                </a>
                            </li>
                            <li className="bg-light-deep p-2 rounded-full">
                                <a
                                    target="_blank"
                                    href="https://www.instagram.com/ma_3llim_007/"
                                >
                                    <FaInstagram className="font-bold text-xl text-light-textWhite" />
                                </a>
                            </li>
                            <li className="bg-light-deep p-2 rounded-full">
                                <a target="_blank" href="#">
                                    <FaGoogle className="font-bold text-xl text-light-textWhite" />
                                </a>
                            </li>
                            <li className="bg-light-deep p-2 rounded-full">
                                <a
                                    target="_blank"
                                    href="https://www.linkedin.com/in/mohd-sameer-web/"
                                >
                                    <FaLinkedinIn className="font-bold text-xl text-light-textWhite" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="w-full col-span-2 bg-light-gray/50 dark:bg-dark-gray/30  p-10 rounded-lg">
                    <form action="#" method="post" className="space-y-10">
                        <div className="w-full grid grid-cols-2 gap-5">
                            <input
                                className="border border-opacity-10 rounded bg-inherit py-1.5 px-4 focus:outline-none"
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Name *"
                            />
                            <input
                                className="border border-opacity-10 rounded bg-inherit py-1.5 px-4 focus:outline-none"
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Email *"
                            />
                        </div>
                        <div className="w-full grid grid-cols-1 gap-5">
                            <input
                                className="border border-opacity-10 rounded bg-inherit py-1.5 px-4 focus:outline-none"
                                type="text"
                                name="subject"
                                id="subject"
                                placeholder="Subject *"
                            />
                        </div>
                        <div className="w-full grid grid-cols-1 gap-5">
                            <input
                                className="border border-opacity-10 rounded bg-inherit py-1.5 px-4 focus:outline-none"
                                type="text"
                                name="phonenumber"
                                id="phonenumber"
                                placeholder="Phone Number *"
                            />
                        </div>
                        <div className="w-full grid grid-cols-1 gap-5">
                            <textarea
                                className="border border-opacity-10 rounded bg-inherit py-1.5 px-4 focus:outline-none"
                                type="text"
                                name="phonenumber"
                                id="phonenumber"
                                placeholder="Your Message *"
                                rows={4}
                            />
                        </div>
                        <div className="w-fulll">
                            <Button className="Primary btnLg">Send</Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default GetInTouch;
