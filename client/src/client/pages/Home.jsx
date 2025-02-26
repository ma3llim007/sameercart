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

const Home = () => {
    // Slider Data
    const sliderData = [
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
    ];

    // popular Categories Data
    const { data: popularCategories, isPending: popularCategoriesIsPending } = useQuery({
        queryKey: ["popularCategories"],
        queryFn: () => crudService.get("category/popular-categories"),
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            toastService.error(message || "Failed to fetch Data.");
        },
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

    if (popularCategoriesIsPending || newArrivalIsPending || mobileComputerIsPending || appliancesElectronicsIsPending) return <Loader />;
    return (
        <>
            <Slider sliderData={sliderData} />
            <Container>
                <IconSection />
                <InfoCardSection />
                <Categories categories={popularCategories} />
                <ProductsSection title="New Arrivals" productData={newArrivalsData?.data} />
                <HomeBanner />
                <ProductsSection title="Mobiles Computers" productData={mobileComputerData?.data} />
                <ProductsSection title="Tv Appliances Electronics" productData={appliancesElectronicsData?.data} />
                <HomeBlog />
            </Container>
        </>
    );
};

export default Home;
