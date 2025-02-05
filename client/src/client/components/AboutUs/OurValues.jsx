import { FaHandshake, FaHandsHelping, FaLightbulb, FaStar } from "react-icons/fa";

const valuesData = [
    { id: 1, icon: FaHandshake, title: "Integrity", description: "We believe in honest and transparent communication." },
    { id: 2, icon: FaLightbulb, title: "Innovation", description: "We foster creativity and innovation in everything we do." },
    { id: 3, icon: FaHandsHelping, title: "Partnership", description: "We value collaboration and long-term partnerships." },
    { id: 4, icon: FaStar, title: "Excellence", description: "We strive for excellence in every aspect of our work." },
];

const OurValues = () => {
    return (
        <section className="w-full my-20">
            <div className="w-full text-center">
                <h2 className="text-3xl font-bold underline decoration-2">Our Values</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 place-content-center items-center gap-4 py-4">
                {valuesData.map(value => (
                    <div
                        key={value?.title}
                        className="flex flex-col justify-center items-center p-6 space-y-3 group bg-light-gray dark:bg-dark-bgGray rounded-lg hover:cursor-default transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
                    >
                        <div className="w-12 h-12 shadow-md rounded-full flex justify-center items-center group-hover:bg-light-deep group-hover:dark:bg-dark-deep group-hover:text-light-textWhite transition-colors duration-300 ease-in-out">
                            <value.icon className="text-3xl" />
                        </div>
                        <h3 className="text-lg font-semibold">{value?.title}</h3>
                        <p className="text-sm text-center text-light-textDarkGray dark:text-dark-textWhite">{value?.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default OurValues;
