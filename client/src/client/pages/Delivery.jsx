import { Helmet } from "react-helmet-async";
import bannerImage from "../assets/banner/delivery.webp";
import Banner from "../components/Banner";
import Container from "../components/Container";
import DeliveryPolicies from "../components/Delivery/DeliveryPolicies";
import FAQsSection from "../components/Delivery/FaqSection";
import OrderProcessingTime from "../components/Delivery/OrderProcessingTime";
import ReturnsAndExchanges from "../components/Delivery/ReturnsAndExchanges";
import ShippingMethods from "../components/Delivery/ShippingMethods";

const Delivery = () => {
    return (
        <>
            <Helmet>
                <title>Fast & Reliable Delivery - SameerCart</title>
                <meta name="description" content="Get your orders delivered quickly and safely with SameerCart. Learn about our shipping options, delivery times, and policies." />
                <meta name="keywords" content="delivery, shipping, SameerCart delivery, fast shipping, ecommerce delivery, order tracking" />
                <meta property="og:title" content="Fast & Reliable Delivery - SameerCart" />
                <meta property="og:description" content="SameerCart ensures quick and secure delivery for all your orders. Check our shipping details and policies." />
                <meta property="og:url" content="https://sameercart.com/delivery" />
                <meta property="og:type" content="website" />
                <meta name="robots" content="index, follow" />
            </Helmet>
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
