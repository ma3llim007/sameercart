import React from "react";
import { Banner, Container, DeliveryPolicies, FAQsSection, OrderProcessingTime, ReturnsAndExchanges, ShippingMethods } from "../components";
import bannerImage from "../assets/banner/delivery.webp";

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
