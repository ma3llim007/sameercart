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

const AboutUs = () => {
    return (
        <>
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
