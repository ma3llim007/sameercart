import React from "react";
import returnPolicyBanner from "../assets/banner/return_policy.webp";
import { Banner, Container } from "../components";

const ReturnPolicy = () => {
    return (
        <>
            <Banner title={"Return Policy"} image={returnPolicyBanner} />
            <Container>
                <section className="w-full my-10">
                    <div className="w-full p-4 space-y-8">
                        <h1 className="text-4xl font-bold text-light-blue dark:text-dark-light mb-6">Return Policy</h1>
                        <p className="text-lg mb-6">
                            At <strong>SameerCart</strong>, we want to ensure you are completely satisfied with your purchase. If you are not fully happy with your product, you can return or exchange
                            it under the following conditions.
                        </p>
                        <div>
                            <h2 className="text-2xl font-semibold text-light-blue dark:text-dark-light mb-4">Eligibility for Returns</h2>
                            <ul className="list-disc list-inside mb-6">
                                <li>
                                    Items must be returned within <strong>30 days</strong> of receiving the product.
                                </li>
                                <li>
                                    The item must be <strong>unused</strong>, <strong>unworn</strong>, and in the <strong>original packaging</strong>.
                                </li>
                                <li>Proof of purchase, such as a receipt or order confirmation, is required for all returns.</li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-light-blue dark:text-dark-light mb-4">Non-Returnable Items</h2>
                            <p className="text-lg mb-4">Certain items cannot be returned, including:</p>
                            <ul className="list-disc list-inside mb-6">
                                <li>Personalized or custom-made items.</li>
                                <li>Perishable goods (e.g., food, flowers).</li>
                                <li>Digital products and gift cards.</li>
                                <li>Items marked as "Final Sale" at the time of purchase.</li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-light-blue dark:text-dark-light mb-4">How to Initiate a Return</h2>
                            <p className="text-lg mb-4">To start a return, please follow these steps:</p>
                            <ol className="list-decimal list-inside mb-6">
                                <li>
                                    <strong>Contact our Customer Service Team</strong>: Email us at
                                    <a href="mailto:mohdsameer68257@gmail.com" className="text-light-blue dark:text-dark-light hover:underline mx-2">
                                        mohdsameer68257@gmail.com
                                    </a>
                                    or call
                                    <a href="tel:+9885191161" className="text-light-blue dark:text-dark-light hover:underline mx-2">
                                        +91 98851 91161
                                    </a>
                                    to receive your return authorization.
                                </li>
                                <li>
                                    <strong>Prepare Your Item</strong>: Ensure that the item is securely packaged in its original packaging, along with all tags and accessories.
                                </li>
                                <li>
                                    <strong>Ship the Item</strong>: Use the return label provided by our team, or ship to the following address at your own cost:
                                    <address className="mt-2 ml-4">
                                        <span className="block">Hyderabad, Telanagana, 500005,</span>
                                        <span className="block">India.</span>
                                    </address>
                                </li>
                            </ol>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-light-blue dark:text-dark-light mb-4">Refunds</h2>
                            <p className="text-lg mb-6">
                                Once your return is received and inspected, we will send you an email to notify you of the approval or rejection of your refund. Approved refunds will be processed and
                                applied to your original method of payment within
                                <strong>7-10 business days</strong>.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-light-blue dark:text-dark-light mb-4">Exchanges</h2>
                            <p className="text-lg mb-6">
                                If you wish to exchange an item, please contact our customer service to arrange an exchange for a different size, color, or product. Exchanges are subject to stock
                                availability.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-light-blue dark:text-dark-light mb-4">Damaged or Defective Items</h2>
                            <p className="text-lg mb-6">
                                If you receive a defective or damaged item, please notify us immediately at
                                <a href="mailto:mohdsameer68257@gmail.com" className="text-light-blue dark:text-dark-light hover:underline mx-2">
                                    mohdsameer68257@gmail.com
                                </a>
                                with details and images of the issue. We will provide instructions on how to proceed, and in most cases, we will cover the return shipping cost.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-light-blue dark:text-dark-light mb-4">Return Shipping Costs</h2>
                            <ul className="list-disc list-inside mb-6">
                                <li>
                                    <strong>Customers are responsible</strong> for return shipping costs unless the item is defective or incorrect.
                                </li>
                                <li>
                                    For exchanges, return shipping for the new item will be <strong>free</strong>.
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-light-blue dark:text-dark-light mb-4">International Returns</h2>
                            <p className="text-lg mb-6">For international returns, shipping fees are non-refundable, and customers are responsible for any customs or import duties incurred.</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-light-blue dark:text-dark-light mb-4">Contact Us</h2>
                            <p className="text-lg mb-6">If you have any questions or need further assistance with your return, please contact us:</p>
                            <ul className="list-disc list-inside">
                                <li>
                                    <strong className="mr-2">Email:</strong>
                                    <a href="mailto:mohdsameer68257@gmail.com" className="text-light-blue dark:text-dark-light hover:underline">
                                        mohdsameer68257@gmail.com
                                    </a>
                                </li>
                                <li>
                                    <strong className="mr-2">Phone:</strong>
                                    <a href="tel:+919885191161" className="text-light-blue dark:text-dark-light hover:underline">
                                        +91 98851 91161
                                    </a>
                                </li>
                                <li>
                                    <strong className="mr-2">Business Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </Container>
        </>
    );
};

export default ReturnPolicy;
