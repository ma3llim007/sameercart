import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "../context/themeProvider";

export function ModeToggle() {
    const { setTheme, theme } = useTheme();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="link" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="bg-light-bgWhite text-light-textDarkGray dark:bg-dark-deep dark:text-dark-textWhite border-none"
                align="end"
            >
                <DropdownMenuItem
                    className={`cursor-pointer
                        ${
                            theme === "light" &&
                            "bg-light-blue text-light-textWhite font-bold shadow cursor-pointer"
                        }`}
                    onClick={() => setTheme("light")}
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all mr-2" />
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem
                    className={`cursor-pointer
                            ${theme === "dark" && "bg-dark-dark font-bold shadow cursor-pointer"}
                        `}
                    onClick={() => setTheme("dark")}
                >
                    <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all mr-2" />
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                    className={`cursor-pointer
                        ${
                            theme === "system" &&
                            "bg-light-deep dark:bg-dark-dark font-bold shadow cursor-pointer"
                        }`}
                    onClick={() => setTheme("system")}
                >
                    <Monitor className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all mr-2" />
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
