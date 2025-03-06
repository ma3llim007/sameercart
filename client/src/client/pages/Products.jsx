import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link, useParams } from "react-router-dom";
import bannerImage from "../assets/banner/basket_banner.webp";
import { capitalizeWords, formatNumberWithCommas, slugToText } from "@/utils";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import { Button } from "@/components/ui/button";
import Rating from "../components/Rating";
import { upperFirst } from "lodash";
import { FaCartPlus, FaEye, FaHeart, FaRupeeSign } from "react-icons/fa";
import { motion } from "framer-motion";
import Loader from "../components/Loader/Loader";
import { useDispatch } from "react-redux";
import { addToCart } from "@/features/home/cartSlice";
import { addToWishList } from "@/features/home/wishlistSlice";
import Banner from "../components/Banner";
import Container from "../components/Container";
import { Helmet } from "react-helmet-async";

const Products = () => {
    const { categorySlug, subCategorySlug } = useParams();
    const subCategory = subCategorySlug ? slugToText(subCategorySlug) : "Unknown Sub-Category";
    const [page, setPage] = useState(1);
    const limit = 9;
    const dispatch = useDispatch();

    // Fetching Products
    const { data, isLoading } = useQuery({
        queryKey: ["products", subCategorySlug, page, limit],
        queryFn: () => crudService.get(`/products/all-products/?categorySlug=${categorySlug}&subCategorySlug=${subCategorySlug}&page=${page}&limit=${limit}`),
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            toastService.error(message || "Failed to fetch Data.");
        },
        keepPreviousData: true,
        cacheTime: 2 * 60 * 1000, // 2 minutes
    });
    const { products, pageNumber, totalPages } = data?.data || {};

    const handleAddToCart = data => {
        dispatch(addToCart(data));
    };

    if (isLoading) return <Loader />;
    return (
        <>
            <Helmet>
                <title>{subCategorySlug.replace("-", " ")} Products - SameerCart</title>
                <meta name="description" content={`Buy top-quality ${subCategorySlug.replace("-", " ")} products at the best prices on SameerCart. Fast delivery and secure shopping.`} />
                <meta name="keywords" content={`${subCategorySlug}, buy ${subCategorySlug} online, best ${subCategorySlug} products, SameerCart`} />
                <meta property="og:title" content={`${subCategorySlug.replace("-", " ")} Products - SameerCart`} />
                <meta property="og:description" content={`Discover the latest ${subCategorySlug.replace("-", " ")} collection on SameerCart. Shop now!`} />
                <meta property="og:url" content={`https://sameercart.com/${categorySlug}/${subCategorySlug}/products`} />
                <meta property="og:type" content="website" />
                <meta name="robots" content="index, follow" />
            </Helmet>
            <Banner title={"Products"} image={bannerImage}>
                <Breadcrumb>
                    <BreadcrumbList className="text-lg">
                        <BreadcrumbItem>
                            <Link to="/">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Link to="/category">Categorys</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{capitalizeWords(subCategory)}</BreadcrumbPage>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{"Products"}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </Banner>
            {!products?.length > 0 ? (
                <Container>
                    <section className="w-full h-full flex flex-col justify-center items-center leading-10 py-20 px-5 text-center">
                        <h1 className="font-extrabold text-4xl mb-1">Product Are Not Avaiable</h1>
                        <Link to={"/"}>
                            <Button className="Primary btnXl">Back To Home</Button>
                        </Link>
                    </section>
                </Container>
            ) : (
                <Container>
                    <section className="w-full my-5">
                        <div className="w-full text-center mx-auto">
                            <h1 className="text-3xl md:text-4xl  text-light-deep dark:text-dark-light font-bold underline decoration-4">Products</h1>
                        </div>
                        <div className="grid grid-cols-1 justify-items-center items-center py-6 px-3 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
                            {products?.map(product => (
                                <div
                                    key={product?.productSlug}
                                    className="w-full border-2 border-gray-300 rounded-lg bg-light-bgLighterGray dark:bg-dark-bgLightGray hover:border-dark-dark hover:shadow-lg transition-all ease-in duration-300 flex flex-col items-center justify-center px-4 overflow-hidden min-h-[550px] max-h-[550px] space-y-3 group"
                                >
                                    <img
                                        src={product?.productFeatureImage}
                                        loading="lazy"
                                        alt={product.productName}
                                        className="w-4/5 h-60 object-contain rounded group-hover:scale-105 transition-all duration-300 ease-in-out transform"
                                    />
                                    <Link to={`/product-details/${product?.productSlug}`}>
                                        <h2 className="text-lg text-center font-bold text-light-deep dark:text-white line-clamp-1">{capitalizeWords(product.productName)}</h2>
                                    </Link>
                                    <Link to={`/product-details/${product?.productSlug}`} className="py-2">
                                        <p className="text-light-textGray dark:text-dark-textLightGray text-base text-center line-clamp-2">{upperFirst(product?.productShortDescription)}</p>
                                    </Link>
                                    <div>
                                        <Rating size={"text-base"} rating={product?.ratings.averageRating || 3} />
                                    </div>
                                    {product?.productType === "simple" && (
                                        <div className="w-full flex flex-col items-center gap-1 select-none">
                                            <p className="text-xl font-bold flex items-center gap-1">
                                                <FaRupeeSign size={18} />
                                                {formatNumberWithCommas(product?.productDiscountPrice)}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm text-gray-700 line-through flex items-center gap-1 dark:text-gray-300">
                                                    <FaRupeeSign size={14} />
                                                    {formatNumberWithCommas(product?.basePrice)}
                                                </p>
                                                {product?.basePrice > product?.productDiscountPrice && (
                                                    <p className="text-sm font-semibold text-red-900 dark:contrast-200">
                                                        {Math.round(((product?.basePrice - product?.productDiscountPrice) / product?.basePrice) * 100)}% Off
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <motion.div
                                        initial={{ y: 0 }}
                                        whileHover={{ y: -3, opacity: 1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 600,
                                            damping: 15,
                                        }}
                                        className="flex justify-center items-center bg-light-bgLighterGray dark:bg-dark-bgDark p-2 gap-2 rounded-md max-w-max"
                                    >
                                        <Button
                                            disabled={product?.productType === "simple" ? false : true}
                                            onClick={() => {
                                                handleAddToCart({
                                                    id: product?._id,
                                                    name: product?.productName,
                                                    price: product?.productDiscountPrice,
                                                    slug: product?.productSlug,
                                                    quantity: 1,
                                                    image: product?.productFeatureImage,
                                                });
                                            }}
                                            className="text-base Primary"
                                            title="Add To Cart"
                                        >
                                            <FaCartPlus /> Add To Cart
                                        </Button>
                                        <Button
                                            disabled={product?.productType === "simple" ? false : true}
                                            onClick={() => {
                                                dispatch(
                                                    addToWishList({
                                                        id: product?._id,
                                                        name: product?.productName,
                                                        price: product?.productDiscountPrice,
                                                        slug: product?.productSlug,
                                                        image: product?.productFeatureImage,
                                                    })
                                                );
                                            }}
                                            className="text-base Primary"
                                            title="Add To Wishlist"
                                        >
                                            <FaHeart />
                                        </Button>
                                        <Link to={`/product-details/${product?.productSlug}`}>
                                            <Button className="text-base Primary" title="View Product">
                                                <FaEye />
                                            </Button>
                                        </Link>
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                        <div className="w-full flex flex-col items-center gap-6 justify-between mt-6 py-4 border-t border-gray-400">
                            <h3 className="text-center text-lg font-medium">
                                You Are Currently Viewing <strong>Page: {pageNumber}</strong> Out Of <strong>{totalPages}</strong> Pages.
                            </h3>
                            <div className="flex gap-4">
                                <Button onClick={() => setPage(page - 1)} disabled={page === 1} className="btnXl" variant="outline">
                                    Previous
                                </Button>
                                <Button onClick={() => setPage(page + 1)} className="btnXl" variant="outline" disabled={page === totalPages}>
                                    Next
                                </Button>
                            </div>
                        </div>
                    </section>
                </Container>
            )}
        </>
    );
};

export default Products;
