import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Banner, Container } from "../components";
import { Link } from "react-router-dom";
import bannerImage from "../assets/banner/basket_banner.webp";
import emptyCartImage from "../assets/products/emptyCart.webp";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { capitalizeWords, formatNumberWithCommas } from "@/utils";
import { Button } from "@/components/ui/button";
import { FaRupeeSign, FaTrash } from "react-icons/fa";
import { Badge, Input } from "@/components";
import { upperCase } from "lodash";
import { clearCart, decrementQuanity, incrementQuanity, removeFromCart } from "@/features/home/cartSlice";

const Cart = () => {
    const { carts, totalCartPrice } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    return (
        <>
            <Banner title={"Cart"} image={bannerImage}>
                <Breadcrumb>
                    <BreadcrumbList className="text-lg">
                        <BreadcrumbItem>
                            <Link to="/">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{"Cart"}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </Banner>
            <Container>
                <section className="w-full my-10">
                    {carts.length > 0 ? (
                        <>
                            <h1 className="text-2xl font-bold my-5">Your Cart Items</h1>
                            <Table className="shadow-sm border border-gray-500 border-opacity-45 rounded-xl w-full overflow-x-auto">
                                <TableHeader className="bg-gray-200 dark:bg-gray-800">
                                    <TableRow>
                                        <TableHead className="py-2 border border-gray-600 dark:border-gray-400 select-none font-bold text-base text-center">S.No</TableHead>
                                        <TableHead className="py-2 border border-gray-600 dark:border-gray-400 select-none font-bold text-base text-center">Image</TableHead>
                                        <TableHead className="py-2 border border-gray-600 dark:border-gray-400 select-none font-bold text-base text-center">Product Name</TableHead>
                                        <TableHead className="py-2 border border-gray-600 dark:border-gray-400 select-none font-bold text-base text-center">Unit Price</TableHead>
                                        <TableHead className="py-2 border border-gray-600 dark:border-gray-400 select-none font-bold text-base text-center">Quantity</TableHead>
                                        <TableHead className="py-2 border border-gray-600 dark:border-gray-400 select-none font-bold text-base text-center">Sub Total</TableHead>
                                        <TableHead className="py-2 border border-gray-600 dark:border-gray-400 select-none font-bold text-base text-center">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {carts.map((crt, idx) => (
                                        <TableRow
                                            className={
                                                idx % 2 === 0
                                                    ? "bg-white dark:bg-slate-900 hover:bg-gray-200 hover:dark:bg-gray-700"
                                                    : "bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 hover:dark:bg-gray-600"
                                            }
                                            key={crt.id + idx}
                                        >
                                            <TableCell className="p-3 border border-gray-600 dark:border-gray-400">{idx + 1}</TableCell>
                                            <TableCell className="p-3 border border-gray-600 dark:border-gray-400">
                                                <div className="w-full flex justify-center items-center">
                                                    <img className="max-w-32 h-auto object-cover rounded-xl" src={crt.image} alt={crt.name} />
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-3 border border-gray-600 dark:border-gray-400">
                                                <div className="max-w-52 flex flex-col gap-2">
                                                    {capitalizeWords(crt.name)}
                                                    {crt.attributes &&
                                                        crt.attributes?.map(attribute => (
                                                            <Badge key={attribute?._id} title={`${capitalizeWords(attribute.name)}: ${upperCase(attribute.value)}`} className="Primary max-w-fit" />
                                                        ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-3 border border-gray-600 dark:border-gray-400 text-center">{formatNumberWithCommas(crt.price)}</TableCell>
                                            <TableCell className="p-3 border border-gray-600 dark:border-gray-400 text-center max-w-36">
                                                <div className="flex flex-wrap xl:flex-nowrap justify-center items-center gap-4 py-4">
                                                    <Button
                                                        className="text-2xl"
                                                        variant="outline"
                                                        onClick={() => {
                                                            dispatch(
                                                                decrementQuanity({
                                                                    itemId: crt.id,
                                                                    variantId: crt.variantId,
                                                                })
                                                            );
                                                        }}
                                                    >
                                                        -
                                                    </Button>
                                                    <Input value={crt.quantity} readOnly className="text-center" />
                                                    <Button
                                                        onClick={() => {
                                                            dispatch(
                                                                incrementQuanity({
                                                                    itemId: crt.id,
                                                                    variantId: crt.variantId,
                                                                })
                                                            );
                                                        }}
                                                        variant="outline"
                                                        disabled={crt.quantity === 10}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-3 border border-gray-600 dark:border-gray-400 text-center">{formatNumberWithCommas(crt.price * crt.quantity)}</TableCell>
                                            <TableCell className="p-3 border border-gray-600 dark:border-gray-400">
                                                <Button
                                                    className="Danger p-5 rounded-md"
                                                    onClick={() =>
                                                        dispatch(
                                                            removeFromCart({
                                                                itemId: crt.id,
                                                                variantId: crt.variantId,
                                                            })
                                                        )
                                                    }
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex gap-4"></div>
                            <div className="w-full flex justify-between gap-2 mt-4">
                                <Link to={"/"}>
                                    <Button variant="outline" className="lg:btnLg uppercase">
                                        Continue Shopping
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() => {
                                        dispatch(clearCart());
                                    }}
                                    className="Primary lg:btnLg uppercase"
                                >
                                    Clear Shopping Cart
                                </Button>
                            </div>
                            <hr className="my-5" />
                            <div className="w-3/4 mx-auto flex gap-4 justify-between flex-wrap lg:flex-nowrap">
                                <div className="w-full p-4 space-y-4 dark:bg-slate-800 rounded shadow-lg">
                                    <h4 className="text-2xl font-extrabold">Use Coupon Code</h4>
                                    <p className="text-lg text-gray-700 dark:text-gray-300">Enter Your Coupon Code If You Have One.</p>
                                    <Input placeholder="Enter The Coupon" className="text-xl rounded-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                    <Button className="Primary btnXl !mt-4">Apply Coupon</Button>
                                </div>
                                <div className="w-full shadow-lg p-4 space-y-4 dark:bg-slate-800 rounded">
                                    <h4 className="text-2xl font-extrabold">Use Coupon Code</h4>
                                    <div className="flex justify-between text-lg">
                                        <h5>Total Products</h5>
                                        <h5 className="font-bold flex items-center gap-1">
                                            <FaRupeeSign size={15} />
                                            {formatNumberWithCommas(totalCartPrice)}
                                        </h5>
                                    </div>
                                    <div className="flex justify-between text-lg">
                                        <p>Delivery Charges</p>
                                        <p className="font-bold flex items-center gap-1">
                                            <FaRupeeSign size={15} />
                                            40
                                        </p>
                                    </div>
                                    <div className="flex justify-between text-xl text-blue-700 dark:text-blue-500">
                                        <h5 className="font-extrabold">Grand Total</h5>
                                        <h5 className="font-extrabold flex items-center gap-1">
                                            <FaRupeeSign size={15} />
                                            {formatNumberWithCommas(totalCartPrice + 40)}
                                        </h5>
                                    </div>
                                    <div className="w-full flex justify-center">
                                        <Button className="Primary btnXl">Proceed To Checkout</Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col justify-center items-center gap-5">
                            <img className="w-2/5 h-auto object-cover" src={emptyCartImage} alt="Empty Cart" />
                            <h1 className="font-bold text-xl lg:text-4xl xl:text-4xl 2xl:text-4xl">Your Cart Is Empty</h1>
                            <p className="leading-7 text-xl font-medium text-center">Looks Like You Have Not Added Anything To Your Cart.Go Ahead & Explore Our Products</p>
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

export default Cart;
