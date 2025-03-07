import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import SectionHeader from "./SectionHeader";
import { upperFirst } from "lodash";

const Categories = ({ categories }) => {
    const swiperRef = useRef(null);
    return (
        <>
            <section className="w-full flex flex-col my-10 relative group">
                <SectionHeader title="Popular Categories" />
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    slidesPerView={1}
                    navigation={true}
                    loop={true}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 8000, disableOnInteraction: false }}
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
                    {categories?.data.map(category => (
                        <SwiperSlide key={category?._id} className="w-full p-1">
                            <div className="bg-light-bgLighterGray dark:bg-dark-bgGray rounded-lg shadow-lg px-4 pt-2 pb-4">
                                <Link to={"/"}>
                                    <img
                                        loading="lazy"
                                        src={category?.categoryImage}
                                        alt={category?.categoryName}
                                        className="w-full h-auto object-cover rounded-lg mb-4 overflow-hidden transition-transform duration-300 ease-in-out transform hover:scale-105 pointer-events-none"
                                        draggable="false"
                                    />
                                </Link>
                                <div className="flex flex-col gap-2">
                                    <Link to={`/sub-category/${category.categorySlug}`}>
                                        <h3 className="text-xl text-center font-bold mb-3 cursor-pointer no-underline hover:underline transition-all duration-300 delay-300 ease-in-out decoration-2">
                                            {upperFirst(category?.categoryName)}
                                        </h3>
                                    </Link>
                                    <ul className="text-base grid gap-2 text-light-textGray dark:text-dark-textLightGray">
                                        {category?.subcategories.map(subcategories => (
                                            <li key={subcategories._id} className="w-full flex justify-center">
                                                <Link
                                                    to={`/${category.categorySlug}/${subcategories.subCategorySlug}/products`}
                                                    className="text-base my-1 font-semibold no-underline hover:underline transition-all duration-300 delay-300 ease-in-out decoration-2"
                                                >
                                                    {upperFirst(subcategories.subCategoryName)}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link to={`/sub-category/${category.categorySlug}`}>
                                        <Button className="Primary uppercase w-full">View All</Button>
                                    </Link>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <button
                    className="hidden absolute z-20 text-base mx-5 top-1/2 left-4 transform -translate-y-1/2 bg-light-bgWhite text-light-textDarkGray dark:bg-dark-bgDark dark:text-dark-textWhite p-2 rounded-full shadow group-hover:block"
                    onClick={() => swiperRef.current.slidePrev()}
                    aria-label="Go Back"
                >
                    <FaArrowAltCircleLeft />
                </button>

                <button
                    className="hidden absolute z-20 text-base mx-5 top-1/2 right-4 transform -translate-y-1/2 bg-light-bgWhite text-light-textDarkGray dark:bg-dark-bgDark dark:text-dark-textWhite p-2 rounded-full shadow group-hover:block"
                    onClick={() => swiperRef.current.slideNext()}
                    aria-label="Go Next"
                >
                    <FaArrowAltCircleRight />
                </button>
            </section>
        </>
    );
};

export default Categories;
