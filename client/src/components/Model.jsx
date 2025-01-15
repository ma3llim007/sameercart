import { useEffect } from "react";
import ReactDOM from "react-dom";
import { FaTimes } from "react-icons/fa";
import { Button } from "./ui/button";

const Model = ({ isOpen, onClose, title, children, disabled }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-scroll">
            <div className="bg-light-bgWhite text-light-textDarkGray dark:bg-dark-bgDark dark:text-dark-textWhite rounded-xl shadow-2xl w-11/12 max-w-lg transform transition-all scale-100 md:scale-105">
                <div className="flex justify-between items-center border-b px-6 py-1">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <Button
                        onClick={onClose}
                        className="p-2"
                        aria-label="Close"
                        disabled={disabled}
                    >
                        <FaTimes size={25} />
                    </Button>
                </div>
                <div className="p-2">{children}</div>
            </div>
        </div>,
        document.getElementById("model-root")
    );
};

export default Model;
