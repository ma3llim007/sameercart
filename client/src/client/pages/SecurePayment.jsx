import securePaymentBanner from "../assets/banner/secure_payment.webp";
import { MdOutlineDoubleArrow } from "react-icons/md";
import { FaCcMastercard, FaCcVisa, FaCreditCard, FaGooglePay, FaPaypal } from "react-icons/fa";
import Banner from "../components/Banner";
import Container from "../components/Container";
import Faq from "../components/Faq";
import { Helmet } from "react-helmet-async";

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
            <Helmet>
                <title>Secure Payment Methods - SameerCart</title>
                <meta name="description" content="Shop safely with SameerCart! We offer secure payment options, including credit cards, PayPal, and more. Your transactions are protected." />
                <meta name="keywords" content="secure payment, online payment, safe transactions, credit card, PayPal, SameerCart payments" />
                <meta property="og:title" content="Secure Payment Methods - SameerCart" />
                <meta property="og:description" content="Enjoy secure and reliable payments with SameerCart. We support multiple payment methods to ensure a smooth shopping experience." />
                <meta property="og:url" content="https://sameercart.com/secure-payment" />
                <meta property="og:type" content="website" />
                <meta name="robots" content="index, follow" />
            </Helmet>
            <Banner image={securePaymentBanner} title={"Secure Payment"} />
            <Container>
                <section className="w-full mb-5 mt-10 px-4 py-4">
                    <h1 className="text-3xl font-bold text-light-blue dark:text-dark-light">Secure Payment</h1>
                    <p className="text-lg">
                        At <span className="font-bold">SameerCart</span>, we take your security seriously. Our secure payment systems and industry-leading encryption ensure that your personal
                        information stays safe throughout the transaction process.
                    </p>
                </section>
                <section className="w-full my-5 px-4 py-2">
                    <h1 className="text-3xl font-bold mb-2 text-light-blue dark:text-dark-light">How We Protect Your Data</h1>
                    <ul className="space-y-4 overflow-hidden">
                        <li className="flex items-center gap-2 text-lg">
                            <MdOutlineDoubleArrow className="text-2xl" />
                            <p>
                                <strong className="mr-2">SSL Encryption:</strong>We use Secure Socket Layer (SSL) technology to encrypt your sensitive information, including payment details, ensuring
                                they cannot be intercepted during transmission.
                            </p>
                        </li>
                        <li className="flex items-center gap-2">
                            <MdOutlineDoubleArrow className="text-2xl" />
                            <p>
                                <strong className="mr-2">PCI-DSS Compliance:</strong>We comply with industry standards for the protection of your data. Your credit card information is never stored on
                                our servers.
                            </p>
                        </li>
                        <li className="flex items-center gap-2">
                            <MdOutlineDoubleArrow className="text-2xl" />
                            <p>
                                <strong className="mr-2">Trusted Payment Gateways:</strong>We work with top-tier payment processors like PayPal and Stripe to guarantee secure transactions.
                            </p>
                        </li>
                        <li className="flex items-center gap-2">
                            <MdOutlineDoubleArrow className="text-2xl" />
                            <p>
                                <strong className="mr-2">Fraud Detection:</strong>Our systems automatically monitor and flag suspicious activities, preventing fraud and unauthorized transactions.
                            </p>
                        </li>
                    </ul>
                </section>
                <section className="w-full my-5 px-4 py-2">
                    <h2 className="text-3xl font-bold mb-2 text-light-blue dark:text-dark-light">Accepted Payment Methods</h2>
                    <p className="text-lg mb-3">We offer a wide range of secure payment options:</p>
                    <div className="w-2/4 my-4 flex flex-wrap gap-5 text-4xl ">
                        <FaCreditCard aria-label="Credit Card" />
                        <FaCcVisa aria-label="CC Visa" />
                        <FaCcMastercard aria-label="CC MasterCard" />
                        <FaPaypal aria-label="Pay Pal" />
                        <FaGooglePay aria-label="Google Pay" />
                    </div>
                </section>
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
