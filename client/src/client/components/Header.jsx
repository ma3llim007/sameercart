import React from "react";
import logo from "../assets/logo.webp";
import { BsBag, BsList } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { ModeToggle } from "./ModeToggle";
const Header = () => {
    return (
        <>
            <header className="flex justify-between">
                {/* Header Section One */}
                <div>
                    <div>
                        <p>Welcome you to SameerCart Store</p>
                    </div>
                    <div>

                    </div>
                </div>
                {/* Header Section Two */}
                {/* Header Section Three */}
                <ModeToggle />
            </header>
        </>
    );
};

export default Header;
