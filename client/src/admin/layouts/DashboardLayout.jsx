import React from 'react';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    return (
        <div>
            <h1>Admin Header</h1>
            <h1>Admin Aside</h1>
            <Outlet/>
            <h1>Admin Footer</h1>
        </div>
    );
};

export default DashboardLayout;
