import Rating from "../Rating";
import dummyUserImage from "../../assets/users/dummyUser.webp";

const ReviewCard = ({ userImage, userName, rating, reviewText }) => {
    return (
        <div className="border border-dark-deep grid grid-cols-[auto,1fr] gap-5 p-4 rounded-lg overflow-hidden">
            <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28">
                <img
                    src={userImage || dummyUserImage}
                    onError={e => (e.target.src = dummyUserImage)}
                    alt={`Review by ${userName}`}
                    className="w-full h-full object-cover rounded-full border-2 border-light-deep"
                />
            </div>
            <div className="flex flex-col gap-2 items-start justify-start">
                <h5 className="text-lg font-semibold">{userName}</h5>
                <div>
                    <Rating size="text-base" rating={rating} />
                </div>
                <p className="text-base">{reviewText}</p>
            </div>
        </div>
    );
};

export default ReviewCard;
