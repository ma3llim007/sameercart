import React, { lazy } from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import ClientLayout from "../layouts/ClientLayout";
const Home = lazy(() => import("../pages/Home"));
const AboutUs = lazy(() => import("../pages/AboutUs"));
const ContactUs = lazy(() => import("../pages/ContactUs"));
const TermsAndCondition = lazy(() => import("../pages/TermsAndCondition"));
const MyAccount = lazy(() => import("../pages/MyAccount"));
const CheckOut = lazy(() => import("../pages/CheckOut"));
const Login = lazy(() => import("../pages/Login"));
const ClientNotFound = lazy(() => import("../pages/ClientNotFound"));
const Delivery = lazy(() => import("../pages/Delivery"));
const SecurePayment = lazy(() => import("../pages/SecurePayment"));
const LegalNotice = lazy(() => import("../pages/LegalNotice"));
const ReturnPolicy = lazy(() => import("../pages/ReturnPolicy"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
// Client Router
const clientRouters = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<ClientLayout />}>
            <Route index path="" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/secure-payment" element={<SecurePayment />} />
            <Route path="/legal-notice" element={<LegalNotice />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/terms-and-conditions" element={<TermsAndCondition />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/checkout" element={<CheckOut />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<ClientNotFound />} />
        </Route>
    )
);
export default clientRouters;
