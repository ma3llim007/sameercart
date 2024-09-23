import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import { AdminNotFound, AdminProfile, Dashboard } from '../pages';

const adminRouters = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/admin-profile" element={<AdminProfile />} />
            <Route path="*" element={<AdminNotFound />} />
        </Route>
    )
);

export default adminRouters;
