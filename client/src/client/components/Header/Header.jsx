import React, { useState } from "react";
import { FaBars, FaRegHeart } from "react-icons/fa";
import { ModeToggle } from "../ModeToggle";
import { Link, NavLink } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { FaBagShopping } from "react-icons/fa6";
import { BiSolidUserVoice } from "react-icons/bi";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useSticky from "../../hooks/useSticky";
import Logo from "../Logo";
import SideBar from "./SideBar";

const Header = () => {
    const isSticky = useSticky(100);
    const [MobileNavOpen, setMobileNavOpen] = useState(false);
    const handleMobileModel = () => {
        setMobileNavOpen(prev => !prev);
    };
    const cartQty = 1;
    const wishListQty = 1;
    const price = "20.00";
    return (
        <>
            <header className="w-screen flex flex-col text-xs sm:text-sm lg:text-base xl:text-base 2xl:text-base mb-2 shadow select-none bg-light-bgWhite dark:bg-dark-bgDark">
                <div className="w-full">
                    <div className="px-4 sm:px-10 lg:px-12 xl:px-4 2xl:px-4">
                        <div className="w-full flex mt-2 flex-col sm:flex-row sm:gap-5 sm:justify-between sm:items-center">
                            <div className="text-center text-light-textGray dark:text-dark-textLightGray">
                                Welcome you to SameerCart Store!
                            </div>
                            <div className="flex justify-center text-center items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div
                                            className="flex cursor-pointer items-center outline-none"
                                            role="button"
                                            tabIndex="0"
                                        >
                                            Setting <IoIosArrowDown />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="center"
                                        className="border-none bg-light-bgLightGray text-light-textDarkGray dark:bg-dark-deep dark:text-dark-textWhite z-40"
                                        sideOffset={10}
                                    >
                                        <DropdownMenuItem
                                            asChild
                                            className="py-2 px-4 cursor-pointer"
                                        >
                                            <Link to={"/my-account"}>
                                                My Account
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            asChild
                                            className="py-2 px-4 cursor-pointer"
                                        >
                                            <Link to={"/checkout"}>
                                                Checkout
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            asChild
                                            className="py-2 px-4 cursor-pointer"
                                        >
                                            <Link to={"/login"}>Login</Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                |
                                <ModeToggle />
                            </div>
                        </div>
                        <hr className="my-2 opacity-25" />
                        <div className="w-full mt-1">
                            <div className="grid grid-cols-2 justify-stretch lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 items-center">
                                <div className="w-auto justify-self-start">
                                    <Link to={"/"}>
                                        <Logo />
                                    </Link>
                                </div>
                                <div className="w-auto hidden xl:block 2xl:block">
                                    <div className="w-full mx-auto">
                                        <div className="flex">
                                            <div className="relative w-full">
                                                <input
                                                    type="search"
                                                    id="search-dropdown"
                                                    className="block p-1 lg:p-2 xl:p-2 2xl:p-2 w-full z-20 bg-light-bgLighterGray border-none text-light-textGray rounded-lg focus:ring-light-blue focus:border-light-blue dark:bg-dark-bgLightGray dark:border-dark-bgLightGray dark:placeholder-dark-textWhite dark:text-white dark:focus:border-dark-light"
                                                    placeholder="Enter Your Search Key..."
                                                    required
                                                />
                                                <button
                                                    type="submit"
                                                    className="absolute top-0 end-0 p-2.5 font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                >
                                                    <CiSearch className="font-bold text-xl" />
                                                    <span className="sr-only">
                                                        Search
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-auto justify-self-end">
                                    <div className="flex gap-3 items-center">
                                        <div className="hidden items-center gap-2 xl:flex 2xl:flex">
                                            <div className="text-3xl">
                                                <BiSolidUserVoice />
                                            </div>
                                            <div className="pr-2 xl:pr-6 2xl:pr-5">
                                                <p className="text-xs font-normal">
                                                    Call Us:
                                                </p>
                                                <p className="text-base font-bold">
                                                    +91 12345 67890
                                                </p>
                                            </div>
                                        </div>
                                        <div className="items-center gap-2 hidden sm:flex md:flex">
                                            <div className="relative">
                                                <Link to={"/wishlist"}>
                                                    <FaRegHeart className="text-3xl font-extrabold cursor-pointer" />
                                                    <span className="absolute top-4 right-3 inline-flex justify-center items-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                                                        {wishListQty}
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="items-center gap-2 sm:flex md:flex">
                                            <div className="relative">
                                                <Link to={"/cart"}>
                                                    <FaBagShopping className="text-3xl font-extrabold cursor-pointer" />
                                                    <span className="absolute top-4 right-3 inline-flex justify-center items-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                                                        {cartQty}
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                        <p className="text-base xl:text-base font-semibold">
                                            ${price}
                                        </p>
                                        <FaBars
                                            onClick={handleMobileModel}
                                            className="text-2xl ml-1 cursor-pointer font-extrabold xl:hidden 2xl:hidden"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="max-w-7xl md:w-full mx-auto mt-3 xl:hidden 2xl:hidden">
                            <div className="flex">
                                <div className="relative w-full">
                                    <input
                                        type="search"
                                        id="search-dropdown"
                                        className="block p-2.5 w-full z-20 bg-light-bgLighterGray border-none text-light-textGray rounded-lg focus:ring-light-blue focus:border-light-blue dark:bg-dark-bgLightGray dark:border-dark-bgLightGray dark:placeholder-dark-textWhite dark:text-white dark:focus:border-dark-light"
                                        placeholder="Enter Your Search Key..."
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="absolute top-0 end-0 p-2.5 font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        <CiSearch className="font-bold text-xl" />
                                        <span className="sr-only">Search</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`hidden justify-between h-12 px-5 xl:flex 2xl:flex bg-light-blue text-light-bgLighterGray items-center gap-5 w-full z-20 transform transition-all duration-300 ease-in-out ${isSticky ? "fixed bg-light-blue top-0 left-0 shadow-lg opacity-100 translate-y-0 mt-0" : "relative mt-2"} `}
                    >
                        <nav className="w-[85%] mr-5">
                            <ul className="flex gap-5 py-2 font-semibold items-center">
                                <NavLink to={"/"} className="relative group">
                                    Home
                                    <span className="absolute left-0 bottom-0 h-0.5 w-full bg-light-bgWhite transition-all ease-in-out duration-300 scale-x-0 group-hover:scale-x-100"></span>
                                </NavLink>
                                <NavLink
                                    className="relative group"
                                    to={"/about-us"}
                                >
                                    About Us
                                    <span className="absolute left-0 bottom-0 h-0.5 w-full bg-light-bgWhite transition-all ease-in-out duration-300 scale-x-0 group-hover:scale-x-100"></span>
                                </NavLink>
                                <NavLink className="relative group">
                                    Category 1
                                    <span className="absolute left-0 bottom-0 h-0.5 w-full bg-light-bgWhite transition-all ease-in-out duration-300 scale-x-0 group-hover:scale-x-100"></span>
                                </NavLink>
                                <NavLink className="relative group">
                                    Category 2
                                    <span className="absolute left-0 bottom-0 h-0.5 w-full bg-light-bgWhite transition-all ease-in-out duration-300 scale-x-0 group-hover:scale-x-100"></span>
                                </NavLink>
                                <NavLink className="relative group">
                                    Category 3
                                    <span className="absolute left-0 bottom-0 h-0.5 w-full bg-light-bgWhite transition-all ease-in-out duration-300 scale-x-0 group-hover:scale-x-100"></span>
                                </NavLink>
                                <NavLink className="relative group">
                                    Category 4
                                    <span className="absolute left-0 bottom-0 h-0.5 w-full bg-light-bgWhite transition-all ease-in-out duration-300 scale-x-0 group-hover:scale-x-100"></span>
                                </NavLink>
                                <NavLink className="relative group">
                                    Category 5
                                    <span className="absolute left-0 bottom-0 h-0.5 w-full bg-light-bgWhite transition-all ease-in-out duration-300 scale-x-0 group-hover:scale-x-100"></span>
                                </NavLink>
                                <NavLink
                                    className="relative group"
                                    to={"/contact-us"}
                                >
                                    Contact Us
                                    <span className="absolute left-0 bottom-0 h-0.5 w-full bg-light-bgWhite transition-all ease-in-out duration-300 scale-x-0 group-hover:scale-x-100"></span>
                                </NavLink>
                            </ul>
                        </nav>
                        <div className="text-sm w-[15%]">
                            <p>Free Shipping on Orders $50+</p>
                        </div>
                    </div>
                </div>
            </header>
            <SideBar
                cartQty={cartQty}
                wishListQty={wishListQty}
                handleModel={handleMobileModel}
                isOpenModel={MobileNavOpen}
            />
        </>
    );
};

export default Header;
