import { useEffect, useRef } from "react";

const useTopScroll = ({ topPosition = 100, page }) => {
    const hasScrolled = useRef(false);

    useEffect(() => {
        if (!hasScrolled.current && page !== 1) {
            window.scrollTo({ top: topPosition, behavior: "smooth" });
        }
    }, [topPosition, page]);
};

export default useTopScroll;
