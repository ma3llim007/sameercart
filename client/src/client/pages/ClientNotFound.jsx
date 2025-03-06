import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const ClientNotFound = () => {
    return (
        <>
            <Helmet>
                <title>Page Not Found - SameerCart</title>
                <meta name="description" content="Oops! The page you are looking for does not exist. Return to SameerCart and continue shopping." />
                <meta name="keywords" content="404, page not found, error page, missing page, SameerCart" />
                <meta property="og:title" content="Page Not Found - SameerCart" />
                <meta property="og:description" content="The page you requested could not be found. Visit our homepage to continue shopping." />
                <meta property="og:url" content="https://sameercart.com/404" />
                <meta name="robots" content="noindex, follow" />
            </Helmet>
            <section className="w-full h-full flex flex-col justify-center items-center leading-10 py-20 px-5 text-center">
                <h1 className="font-extrabold text-9xl mb-1">404</h1>
                <h2 className="font-bold text-xl mb-3 lg:text-4xl xl:text-4xl 2xl:text-4xl">The Page You&apos;re Looking For Can&apos;t Found</h2>
                <p className="leading-7 text-base font-medium mb-4">You didn&apos;t break the internet, but we can&apos;t find what you are looking for.</p>
                <Link to={"/"}>
                    <Button className="Primary btnXl">Back To Home</Button>
                </Link>
            </section>
        </>
    );
};

export default ClientNotFound;
