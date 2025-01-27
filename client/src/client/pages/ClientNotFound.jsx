import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ClientNotFound = () => {
    return (
        <section className="w-full h-full flex flex-col justify-center items-center leading-10 py-20 px-5 text-center">
            <h1 className="font-extrabold text-9xl mb-1">404</h1>
            <h2 className="font-bold text-xl mb-3 lg:text-4xl xl:text-4xl 2xl:text-4xl">
                The Page You're Looking For Can't Found
            </h2>
            <p className="leading-7 text-base font-medium mb-4">
                You didn't break the internet, but we can't find what you are
                looking for.
            </p>
            <Link to={"/"}>
                <Button className="Primary btnXl">Back To Home</Button>
            </Link>
        </section>
    );
};

export default ClientNotFound;
