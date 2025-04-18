import { useState } from "react";
import { FaBars, FaRegHeart, FaUserPlus } from "react-icons/fa";
import { ModeToggle } from "../ModeToggle";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { FaBagShopping } from "react-icons/fa6";
import { BiSolidUserVoice } from "react-icons/bi";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useSticky from "../../hooks/useSticky";
import Logo from "../Logo";
import SideBar from "./SideBar";
import { upperCase, upperFirst } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { formatNumberWithCommas } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import { userLogOut } from "@/features/home/userAuthSlice";
import Loader from "../Loader/Loader";
import { storePersistor } from "@/store";
import { IoLogOutOutline, IoPersonCircleOutline } from "react-icons/io5";
import { RiLoginBoxFill } from "react-icons/ri";
import SearchComponent from "./SearchComponent";

const Header = ({ data }) => {
    const { carts, totalCartPrice } = useSelector(state => state.cart);
    const { isAuthenticated, user } = useSelector(state => state.userAuth);
    const navigate = useNavigate();
    const { wishlists } = useSelector(state => state.wishlist);
    const isSticky = useSticky(100);
    const [MobileNavOpen, setMobileNavOpen] = useState(false);
    const dispatch = useDispatch();
    const handleMobileModel = () => {
        setMobileNavOpen(prev => !prev);
    };
    const cartQty = carts?.length || 0;
    const wishListQty = wishlists?.length || 0;
    const price = formatNumberWithCommas(totalCartPrice || 0);
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () => crudService.post("/users/log-out", false),
        onSuccess: data => {
            dispatch(userLogOut());
            toastService.info(data?.message || "Logged out successfully");

            // Ensure storePersistor exists before calling purge()
            if (storePersistor?.purge) {
                storePersistor.purge();
            }

            if (user?._id) {
                queryClient.removeQueries(["userData", user._id]);
            }
            navigate("/login");
        },
        onError: error => {
            toastService.error(error?.response?.data?.message || "Something went wrong while logging out");
        },
    });
    if (isPending) return <Loader />;
    return (
        <>
            <header className="w-full flex flex-col text-xs sm:text-sm lg:text-base xl:text-base 2xl:text-base shadow select-none bg-light-bgWhite dark:bg-dark-bgDark">
                <div className="w-full">
                    <div className="px-4 sm:px-10 lg:px-12 xl:px-4 2xl:px-4">
                        <div className="w-full flex mt-2 flex-col sm:flex-row sm:gap-5 sm:justify-between sm:items-center">
                            <div className="text-center text-light-textGray dark:text-dark-textLightGray">Welcome you to SameerCart Store!</div>
                            <div className="flex justify-center text-center items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="flex gap-1 cursor-pointer items-center outline-none" role="button" tabIndex="0" aria-label="Expand Setting Menu">
                                            Setting <IoIosArrowDown />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="center"
                                        className="border-none bg-light-bgLightGray text-light-textDarkGray dark:bg-dark-deep dark:text-dark-textWhite z-40"
                                        sideOffset={10}
                                    >
                                        {isAuthenticated ? (
                                            <>
                                                <DropdownMenuItem asChild>
                                                    <Link to="/account/dashboard" className="flex items-center gap-2 px-4 py-2 cursor-pointer rounded-md transition-all duration-200">
                                                        <IoPersonCircleOutline className="text-lg" />
                                                        <span className="text-sm font-medium">My Account</span>
                                                    </Link>
                                                </DropdownMenuItem>

                                                <DropdownMenuItem onClick={mutate} className="flex items-center gap-2 px-4 py-2 cursor-pointer rounded-md transition-all duration-200">
                                                    <IoLogOutOutline className="text-lg" />
                                                    <span className="text-sm font-medium">Logout</span>
                                                </DropdownMenuItem>
                                            </>
                                        ) : (
                                            <>
                                                <DropdownMenuItem asChild>
                                                    <Link to="/register" className="flex items-center gap-2 px-4 py-2 cursor-pointer rounded-md transition-all duration-200">
                                                        <FaUserPlus className="text-lg" />
                                                        <span className="text-sm font-medium">Register</span>
                                                    </Link>
                                                </DropdownMenuItem>

                                                <DropdownMenuItem asChild>
                                                    <Link to="/login" className="flex items-center gap-2 px-4 py-2 cursor-pointer rounded-md transition-all duration-200">
                                                        <RiLoginBoxFill className="text-lg" />
                                                        <span className="text-sm font-medium">Login</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                            </>
                                        )}
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
                                    <SearchComponent />
                                </div>
                                <div className="w-auto justify-self-end">
                                    <div className="flex gap-3 items-center">
                                        <div className="hidden items-center gap-2 xl:flex 2xl:flex">
                                            <div className="text-3xl">
                                                <BiSolidUserVoice />
                                            </div>
                                            <div className="pr-2 xl:pr-6 2xl:pr-5">
                                                <p className="text-xs font-normal">Call Us:</p>
                                                <p className="text-base font-bold">+91 12345 67890</p>
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
                                        <p className="text-base xl:text-base font-semibold">$ {price}</p>
                                        <FaBars onClick={handleMobileModel} className="text-2xl ml-1 cursor-pointer font-extrabold lg:hidden xl:hidden 2xl:hidden" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="max-w-7xl md:w-full mx-auto my-3 xl:hidden 2xl:hidden">
                            <SearchComponent topMargin={"mt-2"} />
                        </div>
                    </div>
                    <div
                        className={`hidden justify-between h-12 px-5 py-8 lg:flex bg-light-blue text-light-bgLighterGray items-center gap-5 w-full z-20 transform transition-all duration-300 ease-in-out ${isSticky ? "fixed bg-light-blue top-0 left-0 shadow-lg opacity-100 translate-y-0 mt-0" : "relative mt-2"} `}
                    >
                        <nav className="w-4/5 mr-5 lg:w-full">
                            <ul className="flex gap-5 py-2 font-semibold items-center lg:justify-center xl:justify-start 2xl:justify-start">
                                <li>
                                    <NavLink to={"/"} className="relative group">
                                        Home
                                        <span className="absolute left-0 bottom-0 h-0.5 w-full bg-light-bgWhite transition-all ease-in-out duration-300 scale-x-0 group-hover:scale-x-100"></span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className="relative group" to={"/about-us"}>
                                        About Us
                                        <span className="absolute left-0 bottom-0 h-0.5 w-full bg-light-bgWhite transition-all ease-in-out duration-300 scale-x-0 group-hover:scale-x-100"></span>
                                    </NavLink>
                                </li>
                                <li>
                                    <div className="inline-flex gap-5">
                                        {data?.data.map(category => (
                                            <DropdownMenu key={category._id}>
                                                <div className="flex items-center gap-1">
                                                    <Link
                                                        to={`/sub-category/${category?.categorySlug}`}
                                                        className="flex gap-1 cursor-pointer items-center outline-none"
                                                        role="button"
                                                        tabIndex={0}
                                                        aria-haspopup="true"
                                                        aria-expanded="false"
                                                    >
                                                        {upperFirst(category?.categoryName)}
                                                    </Link>
                                                    <DropdownMenuTrigger asChild>
                                                        <button aria-label="Expand Menu">
                                                            <IoIosArrowDown />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                </div>

                                                <DropdownMenuContent
                                                    align="center"
                                                    className="min-w-[9rem] overflow-hidden p-1 shadow-md border-none divide-light-border dark:divide-dark-border bg-light-blue text-light-textWhite dark:text-dark-textWhite z-40"
                                                    sideOffset={22}
                                                >
                                                    {category?.subcategories.map(subcategory => (
                                                        <DropdownMenuItem asChild className="py-2 px-4 cursor-pointer" key={subcategory?._id}>
                                                            <Link
                                                                to={`${category.categorySlug}/${subcategory?.subCategorySlug}/products`}
                                                                className="px-4 py-2 text-base border-b rounded-none border-opacity-50 border-light-gray"
                                                            >
                                                                {upperCase(subcategory?.subCategoryName)}
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        ))}
                                    </div>
                                </li>
                                <li>
                                    <NavLink className="relative group" to={"/category"}>
                                        Category
                                        <span className="absolute left-0 bottom-0 h-0.5 w-full bg-light-bgWhite transition-all ease-in-out duration-300 scale-x-0 group-hover:scale-x-100"></span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className="relative group" to={"/contact-us"}>
                                        Contact Us
                                        <span className="absolute left-0 bottom-0 h-0.5 w-full bg-light-bgWhite transition-all ease-in-out duration-300 scale-x-0 group-hover:scale-x-100"></span>
                                    </NavLink>
                                </li>
                            </ul>
                        </nav>
                        <div className="text-sm w-[15%] lg:hidden xl:block 2xl:block">
                            <p className="text-center">Free Shipping on Orders $50+</p>
                        </div>
                    </div>
                </div>
            </header>
            <SideBar cartQty={cartQty} wishListQty={wishListQty} handleModel={handleMobileModel} isOpenModel={MobileNavOpen} catgoryAndSubCategory={data.data} />
        </>
    );
};

export default Header;
