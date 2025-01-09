import {
    Banner,
    CompanyOverview,
    Container,
    OurStory,
    OurValues,
    Team,
    Testimonails,
} from "../components";
import aboutBanner from "../assets/banner/about_us.webp";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

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
