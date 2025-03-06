import { Suspense, useEffect } from "react";
import toastService from "@/services/toastService";
import crudService from "@/api/crudService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { slugTransform } from "@/utils";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";
import Loader from "@/client/components/Loader/Loader";
import { editBlogScheme } from "@/validation/admin/blogScheme";
import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import LoadingOverlay from "@/components/LoadingOverlay";
import Input from "@/components/Form/Input";
import TextArea from "@/components/Form/TextArea";
import RichTextEditor from "@/components/Form/RichTextEditor";
import { Helmet } from "react-helmet-async";

const EditBlog = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { blogId } = useParams();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        control,
        setError,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(editBlogScheme),
    });

    const {
        data,
        isPending: blogIsPending,
        isSuccess,
    } = useQuery({
        queryKey: ["blog", blogId],
        queryFn: () => crudService.get(`blog/blog/${blogId}`, true),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
    });

    useEffect(() => {
        if (data?.data && isSuccess) {
            const { blogTitle, blogSlug, blogShortDescription, blogDescription } = data?.data || {};
            setValue("blogTitle", blogTitle);
            setValue("blogSlug", blogSlug);
            setValue("blogShortDescription", blogShortDescription);
            setValue("blogDescription", blogDescription);
        }
    }, [isSuccess, data, setValue]);

    // Updating the slug value on title change
    useEffect(() => {
        const updateSlug = (name, value) => {
            if (name === "blogTitle") {
                const transformedSlug = slugTransform(value.blogTitle || "");
                setValue("blogSlug", transformedSlug, { shouldValidate: true });
            }
        };

        const subscription = watch((value, { name }) => {
            updateSlug(name, value);
        });

        return () => subscription.unsubscribe();
    }, [watch, setValue]);

    const { mutate, isPending } = useMutation({
        mutationFn: data => {
            const formData = new FormData();
            formData.append("blogTitle", data?.blogTitle);
            formData.append("blogSlug", data?.blogSlug);
            formData.append("blogShortDescription", data?.blogShortDescription);
            formData.append("blogDescription", data?.blogDescription);
            if (data?.blogFeatureImage) {
                formData.append("blogFeatureImage", data?.blogFeatureImage);
            }
            if (data?.blogDetailImage) {
                formData.append("blogDetailImage", data?.blogDetailImage);
            }
            formData.append("blogId", blogId);

            return crudService.patch("blog/edit-blog", true, formData, "multipart/form-data");
        },
        onSuccess: data => {
            navigate("/admin/blogs/blog-list");
            queryClient.invalidateQueries("blogList");
            toastService.success(data?.message);
        },
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            setError("root", { message });
        },
    });

    if (blogIsPending) return <Loader />;
    if (isPending) return <LoadingOverlay />;

    return (
        <>
            <Helmet>
                <title>Edit Blog Post | sameerCart</title>
                <meta name="description" content="Modify and update an existing blog post in sameerCart admin panel. Manage SEO and content optimization." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <PageHeader title={"Manage Blogs"} controller={"Blog Listing"} controllerUrl={"/admin/blogs/add-blog/"} page={"Edit Blog"} />
            <section className="w-full">
                <div className="my-4 w-full container mx-auto border-t-4 border-blue-700 rounded-lg p-2 bg-gray-100 dark:bg-slate-800">
                    <form className="space-y-5" onSubmit={handleSubmit(data => mutate(data))} encType="multipart/form-data">
                        <h1 className="text-xl font-bold my-4 px-2">Edit Blog</h1>
                        {errors.root && (
                            <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                                <h4 className="text-white font-bold text-sm">{errors.root.message}</h4>
                            </div>
                        )}
                        <div className="flex flex-wrap my-2 gap-4 md:gap-0">
                            <div className="w-full px-2">
                                <Input
                                    label="Blog Title"
                                    placeholder="Enter The Blog Title"
                                    {...register("blogTitle")}
                                    disabled={isPending}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    error={errors.blogTitle?.message}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap my-2 gap-4 md:gap-0">
                            <div className="w-full px-2">
                                <Input
                                    label="Blog Slug"
                                    placeholder="View The Blog Slug"
                                    {...register("blogSlug")}
                                    disabled={isPending}
                                    onPaste={e => e.preventDefault()}
                                    onCopy={e => e.preventDefault()}
                                    readOnly
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    error={errors.blogSlug?.message}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap my-2 gap-4 md:gap-0">
                            <div className="w-full md:w-1/2 px-2 gap-4 md:gap-0">
                                <Controller
                                    control={control}
                                    name="blogFeatureImage"
                                    render={({ field }) => (
                                        <Input
                                            label="Blog Feature Image"
                                            title="Select The Blog Feature Image"
                                            additionalTitle="Note:- [For Best View Of Blog Feature Image Width:350px, Height:250px]"
                                            type="file"
                                            disabled={isPending}
                                            accept=".jpg, .jpeg, .png, .gif, .svg, .webp"
                                            onChange={e => field.onChange(e.target.files[0])}
                                            className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            error={errors.blogFeatureImage?.message}
                                        />
                                    )}
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-2 gap-4 md:gap-0">
                                <div className="w-full">
                                    <label className="inline-block mb-2 pl-1 text-base font-bold">Blog Feature Image</label>
                                    <img src={data?.data?.blogFeatureImage} className="max-w-60 max-h-60 object-cover rounded" alt="Blog Feature Image" />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap my-2 gap-4 md:gap-0">
                            <div className="w-full md:w-1/2 px-2 gap-4 md:gap-0">
                                <Controller
                                    control={control}
                                    name="blogDetailImage"
                                    render={({ field }) => (
                                        <Input
                                            label="Blog Detail Image"
                                            title="Select The Blog Detail Image"
                                            type="file"
                                            disabled={isPending}
                                            accept=".jpg, .jpeg, .png, .gif, .svg, .webp"
                                            onChange={e => field.onChange(e.target.files[0])}
                                            className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            error={errors.blogDetailImage?.message}
                                        />
                                    )}
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-2 gap-4 md:gap-0">
                                <div className="w-full">
                                    <label className="inline-block mb-2 pl-1 text-base font-bold">Blog Details Image</label>
                                    <img src={data?.data?.blogDetailImage} className="max-w-60 max-h-60 object-cover rounded" alt="Blog Feature Image" />
                                </div>
                            </div>
                        </div>
                        <div className="w-full px-2">
                            <TextArea
                                name="blogShortDescription"
                                label="Blog Short Description"
                                placeholder="Enter The Blog Short Description"
                                error={errors.blogShortDescription?.message}
                                className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                rows={2}
                                {...register("blogShortDescription")}
                                disabled={isPending}
                            />
                        </div>
                        <div className="w-full px-2">
                            <Suspense fallback={<Loader />}>
                                <RichTextEditor
                                    name="blogDescription"
                                    label="Blog Description"
                                    control={control}
                                    placeholder="Enter The Product Description"
                                    {...register("blogDescription")}
                                    error={errors.blogDescription?.message}
                                    className="text-xl rounded-sm focus:ring-2 focus:ring-blue-800"
                                />
                            </Suspense>
                        </div>
                        <div className="w-full border-t !mt-6">
                            <Button disabled={isPending} className="Primary my-2 btnXl">
                                {isPending ? (
                                    <Loading height="7" weight="7" />
                                ) : (
                                    <>
                                        <FaEdit /> Update
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default EditBlog;
