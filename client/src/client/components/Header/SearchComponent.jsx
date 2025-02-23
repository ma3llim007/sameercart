import { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { capitalizeWords } from "@/utils";
import useSearchQuery from "@/client/hooks/useSearchQuery";

const SearchComponent = () => {
    const [query, setQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);

    // Use custom hook with a debounce of 700ms
    const { data, isFetching } = useSearchQuery(query, 700);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = event => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setQuery("");
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (
        <div ref={searchRef}>
            <div className="w-full mx-auto">
                <div className="flex">
                    <div className="relative w-full">
                        <input
                            type="text"
                            id="search"
                            className="block w-full px-4 py-2 text-base lg:text-lg xl:text-lg 2xl:text-lg bg-light-bgGray placeholder-gray-500 rounded border border-transparent focus:ring-2 focus:ring-light-blue focus:outline-none transition-all duration-200 ease-in-out dark:bg-dark-bgLightGray dark:text-white dark:placeholder-gray-300 dark:focus:ring-dark-light"
                            placeholder="Enter Your Search Key..."
                            required
                            autoComplete="off"
                            value={query}
                            onChange={e => {
                                setQuery(e.target.value);
                                setShowDropdown(true);
                            }}
                        />
                        <button
                            type="submit"
                            className="absolute top-0 end-0 py-2 px-4 h-full text-white bg-blue-700 rounded-e hover:bg-blue-800 transition-colors ease-in-out duration-200 outline-none hover:outline-none focus:right-0 focus:border-transparent"
                        >
                            <CiSearch size={25} strokeWidth={2} />
                            <span className="sr-only">Search</span>
                        </button>
                    </div>
                </div>
            </div>
            {showDropdown ? (
                <motion.div
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute left-0 right-0 z-50 max-w-md mt-0.5 mx-auto bg-light-bgGray dark:bg-dark-bgLightGray rounded-lg shadow-lg overflow-hidden flex flex-col gap-4"
                    style={{ willChange: "auto" }}
                >
                    {isFetching && <p className="p-3 text-gray-400">Searching...</p>}
                    {data?.data.length > 0
                        ? data?.data?.map(product => (
                              <Link
                                  key={product?._id}
                                  to={`/product-details/${product?.productSlug}`}
                                  onClick={() => setShowDropdown(false)}
                                  className="flex items-center gap-2 py-2 px-3 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-in-out group"
                              >
                                  <CiSearch
                                      size={22}
                                      strokeWidth={2}
                                      className="text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400 transition-all duration-200"
                                  />
                                  <span className="transition-all duration-200">{capitalizeWords(product?.productName)}</span>
                              </Link>
                          ))
                        : null}
                </motion.div>
            ) : null}
        </div>
    );
};

export default SearchComponent;
