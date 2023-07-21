import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Provider as ReduxProvider } from 'react-redux';
import { configureStore } from './redux/store';
import { ToastProvider } from 'react-toast-notifications';
import ToastContainer from './components/ToastContainer';
import Provider from './context/index';
import history from './history';
import { ThemeProvider } from 'styled-components';
import { theme } from './constants/theme';
import { AnimatePresence } from 'framer-motion';
import { RecoilRoot } from 'recoil';

// MSAL imports
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";

export const msalInstance = new PublicClientApplication(msalConfig);

const App = React.lazy(() => import(/* webpackChunkName: "App" */'./App' ));


ReactDOM.render(
  <BrowserRouter history={history}>
    <ReduxProvider store={configureStore()}>
        <Suspense fallback={<div className={`pulse-loading mx-auto`} style={{ height: '200px'  }}></div>}>
            <ToastProvider components={{ ToastContainer}}>
                <MsalProvider instance={msalInstance}>
                    <Provider>
                        <ThemeProvider theme={theme}>
                            <AnimatePresence>
                                <RecoilRoot>
                                    <App />
                                </RecoilRoot>
                            </AnimatePresence>
                        </ThemeProvider>
                    </Provider>
                </MsalProvider>
            </ToastProvider>
        </Suspense>
    </ReduxProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
/*
 * If you want your app to work offline and load faster, you can change
 * unregister() to register() below. Note this comes with some pitfalls.
 * Learn more about service workers: https://bit.ly/CRA-PWA
 */
serviceWorker.unregister();
