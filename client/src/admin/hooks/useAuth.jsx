import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const useAuth = () => {
    const navigate = useNavigate();
    const { status, admin, accessToken } = useSelector(state => state.auth);
    console.log(status, admin, accessToken);
    

    useEffect(() => {
        if (!status || !admin || !admin.asOwnerShip || !accessToken) {
            navigate("/admin/auth/login", { replace: true });
        }
    }, [admin, status, accessToken]);

    return { admin, status, accessToken };
};

export default useAuth;
