import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";

const GoogleAuthBtn = ({ isPending, isRegister }) => {
    // Login With Google
    const handleGoogleLogin = () => {
        window.open(`${import.meta.env.VITE_ADMIN_FRONTEND_URL}users/auth/google`, "_self");
    };

    return (
        <Button
            className="flex items-center gap-2 bg-red-600 text-white p-3 rounded-lg shadow-md transition-all duration-300 hover:bg-red-700 hover:scale-105 text-base"
            onClick={handleGoogleLogin}
            disabled={isPending}
        >
            <FaGoogle className="text-2xl" /> {isRegister ? "Register" : "Login"} With Google
        </Button>
    );
};

export default GoogleAuthBtn;
