import { useId, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const Rating = ({ rating, size = "text-base", onRatingChange, enableHover = false }) => {
    const ratingId = useId();
    const [hoveredStar, setHoveredStar] = useState(0);
    const Stars = Array.from({ length: 5 }, (_, index) => index + 1);

    const handleMouseEnter = idx => {
        if (enableHover) {
            setHoveredStar(idx);
        }
    };
    const handleMouseLeave = () => {
        if (enableHover) {
            setHoveredStar(0);
        }
    };

    const handleRating = index => {
        if (onRatingChange) {
            onRatingChange(index);
        }
    };
    return (
        <div className="w-full flex items-center gap-2" role="radiogroup" aria-labelledby={ratingId}>
            <span id={ratingId} className="sr-only">
                Star Rating
            </span>
            {Stars.map(index => (
                <button
                    key={index}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleRating(index)}
                    aria-label={`Rate ${index} stars`}
                    className={`px-0.5 flex items-center justify-center ${enableHover ? "cursor-pointer" : "cursor-default"}`}
                >
                    {hoveredStar >= index || rating >= index ? <AiFillStar className={`text-yellow-600 ${size}`} /> : <AiOutlineStar className={`text-yellow-600 ${size}`} />}
                </button>
            ))}
        </div>
    );
};

export default Rating;
