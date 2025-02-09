import { Button } from "@/components/ui/button";
import { FaGithub, FaGoogle } from "react-icons/fa";

const OAuthButtons = ({ isRegister, isPending }) => {
    // Login With Google
    const handleGoogleLogin = () => {
        window.open(`${import.meta.env.VITE_ADMIN_FRONTEND_URL}users/auth/google`, "_self");
    };

    // Login With GitHub
    const handleGitHubLogin = () => {
        window.open(`${import.meta.env.VITE_ADMIN_FRONTEND_URL}users/auth/github`, "_self");
    };

    return (
        <div className="flex flex-wrap justify-center gap-4">
            <Button
                className="flex items-center gap-2 bg-red-600 text-white p-3 rounded-lg shadow-md transition-all duration-300 hover:bg-red-700 hover:scale-105 text-base"
                onClick={handleGoogleLogin}
                disabled={isPending}
            >
                <FaGoogle className="text-2xl" /> {isRegister ? "Register" : "Login"} With Google
            </Button>
            <Button
                className="flex items-center gap-2 bg-purple-700 text-white p-3 rounded-lg shadow-md transition-all duration-300 hover:bg-purple-600 hover:scale-105 text-base"
                onClick={handleGitHubLogin}
                disabled={isPending}
            >
                <FaGithub className="text-2xl" /> {isRegister ? "Register" : "Login"} With GitHub
            </Button>
        </div>
    );
};

export default OAuthButtons;
