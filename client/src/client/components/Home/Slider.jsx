import { Button } from "@/components/ui/button";
import { useCallback, useMemo, useState } from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const Slider = ({ sliderData }) => {
    const sliders = useMemo(() => sliderData, [sliderData]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex(preValue => (preValue + 1) % sliders.length);
    }, [sliders.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex(
            preValue => (preValue - 1 + sliders.length) % sliderData.length
        );
    }, [sliders.length, sliderData.length]);

    return (
        <div className="w-full h-[450px] md:h-[550px] lg:h-[650px] relative overflow-hidden shadow-md">
            <AnimatePresence>
                {sliders.map((slider, index) =>
                    index === currentIndex ? (
                        <motion.div
                            key={slider.id}
                            className="absolute w-full h-full top-0 left-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                        >
                            <div className="relative w-full h-full flex items-center justify-center">
                                <img
                                    src={slider.imageUrl}
                                    alt={`Slider ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute flex flex-col items-center justify-center gap-4 bg-black bg-opacity-50 text-white p-8 h-full w-full">
                                    <motion.h3
                                        className="text-xl italic uppercase font-light"
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            duration: 0.8,
                                            delay: 0.2,
                                        }}
                                    >
                                        {slider.short_title}
                                    </motion.h3>
                                    <motion.h1
                                        className="text-3xl md:text-4xl font-bold"
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            duration: 0.8,
                                            delay: 0.4,
                                        }}
                                    >
                                        {slider.title}
                                    </motion.h1>
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            duration: 0.6,
                                            delay: 0.6,
                                        }}
                                    >
                                        <Link to={slider.achor_link}>
                                            <Button className="Primary mt-4 btnLg">
                                                {slider.achor_title}
                                            </Button>
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    ) : null
                )}
            </AnimatePresence>
            <button
                onClick={prevSlide}
                className="absolute mx-5 top-1/2 left-4 transform -translate-y-1/2 bg-light-bgWhite text-light-textDarkGray dark:bg-dark-bgDark dark:text-dark-textWhite p-2 rounded-full shadow
                "
            >
                <FaArrowAltCircleLeft />
            </button>
            <button
                onClick={nextSlide}
                className="absolute mx-5 top-1/2 right-4 transform -translate-y-1/2 bg-light-bgWhite text-light-textDarkGray dark:bg-dark-bgDark dark:text-dark-textWhite p-2 rounded-full shadow
                "
            >
                <FaArrowAltCircleRight />
            </button>
            <div className="absolute bottom-4 w-full flex justify-center mt-2 py-1">
                {sliderData.map((_, index) => (
                    <span
                        key={index}
                        className={`w-3 h-3 mx-1 rounded-full cursor-pointer ${index === currentIndex ? "bg-blue-600" : "bg-gray-300"}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slider;
