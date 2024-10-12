import React from "react";
import { Banner, Container, Faq } from "../components";
import securePaymentBanner from "../assets/banner/secure_payment.webp";
import { MdOutlineDoubleArrow } from "react-icons/md";
import { FaCcMastercard, FaCcVisa, FaCreditCard, FaGooglePay, FaPaypal } from "react-icons/fa";

const faqs = [
    {
        id: 1,
        question: "Is my payment information safe?",
        answer: "Yes, your payment information is encrypted and processed securely. We do not store credit card details. ",
    },
    {
        id: 2,
        question: "What payment methods do you accept?",
        answer: "We accept Visa, MasterCard, American Express, PayPal, and several other payment methods.",
    },
    {
        id: 3,
        question: "What if my payment is declined?",
        answer: "Please double-check your card information or contact your bank. You may also try another payment option. ",
    },
];

const SecurePayment = () => {
    return (
        <>
            <Banner image={securePaymentBanner} title={"Secure Payment"} />
            <Container>
                <section className="w-full mb-5 mt-10 px-4 py-4">
                    <h1 className="text-3xl font-bold text-light-blue dark:text-dark-textWhite">Secure Payment</h1>
                    <p className="text-lg">
                        At <span className="font-bold">SameerCart</span>, we take your security seriously. Our secure payment systems and
                        industry-leading encryption ensure that your personal information stays safe throughout the transaction process.
                    </p>
                </section>
                <hr />
                <section className="w-full my-5 px-4 py-2">
                    <h1 className="text-3xl font-bold mb-2 text-light-blue dark:text-dark-textWhite">How We Protect Your Data</h1>
                    <ul className="space-y-4 overflow-hidden">
                        <li className="flex items-center gap-2 text-lg">
                            <MdOutlineDoubleArrow className="text-2xl" />
                            <p>
                                <strong className="mr-2">SSL Encryption:</strong>We use Secure Socket Layer (SSL) technology to encrypt your sensitive
                                information, including payment details, ensuring they cannot be intercepted during transmission.
                            </p>
                        </li>
                        <li className="flex items-center gap-2">
                            <MdOutlineDoubleArrow className="text-2xl" />
                            <p>
                                <strong className="mr-2">PCI-DSS Compliance:</strong>We comply with industry standards for the protection of your
                                data. Your credit card information is never stored on our servers.
                            </p>
                        </li>
                        <li className="flex items-center gap-2">
                            <MdOutlineDoubleArrow className="text-2xl" />
                            <p>
                                <strong className="mr-2">Trusted Payment Gateways:</strong>We work with top-tier payment processors like PayPal and
                                Stripe to guarantee secure transactions.
                            </p>
                        </li>
                        <li className="flex items-center gap-2">
                            <MdOutlineDoubleArrow className="text-2xl" />
                            <p>
                                <strong className="mr-2">Fraud Detection:</strong>Our systems automatically monitor and flag suspicious activities,
                                preventing fraud and unauthorized transactions.
                            </p>
                        </li>
                    </ul>
                </section>
                <hr />
                <section className="w-full my-5 px-4 py-2">
                    <h1 className="text-3xl font-bold mb-2 text-light-blue dark:text-dark-textWhite">Accepted Payment Methods</h1>
                    <p className="text-lg mb-3">We offer a wide range of secure payment options:</p>
                    <div className="w-2/4 my-4 flex flex-wrap gap-5 text-4xl ">
                        <FaCreditCard />
                        <FaCcVisa />
                        <FaCcMastercard />
                        <FaPaypal />
                        <FaGooglePay />
                    </div>
                </section>
                <hr />
                <section className="w-full my-20">
                    <div className="w-full text-center">
                        <h2 className="text-3xl mb-4 font-bold underline decoration-2">Frequently Asked Questions</h2>
                    </div>
                    <div className="w-full">
                        <Faq lists={faqs} />
                    </div>
                </section>
            </Container>
        </>
    );
};

export default SecurePayment;
