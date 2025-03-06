import aboutBanner from "../assets/banner/about_us.webp";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import Banner from "../components/Banner";
import Container from "../components/Container";
import CompanyOverview from "../components/AboutUs/CompanyOverview";
import OurStory from "../components/AboutUs/OurStory";
import Team from "../components/AboutUs/Team";
import OurValues from "../components/AboutUs/OurValues";
import Testimonails from "../components/AboutUs/Testimonails";
import { Helmet } from "react-helmet-async";

const AboutUs = () => {
    return (
        <>
            <Helmet>
                <title>About Us - SameerCart</title>
                <meta name="description" content="Learn about SameerCart, our mission, and our commitment to providing quality products online." />
                <meta name="keywords" content="SameerCart, about us, ecommerce story, best shopping platform" />
                <meta property="og:title" content="About Us - SameerCart" />
                <meta property="og:description" content="SameerCart is dedicated to bringing you the best shopping experience." />
                <meta property="og:url" content="https://sameercart.com/about-us" />
                <meta name="robots" content="index, follow" />
            </Helmet>
            <Banner image={aboutBanner} title={"About Us"}>
                <Breadcrumb>
                    <BreadcrumbList className="text-lg">
                        <BreadcrumbItem>
                            <Link to="/">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>About Us</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </Banner>
            <Container>
                <CompanyOverview />
                <OurStory />
                <Team />
                <OurValues />
                <Testimonails />
            </Container>
        </>
    );
};

export default AboutUs;
