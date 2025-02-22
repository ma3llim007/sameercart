import { lazy, Suspense } from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import ClientLayout from "../client/layouts/ClientLayout";
import Loader from "@/client/components/Loader/Loader";
import ProtectedRoute from "@/client/layouts/ProtectedRoute";

const Home = lazy(() => import("../client/pages/Home"));
const AboutUs = lazy(() => import("../client/pages/AboutUs"));
const ContactUs = lazy(() => import("../client/pages/ContactUs"));
const TermsAndCondition = lazy(() => import("../client/pages/TermsAndCondition"));
const MyAccount = lazy(() => import("../client/pages/MyAccount"));
const CheckOut = lazy(() => import("../client/pages/CheckOut"));
const Login = lazy(() => import("../client/pages/Login"));
const ClientNotFound = lazy(() => import("../client/pages/ClientNotFound"));
const Delivery = lazy(() => import("../client/pages/Delivery"));
const SecurePayment = lazy(() => import("../client/pages/SecurePayment"));
const LegalNotice = lazy(() => import("../client/pages/LegalNotice"));
const ReturnPolicy = lazy(() => import("../client/pages/ReturnPolicy"));
const PrivacyPolicy = lazy(() => import("../client/pages/PrivacyPolicy"));
const AllCategory = lazy(() => import("../client/pages/AllCategory"));
const SubCategory = lazy(() => import("../client/pages/SubCategory"));
const Products = lazy(() => import("../client/pages/Products"));
const ProductDetails = lazy(() => import("../client/pages/ProductDetails"));
const ProductReview = lazy(() => import("../client/pages/ProductReview"));
const Cart = lazy(() => import("../client/pages/Cart"));
const WishList = lazy(() => import("../client/pages/WishList"));
const Register = lazy(() => import("../client/pages/Register"));
const VerifyEmail = lazy(() => import("../client/pages/VerifyEmail"));
const ForgotPassword = lazy(() => import("../client/pages/ForgotPassword"));
const ResetPasswordConfirm = lazy(() => import("../client/pages/ResetPasswordConfirm"));
const OAuthSuccess = lazy(() => import("../client/pages/OAuthSuccess"));

// Client Router
const clientRouters = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<ClientLayout />}>
            <Route
                index
                path=""
                element={
                    <Suspense fallback={<Loader />}>
                        <Home />
                    </Suspense>
                }
            />
            <Route
                path="/about-us"
                element={
                    <Suspense fallback={<Loader />}>
                        <AboutUs />
                    </Suspense>
                }
            />
            <Route
                path="/delivery"
                element={
                    <Suspense fallback={<Loader />}>
                        <Delivery />
                    </Suspense>
                }
            />
            <Route
                path="/secure-payment"
                element={
                    <Suspense fallback={<Loader />}>
                        <SecurePayment />
                    </Suspense>
                }
            />
            <Route
                path="/legal-notice"
                element={
                    <Suspense fallback={<Loader />}>
                        <LegalNotice />
                    </Suspense>
                }
            />
            <Route
                path="/return-policy"
                element={
                    <Suspense fallback={<Loader />}>
                        <ReturnPolicy />
                    </Suspense>
                }
            />
            <Route
                path="/contact-us"
                element={
                    <Suspense fallback={<Loader />}>
                        <ContactUs />
                    </Suspense>
                }
            />
            <Route
                path="/terms-and-conditions"
                element={
                    <Suspense fallback={<Loader />}>
                        <TermsAndCondition />
                    </Suspense>
                }
            />
            <Route
                path="/privacy-policy"
                element={
                    <Suspense fallback={<Loader />}>
                        <PrivacyPolicy />
                    </Suspense>
                }
            />
            <Route
                path="/category"
                element={
                    <Suspense fallback={<Loader />}>
                        <AllCategory />
                    </Suspense>
                }
            />
            <Route
                path="/sub-category/:categorySlug"
                element={
                    <Suspense fallback={<Loader />}>
                        <SubCategory />
                    </Suspense>
                }
            />
            <Route
                path="/:categorySlug/:subCategorySlug/products"
                element={
                    <Suspense fallback={<Loader />}>
                        <Products />
                    </Suspense>
                }
            />
            <Route
                path="/product-details/:productSlug"
                element={
                    <Suspense fallback={<Loader />}>
                        <ProductDetails />
                    </Suspense>
                }
            />
            <Route
                path="/create-review/:productId"
                element={
                    <Suspense fallback={<Loader />}>
                        <ProductReview />
                    </Suspense>
                }
            />
            <Route
                path="/cart"
                element={
                    <Suspense fallback={<Loader />}>
                        <Cart />
                    </Suspense>
                }
            />
            <Route
                path="/wishlist"
                element={
                    <Suspense fallback={<Loader />}>
                        <WishList />
                    </Suspense>
                }
            />
            <Route
                path="/register"
                element={
                    <Suspense fallback={<Loader />}>
                        <Register />
                    </Suspense>
                }
            />
            <Route
                path="/login"
                element={
                    <Suspense fallback={<Loader />}>
                        <Login />
                    </Suspense>
                }
            />
            <Route
                path="/verify-email"
                element={
                    <Suspense fallback={<Loader />}>
                        <VerifyEmail />
                    </Suspense>
                }
            />
            <Route
                path="/forgot-password"
                element={
                    <Suspense fallback={<Loader />}>
                        <ForgotPassword />
                    </Suspense>
                }
            />
            <Route
                path="/reset-password-confirm/:userId/:token"
                element={
                    <Suspense fallback={<Loader />}>
                        <ResetPasswordConfirm />
                    </Suspense>
                }
            />
            <Route
                path="/oauth-success/:userId"
                element={
                    <Suspense fallback={<Loader />}>
                        <OAuthSuccess />
                    </Suspense>
                }
            />
            <Route
                path="*"
                element={
                    <Suspense fallback={<Loader />}>
                        <ClientNotFound />
                    </Suspense>
                }
            />
            {/* PROTECTED ROUTES */}
            <Route path="/account" element={<ProtectedRoute />}>
                <Route
                    path="dashboard"
                    element={
                        <Suspense fallback={<Loader />}>
                            <MyAccount />
                        </Suspense>
                    }
                />
                <Route
                    path="checkout"
                    element={
                        <Suspense fallback={<Loader />}>
                            <CheckOut />
                        </Suspense>
                    }
                />
            </Route>
        </Route>
    )
);
export default clientRouters;
