import React, { useEffect } from "react";

const LoadingOverlay = ({
    title = "Processing Your Request...",
    description = "Hang Tight! We're Preparing Everything For You",
    gradientColors = "from-blue-700 to-blue-950",
}) => {
    useEffect(() => {
        // Prevent mouse events
        const previousMouseEvents = e => {
            e.preventDefault();
            e.stopPropagation();
        };

        // Disable scroll
        document.body.style.overflow = "hidden";
        window.addEventListener("mousedown", previousMouseEvents, true);
        window.addEventListener("mouseup", previousMouseEvents, true);
        window.addEventListener("mousemove", previousMouseEvents, true);
        window.addEventListener("click", previousMouseEvents, true);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("mousedown", previousMouseEvents, true);
            window.removeEventListener("mouseup", previousMouseEvents, true);
            window.removeEventListener("mousemove", previousMouseEvents, true);
            window.removeEventListener("click", previousMouseEvents, true);
        };
    }, []);
    return (
        <>
            <div
                className="bg-black/50 absolute inset-0 overflow-hidden select-none pointer-events-none z-50 transition-all duration-100 ease-in-out"
                style={{ top: 0, left: 0 }}
            >
                <div className="w-full h-screen flex justify-center items-center">
                    <div className="bg-white shadow-lg rounded-lg px-8 py-6 text-center max-w-md">
                        <h2 className="text-gray-800 text-lg font-bold mb-4">
                            {title}
                        </h2>
                        <p className="text-gray-600 mb-6">{description}</p>
                        <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`absolute inset-0 bg-gradient-to-r ${gradientColors} rounded-full animate-progress`}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                {`
                    @keyframes progressAnimation {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }

                    .animate-progress {
                        animation: progressAnimation 1.5s infinite linear;
                        width: 150%; 
                        height: 100%;
                    }
                `}
            </style>
        </>
    );
};

export default LoadingOverlay;
