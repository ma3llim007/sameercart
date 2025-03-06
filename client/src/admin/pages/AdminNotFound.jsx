import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const AdminNotFound = () => {
    return (
        <>
            <Helmet>
                <title>404 - Page Not Found | Admin Panel</title>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="description" content="The page you are looking for does not exist in the admin panel." />
                <meta property="og:title" content="404 - Page Not Found" />
                <meta property="og:description" content="This page does not exist in the admin panel. Please return to the dashboard." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
            </Helmet>

            <section className="w-full h-full bg-white dark:bg-slate-950 flex flex-col justify-center items-center leading-10 py-20 px-5 text-center">
                <h1 className="font-extrabold text-9xl mb-1">404</h1>
                <h2 className="font-bold text-xl mb-3 lg:text-4xl xl:text-4xl 2xl:text-4xl">The Page You&apos;re Looking For Can&apos;t Found!</h2>
                <p className="leading-7 text-base font-medium mb-4">You didn&apos;t break the internet, but we can&apos;t find what you are looking for.</p>
                <Link to={"/admin/dashboard"}>
                    <Button className="Primary btn2xl">Back To Dashboard</Button>
                </Link>
            </section>
        </>
    );
};

export default AdminNotFound;
