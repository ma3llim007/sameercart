import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import themeForest from "../../assets/brands/themeforest.webp";
import activedan from "../../assets/brands/activedan.webp";
import codeCanyon from "../../assets/brands/codecanyon.webp";
import audioJungle from "../../assets/brands/audiojungle.webp";
import graphicRiver from "../../assets/brands/graphicriver.webp";

const brands = [
    { _id: 1, image: themeForest, title: "Theme Forest" },
    { _id: 2, image: activedan, title: "Activedan" },
    { _id: 3, image: codeCanyon, title: "Code Canyon" },
    { _id: 4, image: audioJungle, title: "Audio Jungle" },
    { _id: 5, image: graphicRiver, title: "Graphic River" },
];

const BrandSection = () => {
    const swiperRef = useRef(null);

    return (
        <section className="relative w-full my-10 overflow-hidden group">
            <div className="w-full text-center mx-auto max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl px-2 py-1">
                <h3 className="text-base sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-4xl font-bold leading-relaxed mb-4">Our Brands</h3>
            </div>
            <div className="w-full max-h-fit border dark:border-slate-700 rounded bg-slate-400 dark:bg-slate-950 border-opacity-10">
                <Swiper
                    modules={[Autoplay]}
                    slidesPerView={2}
                    loop={true}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    breakpoints={{
                        640: { slidesPerView: 3 },
                        768: { slidesPerView: 4 },
                        1024: { slidesPerView: 4 },
                    }}
                    onSwiper={swiper => (swiperRef.current = swiper)}
                    className="w-full"
                >
                    {brands.map(brand => (
                        <SwiperSlide key={brand._id} className="p-2 relative">
                            <img
                                loading="lazy"
                                src={brand.image}
                                alt={brand.title}
                                className="w-full object-center overflow-hidden border border-gray-600 dark:border-blue-700 rounded-md transition-all duration-500 ease-in-out transform hover:scale-105 lg:filter lg:grayscale hover:grayscale-0"
                                draggable="false"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default BrandSection;
