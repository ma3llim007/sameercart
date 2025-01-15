const Badge = ({ title, className = "Primary" }) => {
    return <span className={`inline-block px-3 py-2 text-center text-xs !font-black rounded-full select-none ${className}`}>{title}</span>;
};

export default Badge;
