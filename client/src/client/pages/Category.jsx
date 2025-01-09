import { Link, useParams } from "react-router-dom";
import { Banner, Container } from "../components";
import { capitalizeWords, slugToText } from "@/utils";
import bannerImage from "../assets/banner/basket_banner.webp";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import Loader from "../components/Loader/Loader";
import { Button } from "@/components/ui/button";

const Category = () => {
    const { categorySlug } = useParams();
    console.log(categorySlug);
    
    const title = categorySlug ? slugToText(categorySlug) : "Unknown Category";
    const [page, setPage] = useState(1);
    const limit = 9;

    // Fetching Category
    const { data, isLoading } = useQuery({
        queryKey: ["category", page, limit],
        queryFn: () =>
            crudService.get(`/category/categories?page=${page}&limit=${limit}`),
        placeholderData: keepPreviousData,
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            toastService.error(message || "Failed to fetch Data.");
        },
    });
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, data?.data?.totalCategories);

    if (isLoading) return <Loader />;

    return (
        <>
            <Banner title={title} image={bannerImage}>
                <Breadcrumb>
                    <BreadcrumbList className="text-lg">
                        <BreadcrumbItem>
                            <Link to="/">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Link to="/all-category">Category</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </Banner>
            <Container>
                <section className="w-full my-10 p-4 gap-8">
                    <div className="w-full text-center mx-auto px-2 my-4">
                        <h3 className="text-base sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-4xl text-light-deep dark:text-dark-light font-bold leading-relaxed underline decoration-4 underline-offset-4">
                            {title} Sub-Category
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 justify-items-center items-center py-6 px-3 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
                        {data?.data?.categories?.map(category => (
                            <div
                                key={category?._id}
                                className="w-full border-2 border-gray-300 rounded-lg bg-light-bgLighterGray dark:bg-dark-bgLightGray hover:border-dark-dark transition-all ease-in duration-300 p-3 flex flex-col items-center justify-center group overflow-hidden"
                            >
                                <img
                                    src={category?.categoryImage}
                                    loading="lazy"
                                    alt={category.categoryName}
                                    className="w-4/5 object-cover rounded group-hover:scale-105 transition-all duration-300 ease-in-out transform"
                                />
                                <Button className="Primary w-4/5 px-5 h-10 text-lg mt-4">
                                    <Link>
                                        {capitalizeWords(category.categoryName)}
                                    </Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 border-t my-2 border-gray-400">
                        <div className="text-base flex flex-col sm:flex-row items-start sm:items-center justify-around">
                            <p>
                                Showing <strong>{start}</strong> to{" "}
                                <strong>{end}</strong> of{" "}
                                <strong>{data?.data?.totalResults}</strong>{" "}
                                results
                            </p>
                            <p>
                                Page <strong>{page}</strong> of{" "}
                                <strong>{data?.data?.totalPages}</strong>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                className="btnXl"
                                variant="outline"
                            >
                                Previous
                            </Button>
                            <Button
                                onClick={() => setPage(page + 1)}
                                className="btnXl"
                                variant="outline"
                                disabled={page === data?.data?.totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </section>
            </Container>
        </>
    );
};

export default Category;
