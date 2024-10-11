import React from "react";
import sameer from "../../assets/teams/sameer.webp";
import shaiksameer from "../../assets/teams/shaik_sameer.webp";
import salman from "../../assets/teams/salman.webp";
import shareef from "../../assets/teams/shareef.webp";

const teams = [
    { id: 1, image: sameer, name: "Mohd Sameer", work: "Full Stack Developer" },
    { id: 2, image: shaiksameer, name: "Shaik Sameer", work: "Project Manager" },
    { id: 3, image: salman, name: "Mohd Salman Khan", work: "Marketing Specialist" },
    { id: 4, image: shareef, name: "Mohd Shareef", work: "UI/UX Designer" },
];

const Team = () => {
    return (
        <section className="w-full my-20">
            <div className="w-full text-center">
                <h2 className="text-4xl font-bold underline decoration-2 mb-5">Our Team</h2>
            </div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 select-none">
                {teams.map(team => (
                    <div key={team?.id} className="w-full flex flex-col justify-center gap-5 bg-light-gray/50 dark:bg-dark-gray rounded-lg px-4 py-8 group overflow-hidden hover:cursor-pointer hover:shadow-2xl shadow-light-shadow dark:shadow-dark-shadow">
                        <div className="inline-flex justify-center">
                        <img
                            className="w-2/4 rounded-full h-auto object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out transform"
                            src={team?.image}
                            alt={team?.name}
                        />
                        </div>
                        <div className="flex flex-col justify-center items-center space-y-3">
                            <h2 className="text-2xl font-bold">{team?.name}</h2>
                            <p className="text-lg ">{team?.work}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Team;
