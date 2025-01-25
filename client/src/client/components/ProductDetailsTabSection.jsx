import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DOMPurify from "dompurify";
import reactParser from "html-react-parser";

const ProductDetailsTabSection = ({
    productDescription,
    productSpecification,
}) => {
    const purifyProductDescription = DOMPurify.sanitize(productDescription);
    const purifyProductSpecification = DOMPurify.sanitize(productSpecification);
    return (
        <>
            <Tabs
                defaultValue="description"
                className="w-full py-4 px-2 border"
            >
                <TabsList className="w-full text-center flex justify-center">
                    <TabsTrigger
                        className="p-4 pb-2 text-sm sm:text-base md:text-xl font-semibold transition duration-200 ease-in-out border-b-4 mb-2 border-transparent focus:outline-none data-[state=active]:border-blue-700 data-[state=inactive]:border-transparent rounded-none"
                        value="description"
                    >
                        Description
                    </TabsTrigger>
                    <TabsTrigger
                        className="p-4 pb-2 text-sm sm:text-base md:text-xl font-semibold transition duration-200 ease-in-out border-b-4 mb-2 border-transparent focus:outline-none data-[state=active]:border-blue-700 data-[state=inactive]:border-transparent rounded-none"
                        value="productDetails"
                    >
                        Product Details
                    </TabsTrigger>
                    <TabsTrigger
                        className="p-4 pb-2 text-sm sm:text-base md:text-xl font-semibold transition duration-200 ease-in-out border-b-4 mb-2 border-transparent focus:outline-none data-[state=active]:border-blue-700 data-[state=inactive]:border-transparent rounded-none"
                        value="reviews"
                    >
                        Reviews
                    </TabsTrigger>
                </TabsList>
                <hr className="decoration-2 my-5" />
                <div className="w-full px-4">
                    <TabsContent
                        value="description"
                        className="prose lg:prose-xl prose-invert w-full max-w-none"
                    >
                        {reactParser(purifyProductDescription)}
                    </TabsContent>
                    <TabsContent
                        value="productDetails"
                        className="prose lg:prose-xl prose-invert w-full max-w-none"
                    >
                        {reactParser(purifyProductSpecification)}
                    </TabsContent>
                    <TabsContent value="reviews">reviews</TabsContent>
                </div>
            </Tabs>
        </>
    );
};

export default ProductDetailsTabSection;
