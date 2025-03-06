import legalNoticeBanner from "../assets/banner/legal_notice.webp";
import { Link } from "react-router-dom";
import Banner from "../components/Banner";
import Container from "../components/Container";
import { Helmet } from "react-helmet-async";

const LegalNotice = () => {
    return (
        <>
            <Helmet>
                <title>Return & Refund Policy - SameerCart</title>
                <meta name="description" content="Learn about SameerCart's return and refund policy. Hassle-free returns and easy refunds for your online shopping." />
                <meta name="keywords" content="return policy, refund policy, SameerCart returns, product exchange, money-back guarantee" />
                <meta property="og:title" content="Return & Refund Policy - SameerCart" />
                <meta property="og:description" content="Need to return a product? Check out SameerCart's easy return and refund policy for hassle-free shopping." />
                <meta property="og:url" content="https://sameercart.com/return-policy" />
                <meta property="og:type" content="website" />
                <meta name="robots" content="index, follow" />
            </Helmet>
            <Banner image={legalNoticeBanner} title={"Legal Notice"} />
            <Container>
                <section className="w-full my-10 p-4">
                    <div className="w-full mb-5">
                        <h1 className="text-3xl text-light-deep font-bold underline underline-offset-2 decoration-2">Company Information</h1>
                    </div>
                    <ul className="space-y-2 text-base">
                        <li>
                            <strong className="text-[17px]">Company Name: </strong> SameerCart
                        </li>
                        <li>
                            <strong className="text-[17px]">Address: </strong> Hyderabad
                        </li>
                        <li>
                            <strong className="text-[17px]">Email: </strong> mohdsameer68257@gmail
                        </li>
                        <li>
                            <strong className="text-[17px]">Phone: </strong> +91 13245 67890
                        </li>
                        <li>
                            <strong className="text-[17px]">VAT Number: </strong> IN123456789
                        </li>
                        <li>
                            <strong className="text-[17px]">Company Registration: </strong> -{" "}
                        </li>
                    </ul>
                </section>
                <section className="w-full my-10 p-4">
                    <div className="w-full mb-5">
                        <h1 className="text-3xl text-light-deep font-bold underline underline-offset-2 decoration-2">Intellectual Property</h1>
                        <p>
                            All content, design, and intellectual property on this website are the exclusive property of SameerCart. Any unauthorized reproduction or use is prohibited. Trademarks,
                            logos, and other proprietary content are the property of their respective owners.
                        </p>
                    </div>
                </section>
                <section className="w-full my-10 p-4">
                    <div className="w-full mb-5">
                        <h1 className="text-3xl text-light-deep font-bold underline underline-offset-2 decoration-2">Liability</h1>
                        <p>
                            SameerCart is not responsible for any damages, direct or indirect, arising from the use of this website, including any inaccuracies or errors in the content. The website
                            may contain links to external websites, for which SameerCart holds no responsibility.
                        </p>
                    </div>
                </section>
                <section className="w-full my-10 p-4">
                    <div className="w-full mb-5">
                        <h1 className="text-3xl text-light-deep font-bold underline underline-offset-2 decoration-2">Privacy Policy</h1>
                        <p>
                            {" "}
                            Please refer to our{" "}
                            <Link className="text-light-link dark:text-dark-link" to={"/privacy-policy"}>
                                Privacy Policy
                            </Link>{" "}
                            for detailed information about how we handle your data and ensure compliance with applicable data protection laws.{" "}
                        </p>
                    </div>
                </section>
                <section className="w-full my-10 p-4">
                    <div className="w-full mb-5">
                        <h1 className="text-3xl text-light-deep font-bold underline underline-offset-2 decoration-2">Contact</h1>
                        <p>
                            If you have any questions or concerns regarding this legal notice, please feel free to contact us at{" "}
                            <a className="text-light-link dark:text-dark-link" href="mailto:mohdsameer68257@gmail.com">
                                mohdsameer68257@gmail.com
                            </a>
                        </p>
                    </div>
                </section>
            </Container>
        </>
    );
};

export default LegalNotice;
