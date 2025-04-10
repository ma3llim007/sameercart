import { Component } from "react";
import { AlertTriangle } from "lucide-react"; // Using Lucide icons for a modern look

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, errorMessage: error.message };
    }

    handleReset = () => {
        this.setState({ hasError: false, errorMessage: "" });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gray-100 dark:bg-gray-900">
                    <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center border border-gray-200 dark:border-gray-700">
                        <AlertTriangle className="text-red-500 w-14 h-14 mx-auto animate-bounce" />
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-4">Oops! Something Went Wrong.</h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">We Encountered An Error While Loading The Page. Please Try Again.</p>
                        <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-transform transform hover:scale-105" onClick={this.handleReset}>
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
