"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="card-surface mx-auto max-w-md p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-rose-950/40 ring-1 ring-rose-800/50">
              <span className="text-2xl text-rose-400">!</span>
            </div>
            <h2 className="mt-4 font-display text-lg font-bold text-white">Something went wrong</h2>
            <p className="mt-2 text-sm text-alliance-muted">{this.state.error?.message || "An unexpected error occurred."}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-primary mt-6"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
