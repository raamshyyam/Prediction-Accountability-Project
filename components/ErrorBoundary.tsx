import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    name?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`ErrorBoundary caused by ${this.props.name || 'component'}:`, error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
                    <h3 className="text-red-800 font-bold mb-2">Something went wrong</h3>
                    <p className="text-red-600 text-sm mb-4">We encountered an error displaying this section.</p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700"
                    >
                        Try Again
                    </button>
                    {process.env.NODE_ENV === 'development' && (
                        <pre className="mt-4 text-xs text-left bg-red-100 p-2 overflow-auto max-h-40">
                            {this.state.error?.toString()}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
