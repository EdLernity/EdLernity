import { GoogleOAuthProvider } from '@react-oauth/google';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Context } from './Context';
import './index.css';
import reportWebVitals from './reportWebVitals';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  
    <SnackbarProvider >
    <GoogleOAuthProvider clientId="879823435298-bakjaqmlqh41ncbj4008ulefbjapmd82.apps.googleusercontent.com">
    <Context>
    <App />
    </Context>
    </GoogleOAuthProvider>
    </SnackbarProvider>
 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
