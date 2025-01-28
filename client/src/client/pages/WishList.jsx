import { Banner, Container } from "../components";
import wishList from "../assets/banner/wish_list.webp";
import emptyCartImage from "../assets/products/emptyCart.webp";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { capitalizeWords, formatNumberWithCommas } from "@/utils";
import { FaRupeeSign, FaTrash } from "react-icons/fa";
import { Badge } from "@/components";
import { upperCase } from "lodash";
import { clearWishList, removeFromWishList } from "@/features/home/wishlistSlice";

const WishList = () => {
    const { wishlists } = useSelector(state => state.wishlist);
    const dispatch = useDispatch();

    return (
        <>
            <Banner title={"WishList"} image={wishList}>
                <Breadcrumb>
                    <BreadcrumbList className="text-lg">
                        <BreadcrumbItem>
                            <Link to="/">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{"WishList"}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </Banner>
            <Container>
                <section className="w-full my-5">
                    {wishlists.length > 0 ? (
                        <>
                            <h1 className="text-3xl md:text-4xl  text-light-deep dark:text-dark-light font-bold underline decoration-4">My Wishlist ({wishlists.length})</h1>
                            <div className="flex flex-col gap-4 my-4">
                                {wishlists.map((wishlist, idx) => (
                                    <div
                                        key={wishlist.id + idx}
                                        className="border border-gray-600 dark:border-gray-300 p-5 shadow-md rounded flex flex-col lg:flex-row gap-5 relative items-center lg:items-start"
                                    >
                                        <Link to={`/product-details/${wishlist?.slug}`}>
                                            <div className="w-36 h-36">
                                                <img src={wishlist?.image} alt={wishlist?.name} className="w-full h-auto object-cover rounded-lg border border-purple-600 border-opacity-60" />
                                            </div>
                                        </Link>
                                        <div className="flex-grow mt-3 group text-center lg:text-start">
                                            <Link to={`/product-details/${wishlist?.slug}`} className="space-y-2">
                                                <h3 className="text-base lg:text-xl  font-semibold group-hover:text-blue-600">{capitalizeWords(wishlist?.name)}</h3>
                                                {wishlist.attributes &&
                                                    wishlist.attributes?.map(attribute => (
                                                        <Badge key={attribute?._id} title={`${capitalizeWords(attribute.name)}: ${upperCase(attribute.value)}`} className="Primary max-w-fit mx-1" />
                                                    ))}
                                            </Link>
                                            <p className="text-2xl font-bold flex items-center gap-1 justify-center lg:justify-start mt-3">
                                                <FaRupeeSign size={20} />
                                                {formatNumberWithCommas(wishlist?.price || 0)}
                                            </p>
                                        </div>
                                        <div className="absolute top-1 right-1">
                                            <Button
                                                className="Danger p-3 rounded-md"
                                                onClick={() =>
                                                    dispatch(
                                                        removeFromWishList({
                                                            itemId: wishlist.id,
                                                            variantId: wishlist.variantId,
                                                        })
                                                    )
                                                }
                                            >
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="w-full flex justify-between gap-2">
                                <Link to={"/"}>
                                    <Button variant="outline" className="btnLg uppercase">
                                        Continue Shopping
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() => {
                                        dispatch(clearWishList());
                                    }}
                                    className="Primary btnLg uppercase"
                                >
                                    Clear Shopping Wishlist
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col justify-center items-center gap-5">
                            <img className="w-2/5 h-auto object-cover" src={emptyCartImage} alt="Empty Wishlist" />
                            <h1 className="font-bold text-xl lg:text-4xl xl:text-4xl 2xl:text-4xl">Your Wishlist Is Empty</h1>
                            <p className="leading-7 text-xl font-medium text-center">Looks Like You Have Not Added Anything To Your Wishlist.Go Ahead & Explore Our Products</p>
                            <Link to={"/"}>
                                <Button className="Primary btnXl">Back To Home</Button>
                            </Link>
                        </div>
                    )}
                </section>
            </Container>
        </>
    );
};

export default WishList;
