import contactBanner from "../assets/banner/contact_us.webp";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import Banner from "../components/Banner";
import Container from "../components/Container";
import GetInTouch from "../components/Contact/GetInTouch";
import Map from "../components/Contact/Map";

const ContactUs = () => {
    return (
        <>
            <Banner image={contactBanner} title={"Contact Us"}>
                <Breadcrumb>
                    <BreadcrumbList className="text-lg">
                        <BreadcrumbItem>
                            <Link to="/">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Contact Us</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </Banner>
            <Container>
                <GetInTouch />
                <Map />
            </Container>
        </>
    );
};

export default ContactUs;
