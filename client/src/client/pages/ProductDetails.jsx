import bannerImage from "../assets/banner/basket_banner.webp";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import Loader from "../components/Loader/Loader";
import { capitalizeWords, formatNumberWithCommas } from "@/utils";
import Rating from "../components/Rating";
import { FaCartPlus, FaFacebook, FaHeart, FaInstagram, FaRupeeSign, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge, Input } from "@/components";
import { addToCart } from "@/features/home/cartSlice";
import { useDispatch } from "react-redux";
import { addToWishList } from "@/features/home/wishlistSlice";
import useTopScroll from "../hooks/useTopScroll";
import Banner from "../components/Banner";
import Container from "../components/Container";
import ProductDetailsTabSection from "../components/Products/ProductDetailsTabSection";

const ProductDetails = () => {
    const { productSlug } = useParams();
    const [currentImage, setCurrentImage] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [startX, setStartX] = useState(0); // Track the start position of the drag
    const [isDragging, setIsDragging] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();
    useTopScroll(0, []);

    // Fetching Products
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["productDetails", productSlug],
        queryFn: () => crudService.get(`/products/product-details/${productSlug}`),
        cacheTime: 3 * 60 * 1000,
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            toastService.error(message || "Failed to fetch Data.");
        },
    });
    const productData = useMemo(() => data?.data || {}, [data]);

    // Initialize selectedVariant after product data is loaded
    useEffect(() => {
        if (productData?.variantDetails?.length > 0) {
            setSelectedVariant(productData?.variantDetails[0]);
        }
    }, [productData]);

    // Handle the thumbnail image click
    const handleImageChange = index => {
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
        const selected = productData?.variantDetails?.find(variant => variant.attributes.some(attr => attr.name === groupName && attr.value === value));
        setCurrentImage(0);
        setSelectedVariant(selected);
    };

    const handleDragStart = e => {
        setStartX(e.clientX || e.touches[0].clientX);
    };

    const handleDragEnd = e => {
        const endX = e.clientX || e.changedTouches[0].clientX;
        const difference = endX - startX;

        // Swipe right (go to the previous image)
        if (difference > 50) {
            setCurrentImage(prev => (prev === 0 ? selectedVariant?.images.length - 1 : prev - 1));
        }

        // Swipe left (go to the next image)
        if (difference < -50) {
            setCurrentImage(prev => (prev === selectedVariant?.images.length - 1 ? 0 : prev + 1));
        }
    };

    const handleQuantityChange = type => {
        if (type === "increment") {
            setQuantity(prev => prev + 1);
        } else if (type === "decrement" && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    // Product Add To Cart
    const handleAddToCart = () => {
        const cartItem = {
            id: productData?._id,
            name: productData?.productName,
            price: selectedVariant?.discountPrice || productData?.productDiscountPrice,
            variantId: selectedVariant?._id || null,
            attributes: selectedVariant?.attributes || null,
            quantity: quantity || 1,
            image: selectedVariant?.images[currentImage]?.imageUrl || productData?.productFeatureImage,
            slug: productData?.productSlug,
        };
        dispatch(addToCart(cartItem));
    };

    // Product Add To Cart
    const handleAddToWishList = () => {
        const cartItem = {
            id: productData?._id,
            name: productData?.productName,
            price: selectedVariant?.discountPrice || productData?.productDiscountPrice,
            variantId: selectedVariant?._id || null,
            attributes: selectedVariant?.attributes || null,
            quantity: quantity || 1,
            image: selectedVariant?.images[currentImage]?.imageUrl || productData?.productFeatureImage,
            slug: productData?.productSlug,
        };
        dispatch(addToWishList(cartItem));
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
                                <div className="hidden lg:flex flex-col gap-4 mt-2 overflow-x-auto">
                                    {(selectedVariant?.images || []).map((image, idx) => (
                                        <div key={idx} className="relative">
                                            <img
                                                src={image?.imageUrl}
                                                alt={`Variant image ${idx + 1}`}
                                                className="w-16 h-16 rounded-md cursor-pointer border-2 border-gray-300 hover:border-blue-600 transition duration-300"
                                                onMouseEnter={() => handleImageChange(idx)}
                                                onClick={() => handleImageChange(idx)}
                                            />
                                            {currentImage === idx && <div className="absolute top-0 left-0 right-0 bottom-0 border-2 border-blue-600 rounded-md cursor-pointer"></div>}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {/* Main Image */}
                            <div className="w-full flex-grow relative">
                                <img
                                    onTouchStart={handleDragStart}
                                    onTouchEnd={handleDragEnd}
                                    onMouseDown={e => {
                                        handleDragStart(e);
                                        setIsDragging(true);
                                    }}
                                    onMouseUp={e => {
                                        handleDragEnd(e);
                                        setIsDragging(false);
                                    }}
                                    onMouseLeave={() => setIsDragging(false)}
                                    onDragStart={e => e.preventDefault()}
                                    draggable="false"
                                    src={selectedVariant?.images[currentImage]?.imageUrl || productData?.productFeatureImage}
                                    alt={productData?.productName || "Product Name"}
                                    key={currentImage}
                                    className={`rounded-lg border border-gray-300 w-full h-auto transition-opacity duration-500 ease-in-out opacity-100 ${isDragging ? "cursor-grabbing" : "cursor-default"}`}
                                />
                                <div className="absolute w-full flex justify-center mt-2 py-1 lg:hidden">
                                    {(selectedVariant?.images || []).map((_, idx) => (
                                        <span
                                            key={idx}
                                            onClick={() => handleImageChange(idx)}
                                            className={`w-3 h-3 mx-1 rounded-full cursor-pointer border transition-all duration-300 ${idx === currentImage ? "bg-blue-600 border-black scale-125" : "border-black bg-white scale-100"} `}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <hr className="decoration-2 my-4 lg:hidden" />
                        {/* Product Details */}
                        <div className="flex flex-col p-2 space-y-4">
                            <h1 className="text-3xl font-semibold">{capitalizeWords(productData?.productName)}</h1>
                            <h3 className="text-xl font-bold">Description:</h3>
                            <p>{productData?.productShortDescription}</p>
                            {/* Product Brand */}
                            <div className="flex gap-4 items-center">
                                <h3 className="text-xl">
                                    <strong>Brand:</strong> {capitalizeWords(productData?.productBrand)}
                                </h3>
                            </div>
                            {/* Price Section */}
                            <div className="flex gap-2 justify-start items-center select-none">
                                <p className="text-2xl font-bold flex items-center gap-1">
                                    <FaRupeeSign size={20} />
                                    {formatNumberWithCommas(productData?.productDiscountPrice || selectedVariant?.discountPrice || 0)}
                                </p>
                                <div className="flex items-center gap-2">
                                    <p className="text-base text-gray-700 line-through flex items-center gap-1 dark:text-gray-300">
                                        <FaRupeeSign size={14} />
                                        {formatNumberWithCommas(productData?.basePrice || selectedVariant?.basePrice || 0)}
                                    </p>
                                    {productData?.productType === "variable" && selectedVariant?.basePrice > selectedVariant?.discountPrice && (
                                        <p className="text-base font-semibold text-red-600">
                                            {Math.round(((selectedVariant?.basePrice - selectedVariant?.discountPrice) / selectedVariant?.basePrice) * 100)}% Off
                                        </p>
                                    )}
                                    {productData?.basePrice > productData?.productDiscountPrice && (
                                        <p className="text-base font-semibold text-red-600">
                                            {Math.round(((productData?.basePrice - productData?.productDiscountPrice) / productData?.basePrice) * 100)}% Off
                                        </p>
                                    )}
                                </div>
                            </div>
                            {/* Rating Section */}
                            <div className="flex flex-row items-center md:items-center gap-4 max-w-lg">
                                <h3 className="text-xl font-semibold">Rating:</h3>
                                <div className="flex flex-row gap-3 items-center">
                                    <p className="text-base font-medium">{productData?.ratings?.averageRating}</p>
                                    <Rating size="text-base" rating={productData?.ratings?.averageRating} />
                                    <p className="text-base whitespace-nowrap">{formatNumberWithCommas(productData?.ratings?.numberOfReviews || 0)} Ratings</p>
                                </div>
                            </div>
                            {productData?.productType === "variable" && selectedVariant?.stockQuantity <= 0 ? (
                                <Badge title={"Out Of Stock"} className="Danger max-w-fit text-base !font-extrabold underline rounded" />
                            ) : productData?.productType === "simple" && productData?.productStock <= 0 ? (
                                <Badge title={"Out Of Stock"} className="Danger max-w-fit text-base !font-extrabold underline rounded" />
                            ) : null}
                            {/* Display Variant Groups */}
                            {formattedVariantGroup &&
                                Object.keys(formattedVariantGroup).length > 0 &&
                                Object.keys(formattedVariantGroup).map(groupName => (
                                    <div key={groupName}>
                                        <h4 className="font-bold mb-2 text-start">{capitalizeWords(groupName)}:</h4>
                                        <div className="flex gap-4 justify-start">
                                            <select
                                                id={groupName}
                                                className="px-3 py-2 rounded bg-white text-gray-900 dark:bg-slate-800 dark:text-white outline-none text-lg focus:ring-2 focus:ring-blue-500 duration-200 border border-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 w-2/4"
                                                onChange={e => handleVariantSelection(groupName, e.target.value)}
                                                value={selectedVariant?.attributes?.find(attr => attr.name === groupName)?.value || ""}
                                            >
                                                <option value="" disabled>
                                                    Select {capitalizeWords(groupName)}
                                                </option>
                                                {formattedVariantGroup[groupName].map((value, idx) => (
                                                    <option key={idx} value={value} selected={selectedVariant?.attributes?.some(attr => attr.name === groupName && attr.value === value)}>
                                                        {value.toUpperCase()}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-4">
                                <div className="flex justify-center items-center gap-4">
                                    <Button
                                        onClick={() => handleQuantityChange("decrement")}
                                        disabled={
                                            quantity === 1 ||
                                            (productData?.productType === "variable" && selectedVariant?.stockQuantity <= 0) ||
                                            (productData?.productType === "simple" && productData?.productStock <= 0)
                                        }
                                        className="text-2xl"
                                        variant="outline"
                                    >
                                        -
                                    </Button>
                                    <Input
                                        disabled={
                                            (productData?.productType === "variable" && selectedVariant?.stockQuantity <= 0) ||
                                            (productData?.productType === "simple" && productData?.productStock <= 0)
                                        }
                                        value={quantity || 1}
                                        readOnly
                                        className="text-center"
                                    />
                                    <Button
                                        onClick={() => handleQuantityChange("increment")}
                                        variant="outline"
                                        disabled={
                                            quantity === 10 ||
                                            (productData?.productType === "variable" && selectedVariant?.stockQuantity <= 0) ||
                                            (productData?.productType === "simple" && productData?.productStock <= 0)
                                        }
                                    >
                                        +
                                    </Button>
                                </div>
                                <Button
                                    disabled={
                                        (productData?.productType === "variable" && selectedVariant?.stockQuantity <= 0) || (productData?.productType === "simple" && productData?.productStock <= 0)
                                    }
                                    onClick={handleAddToCart}
                                    className="text-base Primary"
                                    title="Add To Cart"
                                >
                                    <FaCartPlus /> Add To Cart
                                </Button>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button onClick={handleAddToWishList} className="text-base Teal" title="Add To Wishlist">
                                    <FaHeart /> Add To Wishlist
                                </Button>
                            </div>
                            {/* Sharing Links */}
                            <div className="flex gap-4 items-center">
                                <h3 className="text-xl font-bold">Share:</h3>
                                <div className="flex gap-5 my-4 text-xl">
                                    <FaFacebook />
                                    <FaTwitter />
                                    <FaWhatsapp />
                                    <FaInstagram />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Product Tab Details */}
                    <ProductDetailsTabSection productDescription={productData?.productDescription} productSpecification={productData?.productSpecification} productId={productData?._id} />
                </section>
            </Container>
        </>
    );
};

export default ProductDetails;
