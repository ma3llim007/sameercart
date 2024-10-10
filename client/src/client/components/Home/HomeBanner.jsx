import React from "react";
import img from "../../assets/home/home_banner.webp";

const HomeBanner = () => {
    return (
        <section className="w-full overflow-hidden my-5 rounded-md">
            <img className="w-full h-auto object-cover cursor-pointer hover:scale-105 transition-transform ease-in-out duration-500 transform delay-75" src={img} alt="Image" loading="lazy" />
        </section>
    );
};

export default HomeBanner;
