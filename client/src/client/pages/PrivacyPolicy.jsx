import React from "react";
import { Banner, Container } from "../components";
import privacyPolicyBanner from "../assets/banner/privacy_polics.webp";

const PrivacyPolicy = () => {
    return (
        <>
            <Banner image={privacyPolicyBanner} title={"Privacy Policy"} />
            <Container>
                <section className="w-full my-10">
                    <div className="w-full p-4 space-y-8">
                        <h1 className="text-4xl font-bold text-light-blue dark:text-dark-light mb-6">Privacy Policy</h1>
                        <p className="text-lg mb-6">
                            SameerCart, we is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, disclose, and
                            safeguard your information when you visit our website or make a purchase from us. Please read this policy carefully. If
                            you do not agree with the terms of this Privacy Policy, please do not access the Site.
                        </p>
                        <div className="w-full space-y-2">
                            <h2 className="text-2xl font-bold text-light-blue dark:text-dark-light mb-6">Information We Collect</h2>
                            <p className="text-lg mb-2">We may collect the following types of information:</p>
                            <p>
                                <strong>Personal Information: </strong> This includes any information that can be used to identify you, such as:
                            </p>
                            <ul className="list-disc space-y-2">
                                <li className="ml-6">Your name</li>
                                <li className="ml-6">Email address</li>
                                <li className="ml-6">Phone number</li>
                                <li className="ml-6">Billing address</li>
                                <li className="ml-6">Shipping address</li>
                                <li className="ml-6">Payment information (credit card numbers, etc.)</li>
                            </ul>
                        </div>
                        <div className="w-full space-y-2">
                            <p>
                                <strong>Non-Personal Information: </strong> This includes data that cannot be used to identify you, such as:
                            </p>
                            <ul className="list-disc space-y-2">
                                <li className="ml-6">Browser type</li>
                                <li className="ml-6">IP address</li>
                                <li className="ml-6">Operating system</li>
                                <li className="ml-6">Referring URLs</li>
                                <li className="ml-6">Page views and usage data</li>
                            </ul>
                        </div>
                        <div className="w-full space-y-2">
                            <h2 className="text-2xl font-bold text-light-blue dark:text-dark-light mb-6">How We Use Your Information</h2>
                            <p className="text-lg mb-2">We may use the information we collect for various purposes, including:</p>
                            <ul className="list-disc space-y-2">
                                <li className="ml-6">To process and fulfill your orders.</li>
                                <li className="ml-6">To communicate with you about your account or transactions.</li>
                                <li className="ml-6">To improve our website and services.</li>
                                <li className="ml-6">To personalize your experience.</li>
                                <li className="ml-6">To send you promotional materials or updates (if you have opted in).</li>
                                <li className="ml-6">To analyze website usage and trends.</li>
                            </ul>
                        </div>
                        <div className="w-full space-y-2">
                            <h2 className="text-2xl font-bold text-light-blue dark:text-dark-light mb-6">Sharing Your Information</h2>
                            <p className="text-lg mb-2">
                                We do not sell or rent your personal information to third parties. However, we may share your information in the
                                following situations:
                            </p>
                            <ul className="list-disc space-y-2">
                                <li className="ml-6">
                                    <strong>Service Providers:</strong> We may employ third-party companies and individuals to facilitate our Service
                                    (“Service Providers”), provide the Service on our behalf, perform Service-related services, or assist us in
                                    analyzing how our Service is used. These third parties may have access to your Personal Information only to
                                    perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                                </li>
                                <li className="ml-6">
                                    <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response
                                    to valid requests by public authorities (e.g., a court or government agency).
                                </li>
                                <li className="ml-6">
                                    <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of all or a portion of our
                                    assets, your Personal Information may be transferred as part of that business transaction.
                                </li>
                            </ul>
                        </div>
                        <div className="w-full space-y-2">
                            <h2 className="text-2xl font-bold text-light-blue dark:text-dark-light mb-6">Your Rights</h2>
                            <p className="text-lg mb-2">
                                Depending on your location, you may have the following rights regarding your personal information:
                            </p>
                            <ul className="list-disc space-y-2">
                                <li className="ml-6">The right to access, update, or delete the information we have on you.</li>
                                <li className="ml-6">
                                    The right to withdraw consent at any time where we rely on your consent to process your personal information.
                                </li>
                                <li className="ml-6">The right to object to our processing of your personal information.</li>
                                <li className="ml-6">The right to data portability.</li>
                            </ul>
                            <p className="text-lg mb-2">To exercise these rights, please contact us using the contact information provided below.</p>
                        </div>
                        <div className="w-full space-y-2">
                            <h2 className="text-2xl font-bold text-light-blue dark:text-dark-light mb-6">Security of Your Information</h2>
                            <p className="text-lg mb-2">The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.</p>
                        </div>
                        <div className="w-full space-y-2">
                            <h2 className="text-2xl font-bold text-light-blue dark:text-dark-light mb-6">Links to Other Websites</h2>
                            <p className="text-lg mb-2">Our Site may contain links to third-party websites that are not operated by us. If you click on a third-party link, you will be directed to that third party’s site. We strongly advise you to review the Privacy Policy and terms of service of every site you visit.</p>
                        </div>
                        <div className="w-full space-y-2">
                            <h2 className="text-2xl font-bold text-light-blue dark:text-dark-light mb-6">Children’s Privacy</h2>
                            <p className="text-lg mb-2">Our services are not directed to individuals under the age of 13, and we do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.</p>
                        </div>
                        <div className="w-full space-y-2">
                            <h2 className="text-2xl font-bold text-light-blue dark:text-dark-light mb-6">Changes to This Privacy Policy</h2>
                            <p className="text-lg mb-2">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
                        </div>
                        <div className="w-full space-y-2">
                            <h2 className="text-2xl font-bold text-light-blue dark:text-dark-light mb-6">Contact Us</h2>
                            <p className="text-lg mb-2">If you have any questions about this Privacy Policy, please contact us:</p>
                            <ul className="list-disc">
                                <li className="ml-6"><strong>Email:</strong> mohdsameer68257@gmail.com</li>
                                <li className="ml-6"><strong>Phone:</strong> +91 98851 91161</li>
                                <li className="ml-6"><strong>Address:</strong> Hyderabad, Telangana</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </Container>
        </>
    );
};

export default PrivacyPolicy;
