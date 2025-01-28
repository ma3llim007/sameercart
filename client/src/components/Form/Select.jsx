import { upperFirst } from "lodash";
import { forwardRef, useId, useMemo } from "react";

function Select({ options = [], placeholder = "Select an option", label, className, error, ...props }, ref) {
    const id = useId();

    // option Label
    const getOptinLabel = option => {
        return option?.categoryName || option.subCategoryName || option.label || "";
    };

    // Memoize options for performance
    const optionsElments = useMemo(() => {
        return Array.isArray(options)
            ? options.map(option => (
                  <option key={option?._id} value={option?._id} className="bg-white text-gray-700 dark:bg-slate-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700">
                      {upperFirst(getOptinLabel(option))}
                  </option>
              ))
            : [];
    }, [options]);

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="inline-block mb-2 pl-1 text-base font-bold">
                    {label} <span className="text-red-500 font-black">*</span>
                </label>
            )}
            <select
                id={id}
                ref={ref}
                {...props}
                className={`px-3 py-2 rounded bg-white text-black dark:bg-slate-800 dark:text-white outline-none text-lg focus:bg-gray-50 dark:focus:bg-slate-700 duration-200 border border-gray-200 w-full ${className}`}
            >
                <option value="" className="bg-white text-gray-700 dark:bg-slate-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700">
                    {placeholder}
                </option>
                {optionsElments.length > 0 ? optionsElments : <option disabled>No options available</option>}
            </select>
            {error && <p className="text-red-700 font-bold my-2 text-base px-2">{error}</p>}
        </div>
    );
}

export default forwardRef(Select);
