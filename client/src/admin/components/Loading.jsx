const Loading = ({ weight = "14", height = "14" }) => {
    return (
        <div className="mx-8 my-4">
            <div className={`w-${weight} h-${height} border-4 border-solid border-blue-500 border-t-transparent rounded-full animate-spin`}></div>
        </div>
    );
};

export default Loading;
