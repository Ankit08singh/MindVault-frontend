import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("ErrorBoundary caught:", error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-[#CCC098] to-[#9EA58D] p-6">
                    <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 max-w-md w-full text-center shadow-lg border border-[#B4BEC9]/30">
                        <h2 className="text-2xl font-semibold text-[#002333] mb-3">
                            Something went wrong
                        </h2>
                        <p className="text-[#002333]/60 mb-6 text-sm">
                            An unexpected error occurred. Please try again.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="px-5 py-2 bg-[#002333] text-white rounded-lg hover:bg-[#002333]/80 transition-colors text-sm font-medium"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.href = '/dashboard'}
                                className="px-5 py-2 border border-[#B4BEC9]/40 text-[#002333] rounded-lg hover:bg-[#B4BEC9]/10 transition-colors text-sm font-medium"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
