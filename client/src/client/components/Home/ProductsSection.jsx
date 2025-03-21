import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight, FaEye } from "react-icons/fa";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Rating from "../Rating";
import SectionHeader from "./SectionHeader";
import { Link } from "react-router-dom";
import { capitalizeWords } from "@/utils";

const ProductsSection = ({ title = "Featured Products", productData }) => {
    const swiperRef = useRef(null);

    return (
        <section className="w-full flex flex-col my-10 relative">
            <SectionHeader title={title} />
            <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView={1}
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
                        slidesPerView: 3,
                    },
                }}
                onBeforeInit={swiper => {
                    swiperRef.current = swiper;
                }}
                className="w-full"
            >
                {productData?.map(product => (
                    <SwiperSlide key={product?._id} className="p-3">
                        <div className="group flex flex-col items-center justify-center min-h-[520px] max-h-[520px] space-y-4 rounded-lg bg-light-bgLighterGray dark:bg-dark-bgGray cursor-pointer shadow-lg px-4 py-4 overflow-hidden transition-all">
                            <div className="relative w-full">
                                <img
                                    loading="lazy"
                                    src={product?.productFeatureImage}
                                    alt={product?.productName}
                                    className="w-full h-72 object-contain rounded-lg overflow-hidden transition-transform duration-300 ease-in-out transform group-hover:scale-105"
                                    draggable="false"
                                />
                                <span className="absolute top-1 left-1 px-2 py-1 text-xs font-bold text-white bg-light-blue rounded-md">New</span>
                            </div>
                            <div className="flex flex-col gap-4 w-full">
                                <Link to={`/product-details/${product?.productSlug}`}>
                                    <h3 className="text-xl font-semibold mb-2 truncate text-light-blue dark:text-white">{capitalizeWords(product?.productName)}</h3>
                                </Link>
                                <p className="text-light-textGray dark:text-dark-textWhite text-base dark:opacity-60 line-clamp-2">{capitalizeWords(product?.productShortDescription)}</p>
                                <Rating size={"text-base"} rating={product?.ratings.averageRating || 3} />
                                <Link to={`/product-details/${product?.productSlug}`}>
                                    <Button className="Primary btnXl">
                                        <FaEye />
                                        View Product
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <button
                className="absolute z-10 text-base mx-5 top-1/2 left-4 transform -translate-y-1/2 bg-light-bgWhite text-light-textDarkGray dark:bg-dark-bgDark dark:text-dark-textWhite p-2 rounded-full shadow"
                onClick={() => swiperRef.current.slidePrev()}
                aria-label="Go Back"
            >
                <FaArrowAltCircleLeft />
            </button>

            <button
                className="absolute z-10 text-base mx-5 top-1/2 right-4 transform -translate-y-1/2 bg-light-bgWhite text-light-textDarkGray dark:bg-dark-bgDark dark:text-dark-textWhite p-2 rounded-full shadow"
                onClick={() => swiperRef.current.slideNext()}
                aria-label="Go Next"
            >
                <FaArrowAltCircleRight />
            </button>
        </section>
    );
};

export default ProductsSection;
