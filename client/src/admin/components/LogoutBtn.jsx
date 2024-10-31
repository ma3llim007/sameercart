import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
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
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { mutate } = useMutation({
        mutationFn: adminLogOut,
        onSuccess: data => {
            dispatch(logout());
            toastService.info("Admin Logout Successfully");
            setIsDialogOpen(false);
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
                    <Button className="adDanger">Logout</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to log out? This will end your current session.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="adDanger" onClick={logoutHandler}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default LogoutBtn;