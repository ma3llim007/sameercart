import React from "react";
import { FaCreditCard, FaShippingFast, FaUserAstronaut } from "react-icons/fa";
import { TbTruckReturn } from "react-icons/tb";

const IconSection = () => {
    return (
        <section className="w-full grid grid-cols-1 place-content-start items-center py-6 sm:grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
            <div className="flex gap-4 items-center">
                <FaShippingFast className="font-bold text-5xl" />
                <div className="text-base leading-7 py-2">
                    <p className="font-bold text-xl">Free Shipping</p>
                    <p>On all orders over $75.00</p>
                </div>
            </div>
            <div className="flex gap-4 items-center">
                <TbTruckReturn className="font-bold text-5xl" />
                <div className="text-base leading-7 py-2">
                    <p className="font-bold text-xl">Free Shipping</p>
                    <p>Returns are free within 9 days</p>
                </div>
            </div>
            <div className="flex gap-4 items-center">
                <FaCreditCard className="font-bold text-5xl" />
                <div className="text-base leading-7 py-2">
                    <p className="font-bold text-xl">Support 24/7</p>
                    <p>Contact us 24 hours a day</p>
                </div>
            </div>
            <div className="flex gap-4 items-center">
                <FaUserAstronaut className="font-bold text-5xl" />
                <div className="text-base leading-7 py-2">
                    <p className="font-bold text-xl">100% Payment Secure</p>
                    <p>Your payment are safe with us.</p>
                </div>
            </div>
        </section>
    );
};

export default IconSection;
