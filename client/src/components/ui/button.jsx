import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
                outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                primary: "bg-light-blue text-white shadow-sm hover:bg-light-blue/60 transition-all ease-in-out duration-200 delay-75",
                primary2:
                    "bg-light-bgWhite text-black shadow-sm hover:bg-light-blue/80 hover:text-white hover:bg-light-blue/60 transition-all ease-in-out duration-200 delay-75",
                adBtn: "bg-gray-200 hover:bg-gray-500 text-gray-800 p-2 rounded ease-in-out duration-200 shadow-sm hover:text-white",
                adPrimary: "bg-blue-700 hover:bg-blue-800 text-white ease-in-out duration-200 font-semibold shadow-sm",
                adSecondary: "bg-gray-500 hover:bg-gray-600 text-white font-semibold ease-in-out duration-200 shadow-sm",
                adSuccess: "bg-green-500 hover:bg-green-600 text-white font-semibold ease-in-out duration-200 shadow-sm",
                adDanger: "bg-red-500 hover:bg-red-600 text-white font-semibold ease-in-out duration-200 shadow-sm",
                adWarning: "bg-yellow-500 hover:bg-yellow-600 text-white font-semibold ease-in-out duration-200 shadow-sm",
                adInfo: "bg-teal-500 hover:bg-teal-600 text-white font-semibold ease-in-out duration-200 shadow-sm",
                adLight: "bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold ease-in-out duration-200 shadow-sm",
                adDark: "bg-gray-800 hover:bg-gray-700 text-white font-semibold ease-in-out duration-200 shadow-sm",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 py-1 text-xs",
                md: "text-base px-4 py-2",
                lg: "text-lg px-5 py-3 rounded-md",
                xl: "h-16 rounded px-16 text-xl font-bold",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
