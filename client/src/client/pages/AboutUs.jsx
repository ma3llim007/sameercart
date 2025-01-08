import { Banner, CompanyOverview, Container, OurStory, OurValues, Team, Testimonails } from "../components";
import aboutBanner from "../assets/banner/about_us.webp";

const AboutUs = () => {
    return (
        <>
            <Banner image={aboutBanner} title={"About Us"} />
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
