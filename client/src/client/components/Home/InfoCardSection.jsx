import image1 from "../../assets/home/info_section/info_Image1.webp";
import image2 from "../../assets/home/info_section/info_Image2.webp";
import image3 from "../../assets/home/info_section/info_Image3.webp";
import { Link } from "react-router-dom";

const InfoCardSection = () => {
    return (
        <section className="w-full grid grid-cols-1 justify-items-center items-center my-5 gap-6 md:grid-cols-3">
            <div className="w-full overflow-hidden">
                <Link to={"/"}>
                    <img className="w-full h-auto object-cover cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out transform delay-75" src={image1} alt="Info Image" />
                </Link>
            </div>
            <div className="w-full overflow-hidden">
                <Link to={"/"}>
                    <img className="w-full h-auto object-cover cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out transform delay-75" src={image2} alt="Info Image" />
                </Link>
            </div>
            <div className="w-full overflow-hidden">
                <Link to={"/"}>
                    <img className="w-full h-auto object-cover cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out transform delay-75" src={image3} alt="Info Image" />
                </Link>
            </div>
        </section>
    );
};

export default InfoCardSection;
