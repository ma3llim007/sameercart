import Faq from "../Faq";

const faqs = [
    {
        id: 1,
        question: "What should I do if my package is delayed?",
        answer: "If your package is delayed, please check the tracking information provided. If there are no updates for an extended period, contact our customer service for assistance.",
    },
    {
        id: 2,
        question: "Can I change my delivery address after placing an order?",
        answer: "Yes, you can change your delivery address within 24 hours of placing your order. Please contact our support team to assist you with this change.",
    },
    {
        id: 3,
        question: "What if my package is lost?",
        answer: "If your package is lost, please contact our support team immediately. We will initiate an investigation with the carrier to locate your package.",
    },
    {
        id: 4,
        question: "How can I track my order?",
        answer: "You can track your order using the tracking number sent to your email. Alternatively, log into your account to view your order history.",
    },
    {
        id: 5,
        question: "What delivery options are available?",
        answer: "We offer standard, expedited, and same-day delivery options. You can select your preferred delivery method at checkout.",
    },
    {
        id: 6,
        question: "Do you deliver to P.O. boxes?",
        answer: "Yes, we do deliver to P.O. boxes. Please ensure that you provide the correct P.O. box address during checkout.",
    },
];
const FAQsSection = () => {
    return (
        <section className="w-full my-20">
            <div className="w-full text-center">
                <h2 className="text-3xl mb-4 font-bold underline decoration-2">Frequently Asked Questions</h2>
            </div>
            <div className="w-full">
                <Faq lists={faqs} />
            </div>
        </section>
    );
};

export default FAQsSection;
