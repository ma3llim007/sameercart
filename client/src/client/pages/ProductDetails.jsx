import { Banner, Container } from "../components";
import bannerImage from "../assets/banner/basket_banner.webp";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import Loader from "../components/Loader/Loader";
import { capitalizeWords, formatNumberWithCommas } from "@/utils";
import Rating from "../components/Rating";
import { FaRupeeSign } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { upperCase } from "lodash";

const ProductDetails = () => {
    const { productSlug } = useParams();
    const [currentImage, setCurrentImage] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState(null);

    // Fetching Products
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["productDetails", productSlug],
        queryFn: () =>
            crudService.get(`/products/product-details/${productSlug}`),
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            toastService.error(message || "Failed to fetch Data.");
        },
        cacheTime: 2 * 60 * 1000,
    });

    const productData = useMemo(() => data?.data || {}, [data]);

    // Initialize selectedVariant after product data is loaded
    useEffect(() => {
        if (productData?.variantDetails?.length > 0) {
            setSelectedVariant(productData?.variantDetails[0]);
        }
    }, [productData]);

    // Handle the thumbnail image click
    const handleImage = index => {
        setCurrentImage(index);
    };

    // Group variant options (e.g., size, color)
    const variantGroup = useMemo(() => {
        return productData?.variantDetails?.reduce((groups, variant) => {
            // Ensure the attributes array exists and is valid
            if (variant.attributes && Array.isArray(variant.attributes)) {
                variant.attributes.forEach(attribute => {
                    // Ensure the group exists as a Set
                    if (!groups[attribute.name]) {
                        groups[attribute.name] = new Set();
                    }
                    // Add the value to the Set (duplicates will be automatically handled)
                    groups[attribute.name].add(attribute.value);
                });
            }
            return groups;
        }, {});
    }, [productData?.variantDetails]);

    // Convert Sets to arrays for rendering
    const formattedVariantGroup = useMemo(() => {
        const formattedGroups = { ...variantGroup };
        Object.keys(formattedGroups).forEach(groupName => {
            formattedGroups[groupName] = Array.from(formattedGroups[groupName]);
        });
        return formattedGroups;
    }, [variantGroup]);

    // Variant selection handler (onChange for the select element)
    const handleVariantSelection = (groupName, value) => {
        const selected = productData?.variantDetails?.find(variant =>
            variant.attributes.some(
                attr => attr.name === groupName && attr.value === value
            )
        );
        setCurrentImage(0);
        setSelectedVariant(selected);
    };

    if (isLoading || isFetching) return <Loader />;

    return (
        <>
            <Banner title={"Products"} image={bannerImage}>
                <Breadcrumb>
                    <BreadcrumbList className="text-lg">
                        <BreadcrumbItem>
                            <Link to="/">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{"Products"}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </Banner>
            <Container>
                <section className="w-full my-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Product Image Section */}
                        <div className="w-full flex gap-2">
                            {/* Product Thumbail Image */}
                            {productData?.variantDetails?.length > 0 && (
                                <div className="flex flex-col gap-4 mt-2 overflow-x-auto">
                                    {(selectedVariant?.images || []).map(
                                        (image, idx) => (
                                            <div key={idx} className="relative">
                                                <img
                                                    src={image?.imageUrl}
                                                    alt={`Variant image ${idx + 1}`}
                                                    className="w-20 h-20 rounded-md cursor-pointer border-2 border-gray-300 hover:border-blue-600 transition duration-300"
                                                    onMouseEnter={() =>
                                                        handleImage(idx)
                                                    }
                                                />
                                                {currentImage === idx && (
                                                    <div className="absolute top-0 left-0 right-0 bottom-0 border-2 border-blue-600 rounded-md cursor-pointer"></div>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                            {/* Main Image */}
                            <div className="w-full flex-grow">
                                <img
                                    src={
                                        selectedVariant?.images[currentImage]
                                            ?.imageUrl ||
                                        productData?.productFeatureImage
                                    }
                                    alt={
                                        productData?.productName ||
                                        "Product Name"
                                    }
                                    className="rounded-lg border border-gray-300 w-full h-auto"
                                />
                            </div>
                        </div>
                        {/* Product Details */}
                        <div className="flex flex-col p-2">
                            <h1 className="text-3xl font-semibold mb-4">
                                {capitalizeWords(productData?.productName)}
                            </h1>
                            <div className="mb-4">
                                <h3 className="text-xl">Description:</h3>
                                <p className="my-1">
                                    {productData?.productShortDescription}
                                </p>
                            </div>
                            {/* Price Section */}
                            <div className="flex gap-2 select-none">
                                <p className="text-2xl font-bold flex items-center gap-1">
                                    <FaRupeeSign size={20} />
                                    {formatNumberWithCommas(
                                        productData?.productDiscountPrice ||
                                            selectedVariant?.discountPrice ||
                                            0
                                    )}
                                </p>
                                <div className="flex items-center gap-2">
                                    <p className="text-base text-gray-700 line-through flex items-center gap-1 dark:text-gray-300">
                                        <FaRupeeSign size={14} />
                                        {formatNumberWithCommas(
                                            productData?.basePrice ||
                                                selectedVariant?.basePrice ||
                                                0
                                        )}
                                    </p>
                                    {productData?.productType === "variable" &&
                                        selectedVariant?.basePrice >
                                            selectedVariant?.discountPrice && (
                                            <p className="text-base font-semibold text-red-600">
                                                {Math.round(
                                                    ((selectedVariant?.basePrice -
                                                        selectedVariant?.discountPrice) /
                                                        selectedVariant?.basePrice) *
                                                        100
                                                )}
                                                % Off
                                            </p>
                                        )}
                                    {productData?.basePrice >
                                        productData?.productDiscountPrice && (
                                        <p className="text-base font-semibold text-red-600">
                                            {Math.round(
                                                ((productData?.basePrice -
                                                    productData?.productDiscountPrice) /
                                                    productData?.basePrice) *
                                                    100
                                            )}
                                            % Off
                                        </p>
                                    )}
                                </div>
                            </div>
                            {/* Rating Section */}
                            <div className="my-4 flex flex-col md:flex-row justify-start items-start md:items-center gap-4 max-w-lg">
                                <h3 className="text-xl font-semibold">
                                    Rating:
                                </h3>
                                <div className="flex flex-row gap-3 items-center">
                                    <p className="text-base font-medium">
                                        {productData?.ratings?.averageRating}
                                    </p>
                                    <Rating
                                        size="text-base"
                                        rating={
                                            productData?.ratings
                                                ?.averageRating || 3
                                        }
                                    />
                                    <p className="text-base whitespace-nowrap">
                                        {formatNumberWithCommas(
                                            productData?.ratings
                                                ?.numberOfReviews || 0
                                        )}{" "}
                                        Ratings
                                    </p>
                                </div>
                            </div>
                            {/* Display Variant Groups */}
                            {formattedVariantGroup &&
                                Object.keys(formattedVariantGroup).length > 0 &&
                                Object.keys(formattedVariantGroup).map(
                                    groupName => (
                                        <div key={groupName} className="mb-6">
                                            <h4 className="font-bold mb-2">
                                                {capitalizeWords(groupName)}:
                                            </h4>
                                            <div className="flex gap-4">
                                                <select
                                                    id={groupName}
                                                    className={`px-3 py-2 rounded bg-white text-black dark:bg-slate-800 dark:text-white outline-none text-lg focus:bg-gray-50 dark:focus:bg-slate-700 duration-200 border border-gray-200 w-2/4
                                                        ${
                                                            selectedVariant?.attributes?.some(
                                                                attr =>
                                                                    attr.name ===
                                                                        groupName &&
                                                                    formattedVariantGroup[
                                                                        groupName
                                                                    ].includes(
                                                                        attr.value
                                                                    )
                                                            )
                                                                ? "bg-blue-600 text-white border-blue-600"
                                                                : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                                                        }`}
                                                    onChange={e =>
                                                        handleVariantSelection(
                                                            groupName,
                                                            e.target.value
                                                        )
                                                    }
                                                    defaultValue={
                                                        selectedVariant?.attributes?.find(
                                                            attr =>
                                                                attr.name ===
                                                                groupName
                                                        )?.value || ""
                                                    }
                                                >
                                                    <option value="" disabled>
                                                        Select{" "}
                                                        {capitalizeWords(
                                                            groupName
                                                        )}
                                                    </option>
                                                    {formattedVariantGroup[
                                                        groupName
                                                    ].map((value, idx) => (
                                                        <option
                                                            key={idx}
                                                            value={value}
                                                            selected={selectedVariant?.attributes?.some(
                                                                attr =>
                                                                    attr.name ===
                                                                        groupName &&
                                                                    attr.value ===
                                                                        value
                                                            )}
                                                        >
                                                            {upperCase(value)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    )
                                )}
                            {/* {formattedVariantGroup &&
                                Object.keys(formattedVariantGroup).length > 0 &&
                                Object.keys(formattedVariantGroup).map(
                                    groupName => (
                                        <div key={groupName} className="mb-6">
                                            <h4 className="font-bold mb-2">
                                                {capitalizeWords(groupName)}:{" "}
                                            </h4>
                                            <div className="flex gap-4">
                                                <select
                                                    id={groupName}
                                                    className={`px-3 py-2 rounded bg-white text-black dark:bg-slate-800 dark:text-white outline-none text-lg focus:bg-gray-50 dark:focus:bg-slate-700 duration-200 border border-gray-200 w-2/4
                                                        ${
                                                            selectedVariant?.attributes?.some(
                                                                attr =>
                                                                    attr.name ===
                                                                        groupName &&
                                                                    attr.value ===
                                                                        groupName
                                                            )
                                                                ? "bg-blue-600 text-white border-blue-600"
                                                                : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                                                        }
                                                        
                                                        `}
                                                    onChange={e =>
                                                        handleVariantSelection(
                                                            groupName,
                                                            e.target.value
                                                        )
                                                    }
                                                    defaultValue=""
                                                >
                                                    <option value="" disabled>
                                                        Select{" "}
                                                        {capitalizeWords(
                                                            groupName
                                                        )}
                                                    </option>
                                                    {formattedVariantGroup[
                                                        groupName
                                                    ].map((value, idx) => (
                                                        <option
                                                            key={idx}
                                                            value={value}
                                                            selected={
                                                                selectedVariant
                                                                    ?.attributes
                                                                    .value ===
                                                                value
                                                            }
                                                        >
                                                            {upperCase(value)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    )
                                )} */}
                        </div>
                    </div>
                </section>
            </Container>
        </>
    );
};

export default ProductDetails;
