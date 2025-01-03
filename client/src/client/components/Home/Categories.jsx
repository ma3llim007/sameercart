import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import SectionHeader from "./SectionHeader";

const Categories = ({ categories }) => {
    const swiperRef = useRef(null);
    return (
        <>
            <section className="w-full flex flex-col my-10 relative group">
                <SectionHeader title="Popular Categories" />
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    slidesPerView={2}
                    navigation={true}
                    loop={true}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 10000, disableOnInteraction: false }}
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
                    {categories.map(category => (
                        <SwiperSlide key={category?.id} className="p-2">
                            <div className="bg-light-bgLighterGray dark:bg-dark-bgGray rounded shadow-lg px-4 py-2">
                                <Link to={"/"}>
                                    <img
                                        loading="lazy"
                                        src={category?.imageUrl}
                                        alt={category?.title}
                                        className="w-full h-auto object-cover rounded-lg mb-4 overflow-hidden transition-transform duration-300 ease-in-out transform hover:scale-105"
                                    />
                                </Link>
                                <div className="flex flex-col gap-2">
                                    <h4 className="text-xl font-semibold mb-2">
                                        {category?.title}
                                    </h4>
                                    <ul className="text-base grid gap-2 text-light-textGray dark:text-dark-textLightGray">
                                        {category?.category.map(
                                            (products, index) => (
                                                <Link key={index}>
                                                    {products.name}
                                                </Link>
                                            )
                                        )}
                                    </ul>
                                    <Button className="Primary uppercase">
                                        View All
                                    </Button>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <button
                    className="hidden absolute z-20 text-base mx-5 top-1/2 left-4 transform -translate-y-1/2 bg-light-bgWhite text-light-textDarkGray dark:bg-dark-bgDark dark:text-dark-textWhite p-2 rounded-full shadow group-hover:block"
                    onClick={() => swiperRef.current.slidePrev()}
                >
                    <FaArrowAltCircleLeft />
                </button>

                <button
                    className="hidden absolute z-20 text-base mx-5 top-1/2 right-4 transform -translate-y-1/2 bg-light-bgWhite text-light-textDarkGray dark:bg-dark-bgDark dark:text-dark-textWhite p-2 rounded-full shadow group-hover:block"
                    onClick={() => swiperRef.current.slideNext()}
                >
                    <FaArrowAltCircleRight />
                </button>
            </section>
        </>
    );
};

export default Categories;
