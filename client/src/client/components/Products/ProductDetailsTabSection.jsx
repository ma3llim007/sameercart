import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DOMPurify from "dompurify";
import reactParser from "html-react-parser";
import reviews from "@/client/data/review";
import ReviewCard from "./ReviewCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ProductDetailsTabSection = ({ productDescription, productSpecification, productId }) => {
    const purifyProductDescription = DOMPurify.sanitize(productDescription);
    const purifyProductSpecification = DOMPurify.sanitize(productSpecification);

    return (
        <>
            <Tabs defaultValue="description" className="w-full py-4 px-2">
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
                    <TabsContent value="description" className="prose lg:prose-xl dark:prose-invert w-full max-w-none">
                        {reactParser(purifyProductDescription)}
                    </TabsContent>
                    <TabsContent value="productDetails" className="prose lg:prose-xl dark:prose-invert w-full max-w-none">
                        {reactParser(purifyProductSpecification)}
                    </TabsContent>
                    <TabsContent value="reviews" className="flex flex-wrap gap-4 lg:flex-nowrap">
                        <div className="w-full space-y-3 lg:order-1">
                            <div className="w-full border border-gray-300 order-2 dark:border-gray-700 px-4 py-2 rounded space-y-3">
                                <h5 className="text-xl lg:text-2xl font-bold">Review this product</h5>
                                <p className="text-base !mb-4">Share your thoughts with other customers</p>
                                <Link to={`/create-review/${productId}`} className="my-4">
                                    <Button className="w-full" variant="outline">
                                        Write a Product Review
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="border border-gray-300 dark:border-gray-700 px-4 py-4 rounded flex flex-col gap-6 flex-grow order-1 lg:order-2">
                            <h5 className="text-xl lg:text-2xl text-center font-bold underline">View Reviews</h5>
                            {reviews.map((review, idx) => (
                                <ReviewCard key={idx} userImage={review?.userImage} rating={review?.rating} userName={review?.userName} reviewText={review?.reviewText} />
                            ))}
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </>
    );
};

export default ProductDetailsTabSection;
