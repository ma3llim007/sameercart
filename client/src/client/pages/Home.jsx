import slider1 from "../assets/sliders/slider1.webp";
import slider2 from "../assets/sliders/slider2.webp";
import { Categories, Container, HomeBanner, HomeBlog, IconSection, InfoCardSection, ProductsSection, Slider } from "../components";
import { useQuery } from "@tanstack/react-query";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import Loader from "../components/Loader/Loader";

const Home = () => {
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

    const { data: popularCategories, isLoading } = useQuery({
        queryKey: ["popularCategories"],
        queryFn: () => crudService.get("category/popular-categories"),
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            toastService.error(message || "Failed to fetch Data.");
        },
    });

    if (isLoading) return <Loader />;
    return (
        <>
            <Slider sliderData={sliderData} />
            <Container>
                <IconSection />
                <InfoCardSection />
                <Categories categories={popularCategories} />
                <ProductsSection />
                <HomeBanner />
                <ProductsSection title="Audio & Video" />
                <ProductsSection title="Camera & Photo" />
                <HomeBlog />
            </Container>
        </>
    );
};

export default Home;
