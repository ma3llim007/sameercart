import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Faq = ({ lists }) => {
    return (
        <>
            {lists.map(list => (
                <Accordion key={list?.id} type="single" collapsible className="border-none my-5 rounded-md shadow-lg transition-all duration-300 ease-in-out">
                    <AccordionItem key={list?.id} value={`item-${list?.id}`} className="border-b last:border-b-0">
                        <AccordionTrigger className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white p-4 text-lg font-semibold uppercase rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
                            {list?.title || list?.question}
                        </AccordionTrigger>
                        <AccordionContent className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 px-4 py-4 text-base rounded-b-md">
                            {list?.description || list?.answer}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            ))}
        </>
    );
};

export default Faq;
