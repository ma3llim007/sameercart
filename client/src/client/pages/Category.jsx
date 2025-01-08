import { useParams } from "react-router-dom";
import { Banner } from "../components";
import { slugToText } from "@/utils";
import bannerImage from "../assets/banner/basket_banner.webp"

const Category = () => {
    const { categorySlug } = useParams();
    return (
        <>
            <Banner title={slugToText(categorySlug)} image={bannerImage} />
            <h1>{categorySlug}</h1>
        </>
    );
};

export default Category;
