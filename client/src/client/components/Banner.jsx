import { motion } from "framer-motion";
import bannerImage from "../assets/banner/delivery.webp";

const Banner = ({ image = bannerImage, title, children }) => {
    return (
        <section className="w-full h-96 relative select-none">
            <img loading="lazy" className="w-full h-full object-cover" src={image} alt={title || "Banner Image"} />
            <div className="absolute w-full h-full top-0 left-0 right-0 text-white bg-black bg-opacity-50 flex justify-center items-center">
                <motion.div className="container mx-auto text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: "easeInOut" }}>
                    <motion.h1
                        className="text-3xl md:text-4xl font-bold underline decoration-4 underline-offset-4"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.4,
                        }}
                    >
                        {title}
                    </motion.h1>
                    <motion.div
                        className="justify-center items-center hidden md:flex my-2 text-lg"
                        initial={{ y: 60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.6,
                        }}
                    >
                        {children}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Banner;
