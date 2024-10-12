import React from "react";
import { Banner, Container, GetInTouch, Map } from "../components";
import contactBanner from "../assets/banner/contact_us.webp";

const ContactUs = () => {
    return (
        <>
            <Banner image={contactBanner} title={"Contact Us"} />
            <Container>
                <GetInTouch />
                <Map />
            </Container>
        </>
    );
};

export default ContactUs;
