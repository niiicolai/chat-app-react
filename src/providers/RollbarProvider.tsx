import { JSX } from 'react';
import { Provider, ErrorBoundary } from '@rollbar/react';

const environment = import.meta.env.VITE_ENVIRONMENT || 'development';
const accessToken = import.meta.env.VITE_ROLLBAR_CLIENT_ITEM_ACCESS_TOKEN;

const rollbarConfig = {
    accessToken,
    captureUncaught: true, // Capture uncaught exceptions
    captureUnhandledRejections: true, // Capture unhandled promise rejections
    environment,
};

/**
 * @interface RollbarProviderProps
 * @description The rollbar provider props
 */
interface RollbarProviderProps {
    slot: JSX.Element;
}

/**
 * @function RollbarProvider
 * @description The rollbar provider
 * @param {RollbarProviderProps} props - The props
 * @returns {JSX.Element} JSX.Element
 */
function RollbarProvider(props: RollbarProviderProps): JSX.Element {
    const { slot } = props;

    return (
        <Provider config={rollbarConfig}>
            <ErrorBoundary>
                {slot}
            </ErrorBoundary>
        </Provider>
    );
}

export default RollbarProvider;
