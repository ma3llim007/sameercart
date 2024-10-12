import React, { useMemo } from "react";
import { FiPhoneCall } from "react-icons/fi";
import { Link } from "react-router-dom";
import payment from "../../assets/payment.webp";
import {
    FaFacebook,
    FaGoogle,
    FaInstagram,
    FaLinkedinIn,
    FaRegCopyright,
    FaTwitter,
} from "react-icons/fa";
import { currentYear } from "@/utils";
const Footer = () => {
    const year = useMemo(() => currentYear(), []);

    return (
        <div className="w-full px-4 sm:px-8 pt-8 bg-light-blue text-white lg:px-9 xl:px-0 2xl:px-0">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-16 lg:grid-cols-4 lg:gap-1 xl:gap-0">
                    <div className="w-4/5">
                        <h4 className="font-bold text-xl mb-2 uppercase lg:text-base">
                            about us
                        </h4>
                        <p className="mb-4 leading-7 lg:leading-7 lg:text-base">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Corrupti deleniti cupiditate a.
                        </p>
                        <div className="flex items-start gap-2">
                            <FiPhoneCall className="text-4xl lg:text-3xl" />
                            <div className="flex flex-col gap-1">
                                <h6 className="uppercase text-base">
                                    need help?
                                </h6>
                                <p className="font-semibold text-2xl lg:text-xl">
                                    0123456789
                                </p>
                                <p className="font-semibold text-2xl lg:text-xl">
                                    0123456789
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-xl mb-2 uppercase lg:text-base">
                            information
                        </h4>
                        <ul className="flex flex-col font-medium gap-2">
                            <li className="hover:ml-1 transition-all ease-in-out duration-300 cursor-pointer">
                                <Link to={'/delivery'}>Delivery</Link>
                            </li>
                            <li className="hover:ml-1 transition-all ease-in-out duration-300 cursor-pointer">
                                <Link to={'/about-us'}>About Us</Link>
                            </li>
                            <li className="hover:ml-1 transition-all ease-in-out duration-300 cursor-pointer">
                                <Link to={'/secure-payment'}>Secure Payment</Link>
                            </li>
                            <li className="hover:ml-1 transition-all ease-in-out duration-300 cursor-pointer">
                                <Link to={'/contact-us'}>Contact Us</Link>
                            </li>
                            <li className="hover:ml-1 transition-all ease-in-out duration-300 cursor-pointer">
                                <Link to={'/sitemap'}>Sitemap</Link>
                            </li>
                            <li className="hover:ml-1 transition-all ease-in-out duration-300 cursor-pointer">
                                <Link to={'/stores'}>Stores</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-xl mb-2 uppercase lg:text-base">
                            custom links
                        </h4>
                        <ul className="flex flex-col font-medium gap-2">
                            <li className="hover:ml-1 transition-all ease-in-out duration-300 cursor-pointer">
                                <Link to={'/legal-notice'}>Legal Notice</Link>
                            </li>
                            <li className="hover:ml-1 transition-all ease-in-out duration-300 cursor-pointer">
                                <Link to={'/prices-drop'}>Prices Drop</Link>
                            </li>
                            <li className="hover:ml-1 transition-all ease-in-out duration-300 cursor-pointer">
                                <Link to={'/category'}>Category's</Link>
                            </li>
                            <li className="hover:ml-1 transition-all ease-in-out duration-300 cursor-pointer">
                                <Link to={'/best-sales'}>Best Sales</Link>
                            </li>
                            <li className="hover:ml-1 transition-all ease-in-out duration-300 cursor-pointer">
                                <Link to={'/login'}>Login</Link>
                            </li>
                            <li className="hover:ml-1 transition-all ease-in-out duration-300 cursor-pointer">
                                <Link to={'/my-account'}>My Account</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-xl mb-2 uppercase lg:text-base">
                            NEWSLETTER
                        </h4>
                        <p className="leading-7">
                            You may unsubscribe at any moment. For that purpose,
                            please find our contact info in the legal notice.
                        </p>
                        <div className="relative w-full mt-2 overflow-hidden">
                            <input
                                type="email"
                                className="block p-3 w-full z-20 bg-light-bgWhite text-black border-none rounded-lg ring-transparent outline-none px-2 font-medium lg:text-base"
                                placeholder="Enter Your Email Here"
                                required
                            />
                            <button
                                type="submit"
                                className="absolute top-0 end-0 p-3 font-medium text-light-textWhite bg-light-textDarkGray dark:bg-dark-bgDark rounded-e-lg"
                            >
                                SIGN UP
                            </button>
                        </div>
                        <div className="w-full my-4 mx-auto">
                            <ul className="flex flex-wrap justify-start gap-3 items-center">
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
                </div>
                <hr />
                <div className="flex flex-col justify-center items-center py-5 md:flex-row">
                    <div className="w-full text-base leading-7 pb-4">
                        <p className="flex justify-center gap-2 items-center md:justify-start"><FaRegCopyright /> {year} <span>Sameer</span> Inspired By <span>Rozer.</span></p>
                    </div>
                    <div className="w-full flex justify-center items-center lg:justify-end md:justify-end">
                        <img
                            className="max-w-7xl object-cover"
                            src={payment}
                            alt="Payment"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
