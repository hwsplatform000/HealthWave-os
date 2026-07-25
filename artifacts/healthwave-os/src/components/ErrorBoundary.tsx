import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-6 text-destructive">
          <div className="text-center">
            <h1 className="text-xl font-bold">Something went wrong</h1>
            <p className="mt-2 text-muted-foreground">
              Please refresh the page or try again later.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
