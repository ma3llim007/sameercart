import React from 'react';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from 'react-router-dom';
import ClientLayout from '../layouts/ClientLayout';
import {
    AboutUs,
    ClientNotFound,
    ContactUs,
    Home,
    TermsAndCondition,
} from '../pages';

// Client Router
const clientRouters = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<ClientLayout />}>
            <Route path='' element={<Home />} />
            <Route exact path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route
                path="/terms-and-conditions"
                element={<TermsAndCondition />}
            />
            <Route path="*" element={<ClientNotFound />} />
        </Route>
    )
);
export default clientRouters;
