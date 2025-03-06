import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import bannerImage from "../assets/banner/basket_banner.webp";
import Banner from "../components/Banner";
import { Link, useNavigate, useParams } from "react-router-dom";
import Container from "../components/Container";
import Rating from "../components/Rating";
import { Button } from "@/components/ui/button";
import Loading from "@/admin/components/Loading";
import { FaPlus } from "react-icons/fa6";
import { useCallback, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import Loader from "../components/Loader/Loader";
import { capitalizeWords } from "@/utils";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productReview } from "@/validation/UserScheme";
import Input from "@/components/Form/Input";
import TextArea from "@/components/Form/TextArea";
import { Helmet } from "react-helmet-async";

const ProductReview = () => {
    const { productId } = useParams();
    const [rating, setRating] = useState(0);
    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
        reset,
        setError,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(productReview),
    });
    const navigate = useNavigate();

    const handleRatingChange = useCallback(
        newRating => {
            setRating(newRating);
            setValue("rating", newRating, { shouldValidate: true });
        },
        [setRating, setValue]
    );

    const { data, isLoading } = useQuery({
        queryKey: ["productReview", productId],
        queryFn: () => crudService.get(`/products/get-product/${productId}`, false),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
        enabled: !!productId,
        cacheTime: 2 * 60 * 1000,
    });

    const { mutate, isPending } = useMutation({
        mutationFn: data => {
            const updateData = { productId, ...data };
            return crudService.post(`/products/add-review`, false, updateData);
        },
        onSuccess: data => {
            toastService.success(data?.message || "Review Added Successfully. Thank You");
            navigate(-1);
        },
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            reset();
            setError("root", { message });
        },
    });

    if (isLoading || isPending) return <Loader />;

    return (
        <>
            <Helmet>
                <title>Product Reviews - SameerCart</title>
                <meta name="description" content="Read reviews and share your experience with products on SameerCart." />
                <meta name="robots" content="index, follow" />
            </Helmet>
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
                    <h1 className="text-2xl lg:text-3xl font-bold my-2">Create Review</h1>

                    <div className="flex flex-col justify-center items-center flex-wrap md:flex-row md:flex-nowrap md:justify-start my-5 gap-4 lg:gap-4">
                        <div className="w-16 h-16 lg:w-28 lg:h-28 aspect-square">
                            <img src={data?.data?.productFeatureImage} alt="Product Image" className="w-full h-full object-contain rounded" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <h2 className="text-xl font-semibold">{capitalizeWords(data?.data?.productName)}</h2>
                            <p>{data?.data?.productShortDescription}</p>
                            <Link className="max-w-fit" to={`/product-details/${data?.data?.productSlug}`}>
                                <Button className="Primary">View Product</Button>
                            </Link>
                        </div>
                    </div>
                    <hr className="my-4 border-gray-400 dark:border-gray-700" />
                    <form className="space-y-5" onSubmit={handleSubmit(formData => mutate(formData))}>
                        {errors.root && (
                            <div className="w-full my-4 bg-red-500 text-center rounded-md border border-red-600 py-3 px-4">
                                <h4 className="text-white font-bold text-sm">{errors.root.message}</h4>
                            </div>
                        )}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">Overall Rating</h2>
                            <Rating rating={rating} onRatingChange={handleRatingChange} size={"text-3xl cursor-pointer"} />
                            {errors.rating?.message && <p className="text-red-700 font-bold my-2 text-base px-2">{errors.rating?.message}</p>}
                        </div>
                        <hr className="my-4 border-gray-400 dark:border-gray-700" />
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">Add a headline</h2>
                            <div className="w-full">
                                <Input
                                    placeholder="What's most important to know?"
                                    {...register("title")}
                                    disabled={isPending}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    error={errors.title?.message}
                                />
                            </div>
                        </div>
                        <hr className="my-4 border-gray-400 dark:border-gray-700" />
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">Add a written review</h2>
                            <div className="w-full">
                                <TextArea
                                    placeholder="What did you like or dislike? What did you use the product for?"
                                    error={errors.comment?.message}
                                    className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                                    rows={4}
                                    {...register("comment")}
                                    disabled={isPending}
                                />
                                <p className="my-2">We will notify you via email as soon as your review is processed.</p>
                            </div>
                        </div>
                        <div className="w-full border-t">
                            <Button disabled={isPending} className="Primary mt-4 btnXl">
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
