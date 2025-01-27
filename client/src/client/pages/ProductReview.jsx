import { Banner, Container, Rating } from "../components";
import bannerImage from "../assets/banner/basket_banner.webp";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Input, TextArea } from "@/components";
import { Button } from "@/components/ui/button";
import { Loading } from "@/admin/components";
import { FaPlus } from "react-icons/fa";

const ProductReview = () => {
    const [rating, setRating] = useState(0);
    const handleRatingChange = newRating => {
        setRating(newRating);
    };
    const isPending = false;
    return (
        <>
            <Banner title={"Create Review"} image={bannerImage}>
                <Breadcrumb>
                    <BreadcrumbList className="text-lg">
                        <BreadcrumbItem>
                            <Link to="/">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Link to="/">Previous Product</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{"Create Review"}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </Banner>
            <Container>
                <section className="w-4/5 mx-auto my-10">
                    <h1 className="text-2xl lg:text-3xl font-bold my-2">
                        Create Review
                    </h1>
                    <div className="flex flex-col gap-4 justify-center items-center flex-wrap md:flex-row md:justify-start my-5">
                        <div className="w-20 h-20 lg:w-36 lg:h-36">
                            <img
                                src="https://m.media-amazon.com/images/I/31IgULr1cEL._SR240,240_.jpg"
                                alt="Product Image"
                                className="w-full h-auto object-cover rounded"
                            />
                        </div>
                        <h2 className="text-xl font-semibold">Product Name</h2>
                    </div>
                    <hr className="my-4 border-gray-400 dark:border-gray-700" />
                    <form className="space-y-5">
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">
                                Overall Rating
                            </h2>
                            <Rating
                                rating={rating}
                                onRatingChange={handleRatingChange}
                                size={"text-3xl"}
                            />
                        </div>
                        <hr className="my-4 border-gray-400 dark:border-gray-700" />
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">
                                Add a headline
                            </h2>
                            <div className="w-full">
                                <Input
                                    placeholder="What's most important to know?"
                                    // {...register("categorySlug")}
                                    // disabled={isPending}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    // error={errors.categorySlug?.message}
                                />
                            </div>
                        </div>
                        <hr className="my-4 border-gray-400 dark:border-gray-700" />
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">
                                Add a written review
                            </h2>
                            <div className="w-full">
                                <TextArea
                                    placeholder="What did you like or dislike? What did you use the product for?"
                                    // error={
                                    //     errors.productShortDescription
                                    //         ?.message
                                    // }
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                    rows={4}
                                    // {...register(
                                    //     "productShortDescription"
                                    // )}
                                />
                                <p className="my-2">
                                    We will notify you via email as soon as your
                                    review is processed.
                                </p>
                            </div>
                        </div>
                        <div className="w-full border-t">
                            <Button
                                disabled={isPending}
                                className="Primary mt-4 btnXl"
                            >
                                {isPending ? (
                                    <Loading height="7" weight="7" />
                                ) : (
                                    <>
                                        <FaPlus /> Add
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </section>
            </Container>
        </>
    );
};

export default ProductReview;
