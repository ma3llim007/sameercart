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
import { Button } from "@/components/ui/button";

const ButtonWithAlert = ({
    buttonTitle,
    buttonColor = "Danger",
    dialogTitle,
    dialogDesc,
    dialogCancelTitle = "Cancel",
    dialogActionTitle = "Continue",
    dialogActionBtnColor = "Primary",
    dialogActionfn,
}) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className={buttonColor}>{buttonTitle}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white dark:bg-slate-950">
                <AlertDialogHeader>
                    <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
                    {dialogDesc && <AlertDialogDescription>{dialogDesc}</AlertDialogDescription>}
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-2">
                    <AlertDialogCancel>{dialogCancelTitle}</AlertDialogCancel>
                    <AlertDialogAction onClick={dialogActionfn} className={dialogActionBtnColor}>
                        {dialogActionTitle}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ButtonWithAlert;
