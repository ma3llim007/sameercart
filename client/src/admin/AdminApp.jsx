import { RouterProvider } from "react-router-dom";
import adminRouters from "../routes/adminRouter";

const AdminApp = () => {
    return <RouterProvider router={adminRouters} />;
};

export default AdminApp;
