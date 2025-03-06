import { useState } from "react";
import useTopScroll from "../hooks/useTopScroll";
import { useQuery } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import Loader from "../components/Loader/Loader";
import Banner from "../components/Banner";
import bannerImage from "../assets/banner/blogs.webp";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import { capitalizeWords, formatDateTime } from "@/utils";
import { FaCalendarAlt, FaUser } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { upperFirst } from "lodash";
import { Helmet } from "react-helmet-async";

const Blogs = () => {
    const [page, setPage] = useState(1);
    const limit = 9;
    useTopScroll(0, [page]);

    // Fetching the Blogs
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["blogs", page, limit],
        queryFn: () => crudService.get(`blog/get-blogs?page=${page}&limit=${limit}`, false),
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            toastService.error(message || "Failed to fetch Data.");
        },
        keepPreviousData: true,
    });

    const { blogs, page: responsePage, totalPages } = data?.data || {};

    if (isLoading || isFetching) return <Loader />;
    return (
        <>
            <Helmet>
                <title>Latest Blogs & Shopping Tips - SameerCart</title>
                <meta name="description" content="Read our latest blogs and shopping guides to make smarter purchases on SameerCart." />
                <meta name="robots" content="index, follow" />
            </Helmet>
            <Banner title={"Blogs"} image={bannerImage}>
                <Breadcrumb>
                    <BreadcrumbList className="text-lg">
                        <BreadcrumbItem>
                            <Link to="/">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{"Blogs"}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </Banner>
            <Container>
                <section className="w-full my-5">
                    <div className="w-full text-center mx-auto">
                        <h1 className="text-3xl md:text-4xl  text-light-deep dark:text-dark-light font-bold underline decoration-4">Blogs</h1>
                    </div>
                    <div className="grid grid-cols-1 justify-items-center items-center py-6 px-3 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
                        {blogs?.map(blog => (
                            <div
                                key={blog._id}
                                className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl rounded-lg overflow-hidden bg-light-bgLighterGray dark:bg-dark-bgGray cursor-pointer px-2 py-1 group"
                            >
                                <img
                                    className="w-full h-48 object-cover shadow-sm rounded-lg group-hover:scale-105 transition-all duration-300 ease-in-out transform"
                                    src={blog?.blogFeatureImage}
                                    alt={blog.blogTitle}
                                />
                                <div className="flex flex-col gap-5 p-2">
                                    <Link to={`/blog-detail/${blog?.blogSlug}`}>
                                        <h4 className="text-base sm:text-xl xl:text-2xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-light-blue dark:text-dark-light">
                                            {capitalizeWords(blog?.blogTitle)}
                                        </h4>
                                    </Link>
                                    <div className="flex items-center text-sm sm:text-base flex-wrap gap-2">
                                        <div className="flex gap-1.5 items-center">
                                            <FaUser />
                                            By Admin
                                        </div>
                                        <span className="mx-2">|</span>
                                        <div className="flex gap-1.5 items-center">
                                            <FaCalendarAlt /> {formatDateTime(blog?.createdAt)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <p className="text-light-textGray dark:text-dark-textWhite text-base leading-relaxed line-clamp-2">{upperFirst(blog?.blogShortDescription)}</p>
                                        <Link to={`/blog-detail/${blog?.blogSlug}`} className="self-start mt-auto" aria-label={`Read More About ${blog?.blogTitle}`}>
                                            <span className="sr-only">Read More About {blog?.blogTitle}</span>
                                            <Button className="text-base Primary">Read More</Button>
                                        </Link>
                                    </div>
                                </div>
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

export default Blogs;
