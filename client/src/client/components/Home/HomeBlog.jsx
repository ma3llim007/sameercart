import { FaCalendarAlt, FaUser } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import { useMemo } from "react";
import Loader from "../Loader/Loader";
import { capitalizeWords, formatDateTime } from "@/utils";
import { upperFirst } from "lodash";

const HomeBlog = () => {
    // fetch blogs
    const { data, isPending } = useQuery({
        queryKey: ["homeBlogs"],
        queryFn: () => crudService.get("/blog/get-blogs", false),
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            toastService.error(message || "Failed to fetch Data.");
        },
    });

    // Memoize blog data to prevent unnecessary recalculations
    const response = useMemo(() => data?.data || [], [data]);

    if (isPending) return <Loader />;
    return (
        <section className="w-full overflow-hidden my-6 ">
            <div className="w-full text-center mx-auto max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl px-2 py-1">
                <h4 className="uppercase text-base sm:text-xl xl:text-2xl 2xl:text-2xl text-light-blue dark:text-dark-light font-bold leading-relaxed">blog</h4>
                <h3 className="text-base sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-4xl font-bold leading-relaxed">Read Our Latest Blog</h3>
            </div>

            <div className="w-full grid grid-cols-1 justify-items-center items-center py-6 px-3 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
                {response?.blogs?.map(blog => (
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
                                <h4 className="text-base sm:text-xl xl:text-2xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-light-blue dark:text-white">
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
        </section>
    );
};

export default HomeBlog;
