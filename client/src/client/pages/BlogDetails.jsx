import bannerImage from "../assets/banner/blogs.webp";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Banner from "../components/Banner";
import { Link, useParams } from "react-router-dom";
import { capitalizeWords, formatDateTime, slugToText } from "@/utils";
import Container from "../components/Container";
import { useQuery } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import Loading from "@/admin/components/Loading";
import { useMemo } from "react";
import { FaCalendarAlt, FaUser } from "react-icons/fa";
import DOMPurify from "dompurify";
import reactParser from "html-react-parser";
import { Button } from "@/components/ui/button";
import { upperFirst } from "lodash";

const BlogDetails = () => {
    const { blogSlug } = useParams();

    // Fetching the Blog Detail
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["blogDetails", blogSlug],
        queryFn: () => crudService.get(`blog/view-blog/${blogSlug}`, false),
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            toastService.error(message || "Failed to fetch Data.");
        },
    });

    const blog = useMemo(() => data?.data ?? {}, [data]);
    const {
        data: relatedData,
        isLoading: relatedIsLoading,
        isFetching: relatedIsFetching,
    } = useQuery({
        queryKey: ["blogDetailsRelated", blog?._id],
        queryFn: () => crudService.get(`blog/view-blog/${blog?._id}/related`, false),
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            toastService.error(message || "Failed to fetch Data.");
        },
    });
    if (isLoading || isFetching || relatedIsFetching || relatedIsLoading) return <Loading />;
    return (
        <>
            <Banner title={slugToText(blogSlug)} image={bannerImage}>
                <Breadcrumb>
                    <BreadcrumbList className="text-lg">
                        <BreadcrumbItem>
                            <Link to="/">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Link to="/blogs">Blogs</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{"Blog Detail"}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </Banner>
            <Container>
                <section className="w-full my-10 select-none">
                    <div className="w-full space-y-4">
                        <img className="rounded-lg border-2 dark:border-white border-black shadow-lg" src={blog?.blogDetailImage} alt={capitalizeWords(blog?.blogTitle)} />
                        <h4 className="text-base sm:text-xl xl:text-2xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-light-blue dark:text-dark-light">
                            {capitalizeWords(blog?.blogTitle)}
                        </h4>
                        <div className="flex items-center text-sm sm:text-base">
                            <div className="flex gap-1.5 items-center">
                                <FaUser />
                                By Admin
                            </div>
                            <span className="mx-2">|</span>
                            <div className="flex gap-1.5 items-center">
                                <FaCalendarAlt /> {formatDateTime(blog?.createdAt)}
                            </div>
                        </div>
                        <div className="w-full my-4 prose lg:prose-xl dark:prose-invert max-w-none">{reactParser(DOMPurify.sanitize(blog?.blogDescription))}</div>
                        <hr />
                        {relatedData?.data?.length > 0 ? (
                            <>
                                <div className="w-full text-center mx-auto">
                                    <h1 className="text-3xl md:text-4xl  text-light-deep dark:text-dark-light font-bold underline decoration-4">Related Post</h1>
                                </div>
                                <div className="grid grid-cols-1 justify-items-center items-center py-6 px-3 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
                                    {relatedData?.data?.map(blog => (
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
                                                <div className="flex items-center text-sm sm:text-base">
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
                                                    <Link to={`/blog-detail/${blog?.blogSlug}`} className="self-start mt-auto">
                                                        <Button className="text-base Primary">Read More</Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : null}
                    </div>
                </section>
            </Container>
        </>
    );
};

export default BlogDetails;
