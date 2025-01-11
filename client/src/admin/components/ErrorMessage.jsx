const ErrorMessage = ({ message }) => {
    return (
        <section className="w-4/5 flex justify-center items-center mx-auto mt-10 bg-red-500 border-4 border-red-600 p-7 rounded-xl">
            <h1 className="text-2xl font-bold underline select-none">
                {message}
            </h1>
        </section>
    );
};

export default ErrorMessage;
