import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";

const GitHubAuthBtn = ({ isPending, isRegister }) => {
    // Login With GitHub
    const handleGitHubLogin = () => {
        window.open(`${import.meta.env.VITE_ADMIN_FRONTEND_URL}users/auth/github`, "_self");
    };
    return (
        <Button
            className="flex items-center gap-2 bg-purple-700 text-white p-3 rounded-lg shadow-md transition-all duration-300 hover:bg-purple-600 hover:scale-105 text-base"
            onClick={handleGitHubLogin}
            disabled={isPending}
        >
            <FaGithub className="text-2xl" /> {isRegister ? "Register" : "Login"} With GitHub
        </Button>
    );
};

export default GitHubAuthBtn;
