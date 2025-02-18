import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Container } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaRupeeSign } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { Badge, Input, TextArea } from "@/components";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import Loader from "../components/Loader/Loader";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { BillingDetails } from "@/validation";
import { capitalizeWords, formatNumberWithCommas } from "@/utils";
import { Country, State } from "country-state-city";
import { upperCase } from "lodash";
import { Button } from "@/components/ui/button";
import useTopScroll from "../hooks/useTopScroll";
import { clearCart } from "@/features/home/cartSlice";
import logo from "@/client/assets/Logo.svg";

const CheckOut = () => {
    const { user } = useSelector(state => state.userAuth);
    const { carts, totalCartPrice } = useSelector(state => state.cart);
    const [selectedPayment, setSelectedPayment] = useState("cod");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue,
        setError,
    } = useForm({ mode: "onChange", resolver: yupResolver(BillingDetails) });

    // Fetching User Data
    const {
        data,
        isPending: DataIsPending,
        isSuccess,
    } = useQuery({
        queryKey: ["userData", user._id],
        queryFn: () => crudService.get("users/dashboard/", false),
        onError: err => {
            toastService.error(err?.message || "Failed to fetch Data.");
        },
        enabled: !!user._id,
    });
    const { firstName, lastName, email, username, phoneNumber, address } = data?.data || {};

    // Getting Country By Code
    const getCountryByCode = countryCode => {
        if (!countryCode) return null;
        return Country.getCountryByCode(countryCode.toUpperCase()).name;
    };

    // Getting State By Code
    const getStateByCode = (countryCode, stateCode) => {
        if (!countryCode || !stateCode) return null;
        const state = State.getStateByCodeAndCountry(stateCode.toUpperCase(), countryCode.toUpperCase());
        return state ? state.name : null;
    };

    // Sync profile and address data when `data` changes
    useEffect(() => {
        if (isSuccess && data?.data) {
            setValue("firstName", capitalizeWords(firstName));
            setValue("lastName", capitalizeWords(lastName));
            setValue("email", email);
            setValue("username", username);
            setValue("phoneNumber", phoneNumber);
            setValue("street", address?.street);
            setValue("city", capitalizeWords(address?.city));
            setValue("state", getStateByCode(address?.country, address?.state));
            setValue("country", getCountryByCode(address?.country));
            setValue("zipCode", address?.zip_code);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, setValue, data]);

    // const { mutate, isPending } = useMutation({
    //     mutationFn: data => {
    //         console.log(data);
    //         const formData = new FormData();
    //         const shippingAddress = {
    //             street: data.street,
    //             city: data.city,
    //             state: data.state,
    //             country: data.country,
    //             zip_code: data.zipCode,
    //         };
    //         const orderItems = carts.map(cart => ({
    //             productName: cart.name,
    //             price: cart.price,
    //             quantity: cart.quantity,
    //             totalPrice: cart.price * cart.quantity,
    //             productId: cart.id,
    //             ...(cart.variantId && { variantId: cart.variantId }),
    //         }));
    //         formData.append("shippingAddress", JSON.stringify(shippingAddress));
    //         formData.append("paymentStatus", "Pending");
    //         formData.append("orderStatus", "Pending");
    //         formData.append("paymentType", "COD");
    //         formData.append("totalAmount", Number(totalCartPrice) + 40);
    //         formData.append("orderItems", JSON.stringify(orderItems));
    //         formData.append("additionalInformation", data.additionalInformation || null);

    //         return crudService.post("order/order", false, formData);
    //     },
    //     onSuccess: data => {
    //         dispatch(clearCart());
    //         navigate("/account/dashboard");
    //         toastService.success(data?.message);
    //     },
    //     onError: error => {
    //         const message = error?.response?.data?.message || error?.message;
    //         setError("root", { message });
    //     },
    // });

    const loadScript = src => {
        return new Promise(resolve => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    // Cash On Delivery Mutatation
    const { mutate: createOrder, isPending: createOrderIsPending } = useMutation({
        mutationFn: data => crudService.post("order/create-order-cash", false, data),
        onSuccess: data => {
            dispatch(clearCart());
            navigate("/account/dashboard");
            toastService.success(data?.message);
        },
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            setError("root", { message });
        },
    });

    // Razorpay Mutatation
    const onPaymentRazorPay = async formData => {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
            alert("Razropay Failed To Load!!");
            return;
        }

        try {
            const option = {
                totalAmount: formData.totalAmount,
            };

            // creating a new order
            const newOrder = await crudService.post("/order/create-order-razorpay", false, option);
            if (!newOrder?.data || !newOrder.data.id) {
                alert("Server error. Are you online?");
                return;
            }

            //  Creating Razorpay payment instance
            const razorPayOptions = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: newOrder.data.amount,
                currency: "INR",
                name: "sameerCart.",
                description: `Purchase From sameerCart - Order #${newOrder.data.receipt.split("_").pop()}`,
                image: logo,
                orderId: newOrder.data.id,
                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    contact: formData.phoneNumber,
                },
                notes: {
                    address: "sameerCart",
                },
                theme: {
                    color: "#0562d6",
                },
                handler: async function (response) {
                    console.log("Payment successful", response);
                    // Check if payment details are missing
                    if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
                        console.error("❌ Missing Payment Data:", response);
                        alert("Payment failed or incomplete. Please try again.");
                        return;
                    }

                    // Prepare data for payment verification
                    const paymentData = {
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id,
                        razorpaySignature: response.razorpay_signature,
                    };
                    console.log(paymentData);
                    // Verify payment on the backend
                    try {
                        const result = await crudService.post("/order/verify-payment", false, paymentData);
                        console.log("Payment Verification Result:", result);
                        alert(result.data.msg);
                    } catch (error) {
                        console.error("Payment Verification Failed:", error);
                        alert("Payment verification failed. Please try again.");
                    }
                },
            };
            // Open Razorpay Payment Modal
            const paymentObject = new window.Razorpay(razorPayOptions);
            paymentObject.open();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmitForm = data => {
        const orderData = {
            ...data,
            orderItems: carts.map(cart => ({
                productName: cart.name,
                price: cart.price,
                quantity: cart.quantity,
                totalPrice: cart.price * cart.quantity,
                productId: cart.id,
                ...(cart.variantId && { variantId: cart.variantId }),
            })),
            shippingAddress: {
                street: data.street,
                city: data.city,
                state: data.state,
                country: data.country,
                zip_code: data.zipCode,
            },
            totalAmount: totalCartPrice + 40,
            paymentStatus: "Pending",
            orderStatus: "Pending",
            paymentType: selectedPayment === "cod" ? "COD" : "PayNow",
        };
        if (selectedPayment === "cod") {
            createOrder(orderData);
        } else {
            onPaymentRazorPay(orderData);
        }
    };
    useTopScroll(0, [createOrderIsPending]);
    if (DataIsPending || createOrderIsPending) return <Loader />;
    return (
        <>
            <section className="w-full mt-4 bg-gray-700 bg-opacity-70 py-4 px-5 rounded-md-md shadow-md select-none">
                <Breadcrumb className="text-white">
                    <BreadcrumbList className="text-lg">
                        <BreadcrumbItem className="flex items-center">
                            <Link className="flex items-center gap-2" to="/">
                                <FaHome /> Home
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Link className="flex items-center gap-2" to="/cart">
                                <FaBagShopping /> Cart
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{"Products"}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </section>
            <Container>
                <form onSubmit={handleSubmit(data => handleSubmitForm(data))}>
                    <section className="w-full my-5 grid grid-cols-1 lg:grid-cols-3 gap-4 select-none">
                        <div className="bg-zinc-300 dark:bg-gray-800 shadow-2xl rounded-lg p-3 h-fit col-span-2">
                            <h1 className="text-3xl font-bold text-center">Billing Details</h1>
                            <div className="bg-blue-100 border-l-8 border-blue-700 text-black p-4 rounded-md my-4 shadow-xl">
                                <p className="text-base">
                                    Your Billing Details Are Saved For Faster Checkout. If You Need To Update Your Information, Please Visit Your
                                    <Link to="/account/dashboard" className="font-medium text-blue-700 hover:text-blue-500 transition">
                                        {" "}
                                        Account Settings
                                    </Link>
                                    .
                                </p>
                            </div>
                            <div className="space-y-4">
                                {errors.root && (
                                    <div className="w-full my-4 bg-red-500 text-center rounded-md-md border border-red-600 py-3 px-4">
                                        <h4 className="text-white font-bold text-sm">{errors.root.message}</h4>
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-4 lg:gap-0">
                                    <div className="w-full lg:w-1/2 px-1">
                                        <Input
                                            label="First Name"
                                            {...register("firstName")}
                                            disabled
                                            readOnly
                                            placeholder="Enter Your First Name"
                                            className="w-full text-lg rounded-md-md px-3 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 cursor-auto"
                                            error={errors.firstName?.message}
                                        />
                                    </div>
                                    <div className="w-full lg:w-1/2 px-1">
                                        <Input
                                            label="Last Name"
                                            {...register("lastName")}
                                            placeholder="Enter Your Last Name"
                                            disabled
                                            readOnly
                                            className="w-full text-lg rounded-md px-3 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 cursor-auto"
                                            error={errors.lastName?.message}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-4 lg:gap-0">
                                    <div className="w-full lg:w-1/2 px-1">
                                        <Input
                                            label="Username"
                                            disabled
                                            readOnly
                                            {...register("username")}
                                            placeholder="Enter Your Username"
                                            className="w-full text-lg rounded-md px-3 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 cursor-auto"
                                            error={errors.username?.message}
                                        />
                                    </div>
                                    <div className="w-full lg:w-1/2 px-1">
                                        <Input
                                            label="E-Mail"
                                            disabled
                                            readOnly
                                            placeholder="Enter Your E-Mail"
                                            {...register("email")}
                                            className="w-full text-lg rounded-md px-3 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 cursor-auto"
                                            error={errors.email?.message}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-4 lg:gap-0">
                                    <div className="w-full lg:w-1/2 px-1">
                                        <Input
                                            label="Phone Number"
                                            disabled
                                            readOnly
                                            {...register("phoneNumber")}
                                            placeholder="Enter Your Phone Number"
                                            className="w-full text-lg rounded-md px-3 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 cursor-auto"
                                            error={errors.phoneNumber?.message}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-4 lg:gap-0">
                                    <div className="w-full lg:w-1/2 px-1 flex-grow">
                                        <Input
                                            label="Street"
                                            disabled
                                            readOnly
                                            placeholder="Enter Your Street"
                                            className={`w-full text-lg rounded px-3 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 cursor-auto`}
                                            {...register("street")}
                                            error={errors.street?.message}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-4 lg:gap-0">
                                    <div className="w-full lg:w-1/2 px-1">
                                        <Input
                                            label="City"
                                            disabled
                                            readOnly
                                            placeholder="Enter Your City"
                                            {...register("city")}
                                            className="w-full text-lg rounded-md px-3 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 cursor-auto"
                                            error={errors.city?.message}
                                        />
                                    </div>
                                    <div className="w-full lg:w-1/2 px-1">
                                        <Input
                                            label="State"
                                            disabled
                                            readOnly
                                            {...register("state")}
                                            placeholder="Enter Your State"
                                            className="w-full text-lg rounded-md px-3 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 cursor-auto"
                                            error={errors.state?.message}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-4 lg:gap-0">
                                    <div className="w-full lg:w-1/2 px-1">
                                        <Input
                                            label="Country"
                                            disabled
                                            readOnly
                                            {...register("country")}
                                            placeholder="Enter Your Country"
                                            className="w-full text-lg rounded-md px-3 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 cursor-auto"
                                            error={errors.country?.message}
                                        />
                                    </div>
                                    <div className="w-full lg:w-1/2 px-1">
                                        <Input
                                            label="Zip Code"
                                            disabled
                                            readOnly
                                            placeholder="Enter Your Zip Code"
                                            {...register("zipCode")}
                                            className="w-full text-lg rounded-md px-3 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 cursor-auto"
                                            error={errors.zipCode?.message}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-4 lg:gap-0">
                                    <div className="w-full lg:w-1/2 px-1 flex-grow">
                                        <TextArea
                                            label="Additional Information"
                                            placeholder="Notes About Your Order, e.g. Special Notes For Delivery"
                                            className={`w-full text-lg rounded px-3 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 cursor-auto`}
                                            {...register("additionalNotes")}
                                            error={errors.additionalNotes?.message}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-purple-200 dark:bg-gray-700 text-black dark:text-white shadow-2xl rounded-lg p-5 h-fit">
                            <h1 className="text-3xl font-bold text-center mb-3">Your Order</h1>
                            <div className="flex flex-col p-6 lg:p-5">
                                <div className="flex justify-between items-center text-lg font-bold mb-3">
                                    <h5>Product</h5>
                                    <h5>Total</h5>
                                </div>
                                <hr className="my-2" />
                                <div className="flex flex-col">
                                    {carts?.map((cart, idx) => (
                                        <div key={cart.id + idx} className="flex justify-between items-start gap-4 py-4 border-b border-gray-300 border-opacity-50 last:border-none">
                                            <div className="text-base font-medium">
                                                <p>
                                                    {capitalizeWords(cart.name)} X {cart.quantity}
                                                </p>
                                                {cart.attributes?.map(attribute => (
                                                    <Badge key={attribute?._id} title={`${capitalizeWords(attribute.name)}: ${upperCase(attribute.value)}`} className="Primary max-w-fit my-2" />
                                                ))}
                                            </div>
                                            <div className="text-lg font-medium flex items-center">
                                                <FaRupeeSign size={14} />
                                                {formatNumberWithCommas(cart.price * cart.quantity)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <hr className="my-3" />
                                <div className="flex justify-between items-center text-lg">
                                    <p className="font-extrabold">Delivery Charges</p>
                                    <p className="font-bold flex items-center">
                                        <FaRupeeSign size={14} />
                                        40
                                    </p>
                                </div>
                                <hr className="my-3" />
                                <div className="flex justify-between text-lg">
                                    <h5 className="font-extrabold">Grand Total</h5>
                                    <h5 className="font-extrabold flex items-center text-blue-700 dark:text-blue-400">
                                        <FaRupeeSign size={14} />
                                        {formatNumberWithCommas(totalCartPrice + 40)}
                                    </h5>
                                </div>
                                <hr className="my-4" />
                                <div className="w-full">
                                    <h6 className="font-bold text-lg mb-3">Select Payment Method</h6>
                                    <div className="flex flex-col gap-4">
                                        {[
                                            { id: "cod", label: "Cash On Delivery", description: "Pay With Cash When You Receive The Order", accent: "green" },
                                            { id: "pay_now", label: "Pay Now", description: "Secure Online Payment Using A Credit/Debit Card", accent: "blue" },
                                        ].map(({ id, label, description, accent }) => (
                                            <label key={id} className="flex items-center gap-3 border p-4 rounded-lg cursor-pointer hover:shadow-md">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={id}
                                                    checked={selectedPayment === id}
                                                    onChange={() => setSelectedPayment(id)}
                                                    className={`w-5 h-5 accent-${accent}-600`}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-base font-medium">{label}</span>
                                                    <span className="text-sm">{description}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="mt-5">
                                        {selectedPayment === "cod" ? (
                                            <Button type="submit" className="Success btnFull">
                                                Place Order
                                            </Button>
                                        ) : (
                                            <Button className="Primary btnFull">Pay Now</Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </form>
            </Container>
        </>
    );
};

export default CheckOut;
