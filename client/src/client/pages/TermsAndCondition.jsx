import React from "react";
import { Banner, Container } from "../components";
import termsAndcondition from "../assets/banner/terms_and_conditions.webp";
import { Link } from "react-router-dom";

const TermsAndCondition = () => {
    return (
        <>
            <Banner image={termsAndcondition} title={"Terms And Condition"} />
            <Container>
                <section className="w-full mb-5 mt-10 p-4">
                    <h1 className="text-3xl font-bold text-light-blue dark:text-dark-light mb-3">Introduction</h1>
                    <p className="text-lg">
                        Welcome to SameerCart. By accessing and using this website, you agree to comply with and be bound by the following Terms and Conditions. These terms govern your use of the
                        website and services offered by SameerCart located at <Link to={"/"}>http://localhost:5173/</Link>. If you do not agree with any part of these terms, please discontinue using
                        our website.
                    </p>
                </section>
                <section className="w-full mb-5 mt-10 p-4">
                    <h1 className="text-3xl font-bold text-light-blue dark:text-dark-light mb-3">Account Information</h1>
                    <p className="text-lg">
                        To access certain features of our website, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and
                        ensuring the information provided is accurate, complete, and up to date. SameerCart is not liable for any loss or damage arising from your failure to protect your account
                        details.
                    </p>
                </section>
                <section className="w-full mb-5 mt-10 p-4">
                    <h1 className="text-3xl font-bold text-light-blue dark:text-dark-light mb-3">Purchases and Payment Terms</h1>
                    <p className="text-lg">
                        All prices displayed on our website are in Rupee. We reserve the right to modify pricing without prior notice. Payments are due at the time of purchase, and we accept the
                        following payment methods: online/offline. In the event of a stock issue or unforeseen circumstances affecting your order, we will notify you promptly and offer alternative
                        solutions, including the option for a full refund.
                    </p>
                </section>
                <section className="w-full mb-5 mt-10 p-4">
                    <h1 className="text-3xl font-bold text-light-blue dark:text-dark-light mb-3">Shipping and Delivery</h1>
                    <p className="text-lg">
                        Orders are typically processed and shipped within 05 business days of purchase. Delivery times may vary depending on your location. Once an item has been shipped, the risk of
                        loss or damage passes to the buyer. Please ensure that your shipping information is accurate to avoid delays or issues with delivery.
                    </p>
                </section>
                <section className="w-full mb-5 mt-10 p-4">
                    <h1 className="text-3xl font-bold text-light-blue dark:text-dark-light mb-3">Returns and Refunds</h1>
                    <p className="text-lg">
                        We accept returns within 7 days from the date of purchase. Items must be returned in their original condition and packaging. To initiate a return, please contact our customer
                        service team at{" "}
                        <a className="mx-2" href="mailto:mohdsameer68257@gmail.com">
                            mohdsameer68257@gmail.com
                        </a>
                        . Refunds will be processed within 7 business days of receiving the returned item, and the amount will be credited back to your original payment method.
                    </p>
                </section>
                <section className="w-full mb-5 mt-10 p-4">
                    <h1 className="text-3xl font-bold text-light-blue dark:text-dark-light mb-3">User Conduct</h1>
                    <p className="text-lg">
                        You agree to use our website and services responsibly and in compliance with applicable laws. Prohibited activities include, but are not limited to, engaging in fraud,
                        distributing malware, violating intellectual property rights, or using our services for unlawful purposes. Violation of these terms may result in the suspension or termination
                        of your account and legal action.
                    </p>
                </section>
                <section className="w-full mb-5 mt-10 p-4">
                    <h1 className="text-3xl font-bold text-light-blue dark:text-dark-light mb-3">Intellectual Property</h1>
                    <p className="text-lg">
                        All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of SameerCart and is protected under copyright,
                        trademark, and other applicable intellectual property laws. You may not use, reproduce, distribute, or create derivative works from any content on this site without prior
                        written consent.
                    </p>
                </section>
                <section className="w-full mb-5 mt-10 p-4">
                    <h1 className="text-3xl font-bold text-light-blue dark:text-dark-light mb-3">Limitation of Liability</h1>
                    <p className="text-lg">
                        SameerCart strives to ensure the accuracy and reliability of the information provided on this website, but we do not guarantee that all content is error-free or up-to-date. To
                        the fullest extent permitted by law, SameerCart is not liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use our
                        website, services, or products.
                    </p>
                </section>

                <section className="w-full mb-5 mt-10 p-4">
                    <h1 className="text-3xl font-bold text-light-blue dark:text-dark-light mb-3">Privacy Policy</h1>
                    <p className="text-lg">
                        Protecting your privacy is important to us. Any personal information you provide to us will be handled in accordance with our Privacy Policy. We encourage you to read our{" "}
                        <Link to={"/privacy-policy"}>Privacy Policy</Link> to understand how we collect, use, and protect your data.
                    </p>
                </section>
                <section className="w-full mb-5 mt-10 p-4">
                    <h1 className="text-3xl font-bold text-light-blue dark:text-dark-light mb-3">Termination</h1>
                    <p className="text-lg">
                        We reserve the right to terminate or suspend your account and access to our website at our sole discretion, with or without notice, for any reason, including but not limited to
                        violations of these Terms and Conditions. Upon termination, all provisions of these terms which by their nature should survive termination will remain in effect.
                    </p>
                </section>
                <section className="w-full mb-5 mt-10 p-4">
                    <h1 className="text-3xl font-bold text-light-blue dark:text-dark-light mb-3">Governing Law</h1>
                    <p className="text-lg">
                        These Terms and Conditions are governed by and construed in accordance with the laws of India/Telanagana. You agree to submit to the exclusive jurisdiction of the courts
                        located within India/Telanagana to resolve any legal matter arising from these terms.
                    </p>
                </section>
                <section className="w-full mb-5 mt-10 p-4">
                    <h1 className="text-3xl font-bold text-light-blue dark:text-dark-light mb-3">Changes to Terms</h1>
                    <p className="text-lg">
                        SameerCart reserves the right to update or modify these Terms and Conditions at any time without prior notice. Any changes will be effective immediately upon posting on this
                        page. Your continued use of the website constitutes acceptance of any modifications. We encourage you to review this page regularly to stay informed of any changes.
                    </p>
                </section>
            </Container>
        </>
    );
};

export default TermsAndCondition;
