import { motion,easeInOut } from "framer-motion";
import React from "react";
import { FaFacebook, FaGoogle, FaInstagram, FaLinkedinIn, FaRegHeart, FaRegUser, FaTwitter } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";

const SideBar = ({ isOpenModel, handleModel, wishListQty, cartQty }) => {
    // Define animation variants
    const sideBarVariants = {
        hidden: {
            x: "100%",
            opacity: 0,
        },
        visiable: {
            x: "0%",
            opacity: 1,
            transition: {
                duration: 0.2,
                ease: easeInOut,
            },
        },
    };
    return (
        <motion.div
            variants={sideBarVariants}
            initial="hidden"
            animate={isOpenModel ? "visiable": "hidden"}
            className="top-0 h-full inset-0 w-full fixed overflow-y-scroll bg-light-bgLighterGray text-light-bgLighterGray dark:bg-dark-bgGray transition-transform ease-in-out duration-300 delay-75 xl:hidden 2xl:hidden">
            <div className="w-full">
                <div className="px-4 sm:px-10 lg:px-12">
                    <div className="flex py-2 justify-end items-center">
                        <IoCloseSharp
                            onClick={handleModel}
                            className="font-bold cursor-pointer text-2xl"
                        />
                    </div>
                </div>
                <hr className="my-2 opacity-25" />
                <nav className="w-full">
                    <ul
                        className="flex flex-col items-center gap-5 p-2 text-xl font-semibold overflow-y-scroll"
                        onClick={handleModel}
                    >
                        <NavLink to={"/"}>Home</NavLink>
                        <NavLink to={"/about-us"}>About Us</NavLink>
                        <NavLink>Category 1</NavLink>
                        <NavLink>Category 2</NavLink>
                        <NavLink>Category 3</NavLink>
                        <NavLink>Category 4</NavLink>
                        <NavLink>Category 5</NavLink>
                        <NavLink to={"/contact-us"}>Contact Us</NavLink>
                    </ul>
                </nav>
                <div className="w-full mt-2 mb-6">
                    <div className="flex justify-center gap-5 items-center">
                        <Link
                            to="/my-account"
                            className="flex items-center"
                            onClick={handleModel}
                        >
                            <FaRegUser className="text-2xl mr-2 font-extrabold cursor-pointer" />
                        </Link>
                        <div className="relative">
                            <Link to="/wishlist" onClick={handleModel}>
                                <FaRegHeart className="text-2xl font-extrabold cursor-pointer" />
                                <span className="absolute top-3 right-3 inline-flex justify-center items-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                                    {wishListQty}
                                </span>
                            </Link>
                        </div>
                        <div className="relative">
                            <Link to="/wishlist" onClick={handleModel}>
                                <FaBagShopping className="text-2xl font-extrabold cursor-pointer" />
                                <span className="absolute top-3 right-3 inline-flex justify-center items-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                                    {cartQty}
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="w-full my-2 mx-auto">
                    <ul className="flex flex-wrap justify-center gap-5 items-center">
                        <li className="bg-light-blue p-2 rounded-full">
                            <a
                                target="_blank"
                                href="#"
                                onClick={handleModel}
                            >
                                <FaFacebook className="font-bold text-xl text-light-textWhite" />
                            </a>
                        </li>
                        <li
                            className="bg-light-blue p-2 rounded-full"
                            onClick={handleModel}
                        >
                            <a
                                target="_blank"
                                href="https://x.com/ma_3llim_007"
                            >
                                <FaTwitter className="font-bold text-xl text-light-textWhite" />
                            </a>
                        </li>
                        <li
                            className="bg-light-blue p-2 rounded-full"
                            onClick={handleModel}
                        >
                            <a
                                target="_blank"
                                href="https://www.instagram.com/ma_3llim_007/"
                            >
                                <FaInstagram className="font-bold text-xl text-light-textWhite" />
                            </a>
                        </li>
                        <li
                            className="bg-light-blue p-2 rounded-full"
                            onClick={handleModel}
                        >
                            <a target="_blank" href="#">
                                <FaGoogle className="font-bold text-xl text-light-textWhite" />
                            </a>
                        </li>
                        <li
                            className="bg-light-blue p-2 rounded-full"
                            onClick={handleModel}
                        >
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
        </motion.div>
    );
};

export default SideBar;
