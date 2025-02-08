import { motion, easeInOut } from "framer-motion";
import { FaFacebook, FaGoogle, FaInstagram, FaLinkedinIn, FaPlus, FaRegHeart, FaRegUser, FaTwitter } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";

const SideBar = ({ isOpenModel, handleModel, wishListQty, cartQty, catgoryAndSubCategory }) => {
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
            animate={isOpenModel ? "visiable" : "hidden"}
            className="top-0 h-full z-40 inset-0 w-full fixed overflow-y-scroll bg-light-bgLighterGray text-light-textDarkGray dark:bg-dark-bgGray dark:text-dark-textWhite transition-transform ease-in-out duration-300 delay-75 lg:hidden xl:hidden 2xl:hidden"
        >
            <div className="w-full">
                <div className="px-4 sm:px-10 lg:px-12">
                    <div className="flex py-2 justify-end items-center">
                        <IoCloseSharp onClick={handleModel} className="font-bold cursor-pointer text-2xl" />
                    </div>
                </div>
                <hr className="my-2 opacity-25" />
                <nav className="w-full px-5 mt-10 mb-5">
                    <ul className="flex flex-col items-start gap-5 p-2 text-xl font-semibold overflow-y-scroll">
                        <NavLink onClick={handleModel} to={"/"}>
                            Home
                        </NavLink>
                        <NavLink onClick={handleModel} to={"/about-us"}>
                            About Us
                        </NavLink>
                        <div className="w-full space-y-2">
                            {catgoryAndSubCategory.map(category => (
                                <nav className="group rounded-md" key={category._id}>
                                    <input type="checkbox" id={`toggle-${category?._id}`} className="hidden peer" />
                                    <label htmlFor={`toggle-${category?._id}`} className="flex justify-between items-center py-2 cursor-pointer rounded-md">
                                        <Link onClick={handleModel} to={`/${category?.categorySlug}`}>
                                            {category?.categoryName}
                                        </Link>
                                        <div className="px-2 py-1 text-base">
                                            <FaPlus className="transform peer-checked:rotate-45 transition-transform duration-300" />
                                        </div>
                                    </label>

                                    <ul className="ml-4 mt-2 space-y-1 hidden peer-checked:block transition-all duration-700 ease-in-out transform">
                                        {category?.subcategories.map(subcategory => (
                                            <li key={subcategory?._id} className="py-1">
                                                <Link
                                                    onClick={handleModel}
                                                    to={`/${category.categorySlug}/${subcategory.subCategorySlug}/products`}
                                                    className="block px-3 py-1 underline underline-offset-4"
                                                >
                                                    {subcategory?.subCategoryName}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            ))}
                        </div>
                        <NavLink onClick={handleModel} to={"/category"}>
                            Category
                        </NavLink>
                        <NavLink onClick={handleModel} to={"/contact-us"}>
                            Contact Us
                        </NavLink>
                    </ul>
                </nav>
                <div className="w-full px-5 mb-6">
                    <div className="flex justify-start gap-5 p-2 items-center">
                        <Link to="/account/dashboad" className="flex items-center" onClick={handleModel}>
                            <FaRegUser className="text-2xl mr-2 font-extrabold cursor-pointer" />
                        </Link>
                        <div className="relative">
                            <Link to="/wishlist" onClick={handleModel}>
                                <FaRegHeart className="text-2xl font-extrabold cursor-pointer" />
                                <span className="absolute top-3 right-3 inline-flex justify-center items-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">{wishListQty}</span>
                            </Link>
                        </div>
                        <div className="relative">
                            <Link to="/wishlist" onClick={handleModel}>
                                <FaBagShopping className="text-2xl font-extrabold cursor-pointer" />
                                <span className="absolute top-3 right-3 inline-flex justify-center items-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">{cartQty}</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="w-full px-5 my-2 mx-auto">
                    <ul className="flex flex-wrap justify-start gap-5 items-center">
                        <li className="bg-light-blue p-2 rounded-full">
                            <a target="_blank" href="#" onClick={handleModel}>
                                <FaFacebook className="font-bold text-xl text-light-textWhite" />
                            </a>
                        </li>
                        <li className="bg-light-blue p-2 rounded-full" onClick={handleModel}>
                            <a target="_blank" href="https://x.com/ma_3llim_007">
                                <FaTwitter className="font-bold text-xl text-light-textWhite" />
                            </a>
                        </li>
                        <li className="bg-light-blue p-2 rounded-full" onClick={handleModel}>
                            <a target="_blank" href="https://www.instagram.com/ma_3llim_007/">
                                <FaInstagram className="font-bold text-xl text-light-textWhite" />
                            </a>
                        </li>
                        <li className="bg-light-blue p-2 rounded-full" onClick={handleModel}>
                            <a target="_blank" href="#">
                                <FaGoogle className="font-bold text-xl text-light-textWhite" />
                            </a>
                        </li>
                        <li className="bg-light-blue p-2 rounded-full" onClick={handleModel}>
                            <a target="_blank" href="https://www.linkedin.com/in/mohd-sameer-web/">
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
