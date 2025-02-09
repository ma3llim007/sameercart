import { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const Rating = ({ rating, size = "text-base", onRatingChange, enableHover = false }) => {
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
        <div className="w-full flex items-center gap-0.5">
            {Stars.map(index => (
                <span key={index} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave} onClick={() => handleRating(index)} aria-label={`Rate ${index} stars`}>
                    {hoveredStar >= index || rating >= index ? <AiFillStar className={`text-yellow-600 ${size}`} /> : <AiOutlineStar className={`text-yellow-600 ${size}`} />}
                </span>
            ))}
        </div>
    );
};

export default Rating;
