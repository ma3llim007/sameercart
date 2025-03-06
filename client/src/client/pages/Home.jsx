import slider1 from "../assets/sliders/slider1.webp";
import slider2 from "../assets/sliders/slider2.webp";
import { useQuery } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import Loader from "../components/Loader/Loader";
import Slider from "../components/Home/Slider";
import Container from "../components/Container";
import IconSection from "../components/Home/IconSection";
import InfoCardSection from "../components/Home/InfoCardSection";
import Categories from "../components/Home/Categories";
import ProductsSection from "../components/Home/ProductsSection";
import HomeBanner from "../components/Home/HomeBanner";
import HomeBlog from "../components/Home/HomeBlog";
import BrandSection from "../components/Home/BrandSection";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";

const Home = () => {
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

    // popular Categories Data
    const { data: popularCategories, isPending: popularCategoriesIsPending } = useQuery({
        queryKey: ["popularCategories"],
        queryFn: () => crudService.get("category/popular-categories"),
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            toastService.error(message || "Failed to fetch Data.");
        },
        staleTime: 10 * 60 * 1000,
    });

    // New Product Arrivals
    const { data: newArrivalsData, isPending: newArrivalIsPending } = useQuery({
        queryKey: ["newArrivals"],
        queryFn: () => crudService.get("products/new-arrivals"),
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            toastService.error(message || "Failed to fetch Data.");
        },
    });

    // Product Of Mobile Computers
    const { data: mobileComputerData, isPending: mobileComputerIsPending } = useQuery({
        queryKey: ["mobileComputer"],
        queryFn: () => crudService.get("products/get-products-by-category?category=677aa0b4fbf2956f2ee3cc28"),
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            toastService.error(message || "Failed to fetch Data.");
        },
    });

    // Product Of Tv Appliances And Electronics
    const { data: appliancesElectronicsData, isPending: appliancesElectronicsIsPending } = useQuery({
        queryKey: ["appliancesElectronics"],
        queryFn: () => crudService.get("products/get-products-by-category?category=677aa0cafbf2956f2ee3cc2f"),
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            toastService.error(message || "Failed to fetch Data.");
        },
    });

    const isLoading = popularCategoriesIsPending || newArrivalIsPending || mobileComputerIsPending || appliancesElectronicsIsPending;
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
                <Categories categories={popularCategories} />
                <ProductsSection title="New Arrivals" productData={newArrivalsData?.data} />
                <HomeBanner />
                <ProductsSection title="Mobiles Computers" productData={mobileComputerData?.data} />
                <ProductsSection title="Tv Appliances Electronics" productData={appliancesElectronicsData?.data} />
                <BrandSection />
                <HomeBlog />
            </Container>
        </>
    );
};

export default Home;
