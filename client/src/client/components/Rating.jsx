import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const Rating = ({ rating, size = "text-base" }) => {
    const Stars = Array.from({ length: 5 }, (_, index) => index + 1);
    return (
        <div className="w-full flex items-center justify-center gap-0.5">
            {Stars.map(index => (
                <span key={index}>
                    {rating >= index ? (
                        <AiFillStar className={`text-yellow-600 ${size}`} />
                    ) : (
                        <AiOutlineStar className={`text-yellow-600 ${size}`} />
                    )}
                </span>
            ))}
        </div>
    );
};

export default Rating;
