import React from "react";
import { FaBox, FaCheck, FaCogs, FaTruck } from "react-icons/fa";

const OrderProcessCardList = [
    { icon: FaCheck, title: "Order Received", description: "Your order has been successfully placed and received by our system." },
    { icon: FaCogs, title: "Processing", description: "Your order is being prepared and packed for shipment." },
    { icon: FaTruck, title: "Dispatched", description: "Your order has been dispatched and is on its way to you." },
    { icon: FaBox, title: "Delivered", description: "Your order has been delivered to the specified address." },
];

const OrderProcessingTime = () => {
    return (
        <section className="w-full my-20">
            <div className="w-full text-center">
                <h2 className="text-3xl font-bold underline decoration-2">Our Order Processing Stages</h2>
            </div>
            <div className="flex flex-col items-center justify-center flex-wrap lg:flex-row">
                {OrderProcessCardList.map((card, index) => (
                    <React.Fragment key={card?.title}>
                        <div key={card.title} className="relative max-w-[250px] xl:max-w-[300px] 2xl:max-w-[280px] p-5 text-center mx-4 items-center">
                            <card.icon className="inline-flex text-5xl text-light-blue dark:text-dark-light mb-4" />
                            <h2 className="text-xl mb-3 font-bold">{card?.title}</h2>
                            <p className="text-base leading-6">{card?.description}</p>
                        </div>
                        {index < OrderProcessCardList.length - 1 && <div className="w-1 h-12 bg-light-deep my-4 lg:w-12 lg:h-1"></div>}
                    </React.Fragment>
                ))}
            </div>
        </section>
    );
};

export default OrderProcessingTime;
