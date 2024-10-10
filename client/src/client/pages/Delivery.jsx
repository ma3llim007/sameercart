import React from "react";
import { Banner, Container, DeliveryPolicies, OrderProcessingTime, ReturnsAndExchanges, ShippingMethods } from "../components";
import bannerImage from "../assets/banner/delivery.webp";
import FAQsSection from "../components/Delivery/Faq";

const Delivery = () => {
    return (
        <>
            <Banner image={bannerImage} title={"Delivery Information"} />
            <Container>
                <ShippingMethods />
                <OrderProcessingTime />
                <DeliveryPolicies />
                <ReturnsAndExchanges />
                <FAQsSection />
            </Container>
        </>
    );
};

export default Delivery;
