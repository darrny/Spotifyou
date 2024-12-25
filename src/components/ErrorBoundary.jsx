import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4">
          <Alert variant="destructive">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              {this.state.error?.message || 'An unexpected error occurred'}
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// LoadingSpinner component
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="w-8 h-8 border-4 border-t-green-500 border-green-200 rounded-full animate-spin"></div>
  </div>
);