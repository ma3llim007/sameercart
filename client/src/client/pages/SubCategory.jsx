import { Link, useParams } from "react-router-dom";
import { capitalizeWords, slugToText } from "@/utils";
import bannerImage from "../assets/banner/basket_banner.webp";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import Loader from "../components/Loader/Loader";
import { Button } from "@/components/ui/button";
import useTopScroll from "../hooks/useTopScroll";
import Banner from "../components/Banner";
import Container from "../components/Container";
import { Helmet } from "react-helmet-async";

const SubCategory = () => {
    const { categorySlug } = useParams();
    const title = categorySlug ? slugToText(categorySlug) : "Unknown Category";
    const [page, setPage] = useState(1);
    const limit = 9;
    useTopScroll(0, [page]);

    // Fetching Category
    const { data, isLoading } = useQuery({
        queryKey: ["subcategorys", categorySlug, page, limit],
        queryFn: () => crudService.get(`/sub-category/subcategories-by-category/${categorySlug}?page=${page}&limit=${limit}`),
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            toastService.error(message || "Failed to fetch Data.");
        },
        keepPreviousData: true,
    });
    const { subCategorys, page: responsePage, totalPages } = data?.data || {};

    if (isLoading) return <Loader />;
    return (
        <>
            <Helmet>
                <title>{categorySlug.replace("-", " ")} - Buy Online | SameerCart</title>
                <meta name="description" content={`Shop the best ${categorySlug.replace("-", " ")} on SameerCart. High-quality products at unbeatable prices.`} />
                <meta name="keywords" content={`${categorySlug}, buy ${categorySlug} online, best ${categorySlug}, SameerCart`} />
                <meta property="og:title" content={`${categorySlug.replace("-", " ")} - Buy Online | SameerCart`} />
                <meta property="og:description" content={`Discover top-rated ${categorySlug.replace("-", " ")} products on SameerCart and shop hassle-free.`} />
                <meta property="og:url" content={`https://sameercart.com/sub-category/${categorySlug}`} />
                <meta property="og:type" content="website" />
                <meta name="robots" content="index, follow" />
            </Helmet>
            <Banner title={title} image={bannerImage}>
                <Breadcrumb>
                    <BreadcrumbList className="text-lg">
                        <BreadcrumbItem>
                            <Link to="/">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Link to="/category">Category</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </Banner>
            <Container>
                <section className="w-full my-5">
                    <div className="w-full text-center mx-auto">
                        <h1 className="text-3xl md:text-4xl  text-light-deep dark:text-dark-light font-bold underline decoration-4">Sub Category</h1>
                    </div>
                    <div className="grid grid-cols-1 justify-items-center items-center py-6 px-3 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
                        {subCategorys?.map(subCategory => (
                            <div
                                key={subCategory?._id}
                                className="w-full border-2 border-gray-300 rounded-lg bg-light-bgLighterGray dark:bg-dark-bgLightGray hover:border-dark-dark transition-all ease-in duration-300 p-3 flex flex-col items-center justify-center group overflow-hidden"
                            >
                                <img
                                    src={subCategory?.subCategoryImage}
                                    loading="lazy"
                                    alt={subCategory.subCategoryName}
                                    className="w-4/5 object-cover rounded group-hover:scale-105 transition-all duration-300 ease-in-out transform"
                                />
                                <h2 className="mt-3 text-xl font-bold underline">{capitalizeWords(subCategory.subCategoryName)}</h2>
                                <Link to={`/${categorySlug}/${subCategory?.subCategorySlug}/products`}>
                                    <Button className="Primary btnXl mt-4">View All Products</Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                    <div className="w-full flex flex-col items-center gap-6 justify-between mt-6 py-4 border-t border-gray-400">
                        <h5 className="text-center text-lg font-medium">
                            You Are Currently Viewing <strong>Page: {responsePage}</strong> Out Of <strong>{totalPages}</strong> Pages.
                        </h5>
                        <div className="flex gap-4">
                            <Button onClick={() => setPage(page - 1)} disabled={page === 1} className="btnXl" variant="outline">
                                Previous
                            </Button>
                            <Button onClick={() => setPage(page + 1)} className="btnXl" variant="outline" disabled={page === totalPages}>
                                Next
                            </Button>
                        </div>
                    </div>
                </section>
            </Container>
        </>
    );
};

export default SubCategory;
