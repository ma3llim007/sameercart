import { twMerge } from "tailwind-merge";

const Badge = ({ title, className = "Primary" }) => {
    const buttonClass = twMerge("inline-block px-3 py-2 text-center text-xs font-black rounded-full select-none", className);
    return <span className={buttonClass}>{title}</span>;
};

export default Badge;
