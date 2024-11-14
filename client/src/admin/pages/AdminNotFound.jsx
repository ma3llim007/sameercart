import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";

const AdminNotFound = () => {
    return (
        <section className="w-full h-full bg-white dark:bg-slate-950 flex flex-col justify-center items-center leading-10 py-20 px-5 text-center">
            <h1 className="font-extrabold text-9xl mb-1">404</h1>
            <h2 className="font-bold text-xl mb-3 lg:text-4xl xl:text-4xl 2xl:text-4xl">The Page You're Looking For Can't Found!</h2>
            <p className="leading-7 text-base font-medium mb-4">You didn't break the internet, but we can't find what you are looking for.</p>
            <Link to={"/admin/dashboard"}>
                <Button className="Primary btn2xl">Back To Dashboard</Button>
            </Link>
        </section>
    );
};

export default AdminNotFound;
