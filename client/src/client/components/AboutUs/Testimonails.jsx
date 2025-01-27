import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import image1 from "../../assets/testimonails/boyAvatar.webp";
import image2 from "../../assets/testimonails/boy2Avatar.webp";
import image3 from "../../assets/testimonails/ladyAvatar.webp";

const TestimonailsData = [
    {
        id: 1,
        image: image1,
        name: "John Doe",
        location: "New York, USA",
        message: "This product changed my life! Excellent service and support.",
    },
    {
        id: 2,
        image: image2,
        name: "Jane Smith",
        location: "London, UK",
        message: "Amazing experience! Highly recommend to everyone.",
    },
    {
        id: 3,
        image: image3,
        name: "Alice Johnson",
        location: "Sophia",
        message: "The best investment I've made this year. Simply outstanding!",
    },
    {
        id: 4,
        image: image3,
        name: "Isabella",
        location: "Toronto, Canada",
        message:
            "Exceptional quality and fantastic customer service. Would buy again!",
    },
];

const Testimonails = () => {
    return (
        <section className="w-full my-20">
            <div className="w-full text-center">
                <h2 className="text-4xl font-bold underline decoration-2 mb-5">
                    Testimonails
                </h2>
            </div>
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                slidesPerView={2}
                navigation={true}
                loop={true}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
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
                className="w-full"
            >
                {TestimonailsData.map(testimonail => (
                    <SwiperSlide key={testimonail?.id} className="p-2">
                        <div className="bg-light-bgLighterGray dark:bg-dark-bgGray rounded-lg cursor-pointer shadow-lg px-4 py-2 group overflow-hidden flex flex-col items-center">
                            <div className="w-2/4">
                                <img
                                    className="w-full h-auto rounded-full object-cover"
                                    src={testimonail?.image}
                                    alt={testimonail?.name}
                                />
                            </div>
                            <div className="flex flex-col space-y-2 justify-center items-center my-2">
                                <h4 className="text-2xl font-bold">
                                    {testimonail?.name}
                                </h4>
                                <p className="text-light-textGray dark:text-dark-textLightGray">
                                    {testimonail?.location}
                                </p>
                                <div className="w-4/5 mx-auto text-center">
                                    <p>{testimonail?.message}</p>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default Testimonails;
