import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const Rating = ({ rating, size }) => {
    const Stars = Array.from({ length: 5 }, (_, index) => index + 1);
    return (
        <div className="w-full flex gap-0.5">
            {Stars.map(index => (
                <span key={index}>
                    {rating >= index ? (
                        <AiFillStar
                            className={`text-yellow-600 text-base ${size}`}
                        />
                    ) : (
                        <AiOutlineStar
                            className={`text-yellow-600 text-base ${size}`}
                        />
                    )}
                </span>
            ))}
        </div>
    );
};

export default Rating;
