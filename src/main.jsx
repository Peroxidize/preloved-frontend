import React from 'react';
import ReactDOM from 'react-dom/client';
import SignUp from './SignUp/SignUp';
import Login from './Login/Login';
import "@fontsource/roboto";
import "@fontsource/roboto/700.css";
import "./reset.css"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Login/>
  </React.StrictMode>,
);
