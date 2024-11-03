import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const useAuthRedirect = () => {
    const navigate = useNavigate();
    const { status: authStatus, admin } = useSelector(state => state.auth);

    useEffect(() => {
        if (!authStatus || !admin || !admin.asOwnerShip) {
            navigate("/admin/auth/login", { replace: true });
        }
    }, [authStatus, admin, navigate]);

    return { authStatus, admin };
};

export default useAuthRedirect;
