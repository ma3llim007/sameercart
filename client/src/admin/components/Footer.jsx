import { currentYear } from "@/utils";
import React from "react";

const Footer = () => {
    return (
        <footer className="border-t px-4 py-4 bg-muted/50 text-center">
            <div className="text-base font-bold text-muted-foreground">© {currentYear()} SameerCart. All rights reserved.</div>
        </footer>
    );
};

export default Footer;
