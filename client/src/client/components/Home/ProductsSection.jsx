import { productsData } from "@/client/data/products";
import { Button } from "@/components/ui/button";
import React, { useMemo, useRef } from "react";
import {
    FaArrowAltCircleLeft,
    FaArrowAltCircleRight,
    FaHeart,
    FaCartPlus
} from "react-icons/fa";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Rating from "../Rating";
import { MdCompareArrows } from "react-icons/md";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

const ProductsSection = ({title="Featured Products"}) => {
    const products = useMemo(() => productsData.slice(0, 10), []);
    const swiperRef = useRef(null);
    return (
        <section className="w-full flex flex-col my-10 relative">
            <SectionHeader title={title}/>
            <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView={2}
                navigation={true}
                loop={true}
                pagination={{ clickable: true }}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                    1280: {
                        slidesPerView: 4,
                    },
                }}
                onBeforeInit={swiper => {
                    swiperRef.current = swiper;
                }}
                className="w-full"
            >
                {products.map(product => (
                    <SwiperSlide key={product?.id} className="p-2">
                        <div className="bg-light-bgLighterGray dark:bg-dark-bgGray rounded cursor-pointer shadow-lg px-4 py-2 group overflow-hidden">
                            <div className="relative">
                                <img
                                    loading="lazy"
                                    src={product?.product_image}
                                    alt={product?.product_title}
                                    className="w-full h-auto object-cover rounded-lg mb-4 overflow-hidden transition-transform duration-300 ease-in-out transform hover:scale-105"
                                />
                                <span className="absolute text-white top-1 left-1 bg-light-blue px-1 leading-5 capitalize font-bold rounded-md text-[12px]">
                                    New
                                </span>
                            </div>
                            <div className="flex flex-col gap-3">
                                <h3 className="text-xl font-semibold mb-2 whitespace-nowrap truncate text-light-blue dark:text-dark-light">
                                    {product?.product_title}
                                </h3>
                                <h4 className="text-light-textGray dark:text-dark-textWhite text-base dark:opacity-60">
                                    {product?.product_short_description}
                                </h4>
                                <Rating
                                    size={"text-base"}
                                    rating={product?.product_star}
                                />
                                <p className="font-bold text-lg leading-6">
                                    ${product?.product_price}
                                </p>
                            </div>
                            <div className="relative flex justify-center">
                                <motion.div
                                    initial={{ y: 0 }}
                                    whileHover={{ y: -3, opacity: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 600,
                                        damping: 15,
                                    }}
                                    className="hidden group-hover:flex flex-wrap justify-center items-center absolute bottom-0 left-0 bg-light-bgLighterGray dark:bg-dark-bgDark p-2 rounded-md gap-4 max-w-max"
                                >
                                    <Button className="text-base Primary">
                                        <FaCartPlus />
                                    </Button>
                                    <Button className="text-base Primary">
                                        <FaHeart />
                                    </Button>
                                    <Button className="text-base Primary">
                                        <MdCompareArrows />
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <button
                className="absolute z-20 text-base mx-5 top-1/2 left-4 transform -translate-y-1/2 bg-light-bgWhite text-light-textDarkGray dark:bg-dark-bgDark dark:text-dark-textWhite p-2 rounded-full shadow"
                onClick={() => swiperRef.current.slidePrev()}
            >
                <FaArrowAltCircleLeft />
            </button>

            <button
                className="absolute z-20 text-base mx-5 top-1/2 right-4 transform -translate-y-1/2 bg-light-bgWhite text-light-textDarkGray dark:bg-dark-bgDark dark:text-dark-textWhite p-2 rounded-full shadow"
                onClick={() => swiperRef.current.slideNext()}
            >
                <FaArrowAltCircleRight />
            </button>
        </section>
    );
};

export default ProductsSection;
