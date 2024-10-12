import React from "react";

const Header = React.lazy(() => import("./Header/Header"));
const Footer = React.lazy(() => import("./Footer/Footer"));
const Slider = React.lazy(() => import("./Home/Slider"));
const IconSection = React.lazy(() => import("./Home/IconSection"));
const InfoCardSection = React.lazy(() => import("./Home/InfoCardSection"));
const Container = React.lazy(() => import("./Container"));
const Categories = React.lazy(() => import("./Home/Categories"));
const ProductsSection = React.lazy(() => import("./Home/ProductsSection"));
const HomeBanner = React.lazy(() => import("./Home/HomeBanner"));
const HomeBlog = React.lazy(() => import("./Home/HomeBlog"));
const Banner = React.lazy(() => import("./Banner"));
const ShippingMethods = React.lazy(() => import("./Delivery/ShippingMethods"));
const OrderProcessingTime = React.lazy(() => import("./Delivery/OrderProcessingTime"));
const DeliveryPolicies = React.lazy(() => import("./Delivery/DeliveryPolicies"));
const ReturnsAndExchanges = React.lazy(() => import("./Delivery/ReturnsAndExchanges"));
const FAQsSection = React.lazy(() => import("./Delivery/FaqSection"));
const CompanyOverview = React.lazy(() => import("./AboutUs/CompanyOverview"));
const OurStory = React.lazy(() => import("./AboutUs/OurStory"));
const Team = React.lazy(() => import("./AboutUs/Team"));
const OurValues = React.lazy(() => import("./AboutUs/OurValues"));
const Testimonails = React.lazy(() => import("./AboutUs/Testimonails"));
const Faq = React.lazy(() => import("./Faq"));
const GetInTouch = React.lazy(() => import("./Contact/GetInTouch"));
const Map = React.lazy(() => import("./Contact/Map"));

export {
    Header,
    Footer,
    Slider,
    IconSection,
    Container,
    Categories,
    InfoCardSection,
    ProductsSection,
    HomeBanner,
    HomeBlog,
    Banner,
    ShippingMethods,
    OrderProcessingTime,
    DeliveryPolicies,
    ReturnsAndExchanges,
    FAQsSection,
    CompanyOverview,
    OurStory,
    Team,
    OurValues,
    Testimonails,
    Faq,
    GetInTouch,
    Map,
};
