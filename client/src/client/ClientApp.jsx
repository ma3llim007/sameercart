import { Button, buttonVariants } from '@/components/ui/button';
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import clientRouters from './routes/clientRouter';

const ClientApp = () => {
    return (
        <div>
            <RouterProvider router={clientRouters} />
        </div>
    );
};

export default ClientApp;
