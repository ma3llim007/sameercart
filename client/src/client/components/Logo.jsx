import React from "react";
import logo from "../assets/Logo.svg";
const Logo = () => {
    return (
        <div>
            <img
                className="w-3/4 lg:w-10/12 xl:w-full 2xl:w-full max-w-[180px] object-cover"
                src={logo} loading="lazy"
                alt="Logo"
            />
        </div>
    );
};

export default Logo;
