import React, { useId } from "react";

const Input = React.forwardRef(function Input({ label, type = "text", error, className = "", ...props }, ref) {
    const id = useId();
    return (
        <>
            <div className="w-full">
                {label && <label className="inline-block mb-1 pl-1">{label}</label>}
                <input
                    type={type}
                    ref={ref}
                    {...props}
                    id={id}
                    autoComplete="off"
                    className={`px-3 py-2 rounded-lg bg-white text-black outline-none text-lg focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
                />
                {error && <p className="text-red-700 font-bold my-2 text-base px-2">{error}</p>}
            </div>
        </>
    );
});
export default Input;
