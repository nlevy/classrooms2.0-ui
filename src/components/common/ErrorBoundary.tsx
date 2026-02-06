import { Component, type ReactNode, type ErrorInfo } from 'react';
import i18n from '../../i18n';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="text-4xl text-red-400">!</div>
          <h2 className="text-xl font-semibold text-gray-800">
            {i18n.t('errorBoundaryTitle')}
          </h2>
          <p className="max-w-md text-sm text-gray-600">
            {i18n.t('errorBoundaryMessage')}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {i18n.t('reload')}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
