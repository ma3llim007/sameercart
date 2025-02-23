import { FaFlag, FaProductHunt, FaGlobe, FaUsers } from "react-icons/fa";
import bgImage from "../../assets/about_us/bg_our_story.webp";

const content = {
    title: "Our Story",
    description: "From humble beginnings to industry leaders, our journey is marked by passion, perseverance, and innovation. Here's a look at some of the key milestones that shaped our company.",
    milestones: [
        {
            id: 1,
            icon: FaFlag,
            year: "2000",
            title: "Founded",
            description: "Our company was established with the vision to innovate and redefine customer experiences.",
        },
        {
            id: 2,
            icon: FaProductHunt,
            year: "2005",
            title: "First Product Launch",
            description: "Released our first product, which was an immediate success and set the foundation for future growth.",
        },
        {
            id: 3,
            icon: FaGlobe,
            year: "2010",
            title: "Global Expansion",
            description: "Expanded our operations to new regions, establishing a strong global presence in over 10 countries.",
        },
        {
            id: 4,
            icon: FaUsers,
            year: "2020",
            title: "Achieved 1 Million Customers",
            description: "Celebrated a major milestone by reaching 1 million customers worldwide, a testament to our quality and service.",
        },
    ],
    backgroundImage: bgImage,
};
const OurStory = () => {
    return (
        <section className="w-full my-20 rounded-lg" style={{ backgroundImage: `url(${content?.backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="w-full text-center text-white p-10 bg-black/60 shadow-md">
                <h2 className="text-3xl mb-10 font-bold underline decoration-2">{content?.title}</h2>
                <p className="text-xl text-center my-8">{content?.description}</p>
                <div className="grid grid-cols-1 gap-12 md:gap-16 overflow-hidden">
                    {content.milestones.map(mile => (
                        <div key={mile?.title} className="flex items-start">
                            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full bg-light-deep dark:bg-dark-deep">
                                <mile.icon className="text-3xl" />
                            </div>
                            <div className="ml-8 md:ml-12 text-start hover:scale-105 transition-transform ease-in-out duration-500 transform">
                                <h4 className="text-2xl font-semibold mb-2">
                                    {mile?.title} - {mile?.year}
                                </h4>
                                <p>{mile?.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OurStory;
