import { useRef, useState } from "react";

const OtpInput = ({ length = 6, onOtpSubmit = () => {} }) => {
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRefs = useRef([]);

    const handleChange = (index, e) => {
        const value = e.target.value;

        const newOtp = [...otp];
        // Allow Only One Input
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move focus to the next empty input field
        const nextEmptyIndex = newOtp.findIndex(num => num === "");
        if (value && index < length - 1 && nextEmptyIndex !== -1) {
            inputRefs.current[nextEmptyIndex]?.focus();
        }

        // Submit OTP
        onOtpSubmit(newOtp.join(""));
    };

    const handleClick = index => {
        inputRefs.current[index].setSelectionRange(1, 1);

        // If clicked on an empty field while previous fields are empty, focus the first empty one
        if (index > 0 && !otp[index - 1]) {
            const firstEmptyIndex = otp.findIndex(num => num === "");
            inputRefs.current[firstEmptyIndex]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace") {
            if (otp[index]) {
                // Clear the current input first
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
            } else if (index > 0) {
                // Move focus to the previous input
                inputRefs.current[index - 1]?.focus();
            }
        }
    };
    return (
        <div className="mx-auto">
            {otp.map((value, index) => {
                return (
                    <input
                        key={index}
                        type="text"
                        ref={input => (inputRefs.current[index] = input)}
                        value={value}
                        onChange={e => handleChange(index, e)}
                        onClick={() => handleClick(index)}
                        onKeyDown={e => handleKeyDown(index, e)}
                        className="w-14 h-14 text-lg rounded px-3 py-3 m-2 border border-gray-600 !bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                );
            })}
        </div>
    );
};

export default OtpInput;
