import { lazy, Suspense, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import slider1 from "../assets/sliders/slider1.webp";
import slider2 from "../assets/sliders/slider2.webp";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import Loader from "../components/Loader/Loader";
import Slider from "../components/Home/Slider";
import Container from "../components/Container";
import IconSection from "../components/Home/IconSection";
import InfoCardSection from "../components/Home/InfoCardSection";
const Categories = lazy(() => import("../components/Home/Categories"));
const ProductsSection = lazy(() => import("../components/Home/ProductsSection"));
import HomeBanner from "../components/Home/HomeBanner";
import HomeBlog from "../components/Home/HomeBlog";
import BrandSection from "../components/Home/BrandSection";

// Generic function to fetch data
const fetchData = async url => {
    try {
        return await crudService.get(url);
    } catch (error) {
        const message = error?.response?.data?.message || error?.message;
        toastService.error(message || "Failed To Fetch Data.");
    }
};

const Home = () => {
    const queryClient = useQueryClient();
    // Slider Data
    const sliderData = useMemo(
        () => [
            {
                id: 1,
                imageUrl: slider1,
                short_title: "Wireless Bluetooth Gaming",
                title: "Bluetooth Gamepad",
                achor_link: "/",
                achor_title: "Show Now",
            },
            {
                id: 2,
                imageUrl: slider2,
                short_title: "New Design Features",
                title: "Hamsung Galaxy",
                achor_link: "/contact-us",
                achor_title: "Contact Us",
            },
        ],
        []
    );

    // Define queries
    const queries = [
        { key: "popularCategories", url: "category/popular-categories", staleTime: 20 * 60 * 1000 },
        { key: "newArrivals", url: "products/new-arrivals", staleTime: 20 * 60 * 1000 },
        { key: "mobileComputer", url: "products/get-products-by-category?category=677aa0b4fbf2956f2ee3cc28", staleTime: 20 * 60 * 1000 },
        { key: "appliancesElectronics", url: "products/get-products-by-category?category=677aa0cafbf2956f2ee3cc2f", staleTime: 20 * 60 * 1000 },
    ];

    // Prefetch data on mount
    useEffect(() => {
        queries.map(({ key, url, staleTime }) => {
            queryClient.prefetchQuery({
                queryKey: [key],
                queryFn: () => fetchData(url),
                staleTime: staleTime || 0,
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryClient]);

    // UseQueries for multiple queries
    const queryResults = useQueries({
        queries: queries.map(({ key, url, staleTime }) => ({
            queryKey: [key],
            queryFn: () => fetchData(url),
            staleTime: staleTime || 0,
        })),
    });

    // Extract data & loading states
    const [popularCategories, newArrivalsData, mobileComputerData, appliancesElectronicsData] = queryResults.map(query => query.data);

    const isLoading = queryResults.some(query => query.isPending);
    if (isLoading) return <Loader />;
    return (
        <>
            <Helmet>
                <title>SameerCart - Best Online Shopping Platform</title>
                <meta name="description" content="Shop the best products at SameerCart. Get exclusive deals on electronics, fashion, and more!" />
                <meta name="keywords" content="SameerCart, online shopping, ecommerce, best deals, fashion, electronics" />
                <meta property="og:title" content="SameerCart - Best Online Shopping Platform" />
                <meta property="og:description" content="Find amazing deals on top-quality products at SameerCart." />
                <meta property="og:image" content="https://sameercart.com/src/client/assets/Logo.svg" />
                <meta property="og:url" content="https://sameercart.com/" />
                <meta name="robots" content="index, follow" />
            </Helmet>
            <Slider sliderData={sliderData} />
            <Container>
                <IconSection />
                <InfoCardSection />
                <Suspense fallback={<Loader />}>
                    <Categories categories={popularCategories} />
                </Suspense>
                <Suspense fallback={<Loader />}>
                    <ProductsSection title="New Arrivals" productData={newArrivalsData?.data} />
                </Suspense>
                <HomeBanner />
                <Suspense fallback={<Loader />}>
                    <ProductsSection title="Mobiles Computers" productData={mobileComputerData?.data} />
                </Suspense>
                <Suspense fallback={<Loader />}>
                    <ProductsSection title="Tv Appliances Electronics" productData={appliancesElectronicsData?.data} />
                </Suspense>
                <BrandSection />
                <Suspense fallback={<Loader />}>
                    <HomeBlog />
                </Suspense>
            </Container>
        </>
    );
};

export default Home;
