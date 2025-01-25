import { useEffect, useState } from "react";
import { throttle } from "lodash";

const useSticky = (throttleTime = 100) => {
    const [isSticky, setIsSticky] = useState(false);
    useEffect(() => {
        const handleScroll = throttle(() => {
            setIsSticky(window.scrollY > 0);
        }, throttleTime);

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [throttleTime]);
    return isSticky;
};

export default useSticky;
