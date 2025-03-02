import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DOMPurify from "dompurify";
import reactParser from "html-react-parser";
import ReviewCard from "./ReviewCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toastService from "@/services/toastService";
import crudService from "@/api/crudService";
import { useMemo } from "react";
import Loader from "../Loader/Loader";

const ProductDetailsTabSection = ({ productDescription, productSpecification, productId }) => {
    const purifyProductDescription = DOMPurify.sanitize(productDescription);
    const purifyProductSpecification = DOMPurify.sanitize(productSpecification);

    // Fetching Products
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["productReview", productId],
        queryFn: () => crudService.get(`/products/get-review/${productId}`),
        cacheTime: 2 * 60 * 1000,
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            toastService.error(message || "Failed to fetch Data.");
        },
    });

    const reviewData = useMemo(() => data?.data || {}, [data]);
    if (isLoading || isFetching) return <Loader />;
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
                        <div className="w-full lg:max-w-xs space-y-3 lg:order-1">
                            <div className="w-full border border-gray-300 order-2 dark:border-gray-700 px-4 py-2 rounded space-y-3">
                                <h5 className="text-xl lg:text-2xl font-bold">Review this product</h5>
                                <p className="text-base !mb-4">Share your thoughts with other customers</p>
                                <Link to={`/account/create-review/${productId}`} className="my-4">
                                    <Button className="w-full" variant="outline">
                                        Write a Product Review
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        {reviewData?.length ? (
                            <div className="border border-gray-300 dark:border-gray-700 px-4 py-4 rounded flex flex-col gap-6 flex-grow order-1 lg:order-2">
                                <h5 className="text-xl lg:text-2xl text-center font-bold underline">View Reviews</h5>
                                {reviewData.map((review, idx) => (
                                    <ReviewCard
                                        key={idx}
                                        rating={review?.rating}
                                        userName={`${review?.user?.firstName} ${review?.user?.lastName}`}
                                        reviewHeading={review?.title}
                                        reviewText={review?.comment}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="border border-gray-300 dark:border-gray-700 px-4 py-4 rounded flex flex-col gap-6 flex-grow order-1 lg:order-2 justify-center items-center">
                                <h5 className="text-xl lg:text-2xl text-center font-bold underline">Reviews Are Not Uploaded or Available</h5>
                            </div>
                        )}
                    </TabsContent>
                </div>
            </Tabs>
        </>
    );
};

export default ProductDetailsTabSection;
