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
