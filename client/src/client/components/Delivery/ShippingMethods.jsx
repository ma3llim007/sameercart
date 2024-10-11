import React from "react";
import { FaTruck, FaShippingFast, FaClock, FaGlobe } from "react-icons/fa";

const shippingCard = [
    { title: "Standard Shipping", description: "Delivery in 5-7 business days", cost: "Free", icon: FaTruck },
    { title: "Express Shipping", description: "Delivery in 2-3 business days", cost: "$10.00", icon: FaShippingFast },
    { title: "Same-Day Delivery", description: "Delivery in a few hours", cost: "$20.00", icon: FaClock },
    { title: "International Shipping", description: "Delivery in 7-14 business days", cost: "$30.00", icon: FaGlobe },
];

const ShippingMethods = () => {
    return (
        <section className="w-full my-20">
            <div className="w-full text-center">
                <h2 className="text-3xl font-bold underline decoration-2">Available Shipping Methods</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 place-content-center items-center gap-4 py-4">
                {shippingCard.map(card => (
                    <div key={card?.title} className="flex flex-col justify-center items-center p-6 space-y-3 group bg-light-gray dark:bg-dark-bgGray rounded-lg hover:cursor-default transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl">
                        <div className="w-12 h-12 shadow-md rounded-full flex justify-center items-center group-hover:bg-light-deep group-hover:dark:bg-dark-deep group-hover:text-light-textWhite transition-colors duration-300 ease-in-out">
                            <card.icon className="text-3xl" />
                        </div>
                        <h3 className="text-lg font-semibold">{card?.title}</h3>
                        <p className="text-sm text-center text-light-textDarkGray dark:text-dark-textWhite">{card?.description}</p>
                        <p className="text-base">
                            <strong>Cost:</strong> {card?.cost}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ShippingMethods;
