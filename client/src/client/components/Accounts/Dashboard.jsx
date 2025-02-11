import { calculateUserDetailsScore, capitalizeWords } from "@/utils";
import { motion } from "framer-motion";
import { useMemo } from "react";

const Dashboard = ({ user }) => {
    // Profile details Score
    const userScore = useMemo(() => calculateUserDetailsScore(user), [user]);
    return (
        <>
            <h2 className="text-xl font-semibold mb-2">
                Welcome {capitalizeWords(user?.firstName)} {capitalizeWords(user?.lastName)}
            </h2>
            <div className="border-2 p-2 my-4 rounded shadow-lg">
                <h3 className="text-lg font-semibold">Profile Completion</h3>
                <div className="w-full bg-gray-600 rounded-full h-4 mt-2">
                    <motion.div
                        className="bg-blue-500 h-4 rounded-full"
                        style={{ width: `${userScore}%` }}
                        initial={{ width: "0%" }}
                        animate={{ width: `${userScore}%` }}
                        transition={{ duration: 0.5 }}
                    ></motion.div>
                </div>
                <p className="mt-2">Your profile is {userScore}% complete.</p>
            </div>
        </>
    );
};

export default Dashboard;
