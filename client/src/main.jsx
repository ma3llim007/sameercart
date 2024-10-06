import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import "swiper/css"
import AdminApp from './admin/AdminApp';
import ClientApp from './client/ClientApp';

const pathName = window.location.pathname;
const isAdmin = pathName.startsWith('/admin');

createRoot(document.getElementById('root')).render(
    <StrictMode>{isAdmin ? <AdminApp /> : <ClientApp />}</StrictMode>
);
