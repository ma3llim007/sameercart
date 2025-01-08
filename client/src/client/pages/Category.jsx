import { useParams } from "react-router-dom";
import { Banner } from "../components";
import { slugToText } from "@/utils";
import bannerImage from "../assets/banner/basket_banner.webp";

const Category = () => {
    const { categorySlug } = useParams();
    const title = categorySlug ? slugToText(categorySlug) : "Unknown Category";

    return (
        <>
            <Banner
                title={title}
                image={bannerImage}
                controller={title}
                controllerUrl={categorySlug}
            />
            <h1>{categorySlug}</h1>
        </>
    );
};

export default Category;
