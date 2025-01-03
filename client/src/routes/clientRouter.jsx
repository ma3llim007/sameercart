import React, { lazy } from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import ClientLayout from "../client/layouts/ClientLayout";
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
