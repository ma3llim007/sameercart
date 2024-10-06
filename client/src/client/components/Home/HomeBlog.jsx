import React from "react";
import { blogs } from "@/client/data/blogs";
import blogImage from "../../assets/blog.webp";
import { FaUser } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const HomeBlog = () => {
    return (
        <section className="w-full overflow-hidden py-6 ">
            <div className="w-full text-center mx-auto max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl px-2 py-1">
                <h4 className="uppercase text-base sm:text-xl xl:text-2xl 2xl:text-2xl text-light-blue dark:text-dark-light font-bold leading-relaxed">blog</h4>
                <h3 className="text-base sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-4xl font-bold leading-relaxed">Read Our Latest Blog</h3>
            </div>

            <div className="w-full grid grid-cols-1 justify-items-center items-center py-6 px-3 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
                {blogs.map(blog => (
                    <div
                        key={blog.id}
                        className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl rounded-lg overflow-hidden bg-light-bgLighterGray dark:bg-dark-bgGray cursor-pointer px-2 py-1 group"
                    >
                        <img
                            className="w-full h-48 object-cover shadow-sm rounded-lg group-hover:scale-105 transition-all duration-300 ease-in-out transform"
                            src={blogImage}
                            alt={blog.title}
                        />
                        <div className="flex flex-col p-2">
                            <h4 className="text-lg sm:text-xl xl:text-2xl mb-2 font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-light-blue dark:text-dark-light">
                                {blog.title}
                            </h4>
                            <div className="flex items-center text-sm sm:text-base mb-3 ">
                                <div className="flex gap-1.5 items-center">
                                    <FaUser />
                                    {blog.author}
                                </div>
                                <span className="mx-2">|</span>
                                <div className="flex gap-1.5 items-center">
                                    <CiCalendarDate /> {blog.date}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-light-textGray dark:text-dark-textWhite text-sm sm:text-base leading-relaxed mb-4">
                                    {blog.content.length > 100
                                        ? `${blog.content.substring(0, 100)}`
                                        : blog.content}
                                </p>
                                <Link to={"/"} className="self-start mt-auto">
                                    <Button
                                        className="text-base"
                                        variant="primary2"
                                    >
                                        Read More
                                    </Button>
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
