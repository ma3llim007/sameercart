/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

const useTopScroll = (topPosition = 0, dependency = []) => {
    useEffect(() => {
        window.scrollTo({ top: topPosition, behavior: "smooth" });
    }, dependency);
};

export default useTopScroll;
