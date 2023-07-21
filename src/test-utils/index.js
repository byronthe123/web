import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { Provider as ReduxProvider } from 'react-redux';
import { configureStore } from '../redux/store';
import Provider from '../context/index';
import { ToastProvider } from 'react-toast-notifications';
import ToastContainer from '../components/ToastContainer';

// MSAL imports
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from '../authConfig';

export const msalInstance = new PublicClientApplication(msalConfig);

const allProviders = ({ children }) => {
    return (
        <BrowserRouter>
            <ReduxProvider store={configureStore()}>
                <Suspense fallback={<div className="loading" />}>
                    <ToastProvider components={{ ToastContainer }}>
                        <Provider>
                            {children}
                        </Provider>
                    </ToastProvider>
                </Suspense>
            </ReduxProvider>
        </BrowserRouter>

    );
}

// const renderWithContext = (ui, options) => 
//     render(ui, { wrapper: allProviders, ...options });

// const renderWithContext = (ui, options) => {
//     console.log(options);
//     render(ui, { wrapper: allProviders, ...options });
// }
    
const customRender = (ui, providerProps) => {

    const props = providerProps || {};

    return render(
        <BrowserRouter>
            <ReduxProvider store={configureStore()}>
                <Suspense fallback={<div className="loading" />}>
                    <ToastProvider components={{ ToastContainer }}>
                        <Provider {...props}>
                            {ui}
                        </Provider>
                    </ToastProvider>
                </Suspense>
            </ReduxProvider>
        </BrowserRouter>
    )
}

export * from '@testing-library/react';

// override render method
export { customRender as render };
