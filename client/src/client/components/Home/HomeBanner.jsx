import img from "../../assets/home/home_banner.webp";

const HomeBanner = () => {
    return (
        <section className="w-full overflow-hidden my-5 rounded-md pointer-events-none">
            <img className="w-full h-auto object-cover" src={img} alt="Image" loading="lazy" />
        </section>
    );
};

export default HomeBanner;
