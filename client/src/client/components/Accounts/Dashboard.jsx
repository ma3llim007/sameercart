import { calculateUserDetailsScore, capitalizeWords } from "@/utils";
import { motion } from "framer-motion";
import { useMemo } from "react";

const Dashboard = ({ user }) => {
    // Profile details Score
    const userScore = useMemo(() => calculateUserDetailsScore(user), [user]);
    return (
        <div className="flex flex-col lg:flex-row items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            {/* User Greeting */}
            <div className="flex flex-col items-center lg:items-start">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Welcome,{" "}
                    <span className="text-blue-500">
                        {capitalizeWords(user?.firstName)} {capitalizeWords(user?.lastName)}
                    </span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-base">{userScore === 100 ? "Your profile is fully complete! 🎉" : "Let's complete your profile for a better experience!"}</p>
            </div>

            {/* Profile Completion Card */}
            <div className="w-full lg:w-1/2 mt-4 lg:mt-0 p-4 bg-gray-100 dark:bg-slate-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Profile Completion</h3>

                {/* Progress Bar */}
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4 mt-2 overflow-hidden">
                    <motion.div
                        className="bg-blue-600 dark:bg-blue-500 h-4 rounded-full"
                        style={{ width: `${userScore}%` }}
                        initial={{ width: "0%" }}
                        animate={{ width: `${userScore}%` }}
                        transition={{ duration: 0.5 }}
                    ></motion.div>
                </div>

                {/* Completion Percentage */}
                <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm font-medium">
                    {userScore === 100 ? (
                        <span className="font-semibold text-green-600 dark:text-green-400">Congratulations! Your profile is 100% complete. ✅</span>
                    ) : (
                        <>
                            Your profile is <span className="font-semibold text-blue-600 dark:text-blue-400">{userScore}%</span> complete.
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
