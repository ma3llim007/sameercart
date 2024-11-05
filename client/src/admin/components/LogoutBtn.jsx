import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { adminLogOut } from "../services/authService";
import { Button } from "@/components/ui/button";
import { logout } from "../context/authSlice";
import toastService from "@/services/toastService";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const LogoutBtn = () => {
    const dispatch = useDispatch();
    const { admin } = useSelector(state => state.auth);

    const { mutate } = useMutation({
        mutationFn: adminLogOut,
        onSuccess: data => {
            dispatch(logout());
            toastService.info(data?.message);
        },
        onError: error => {
            throw Error("Something Went Wrong While Log-Out", error);
        },
    });

    const logoutHandler = () => {
        if (admin?._id) {
            mutate(admin?._id);
        }
    };
    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className="Danger">Logout</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white dark:bg-slate-950">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to log out? This will end your current session.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="Danger" onClick={logoutHandler}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default LogoutBtn;
