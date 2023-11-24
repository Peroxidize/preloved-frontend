import React from 'react';
import ReactDOM from 'react-dom/client';
import SignUp from './SignUp/SignUp';
import Login from './Login/Login';
import Ordering from './Ordering/Ordering';
import Invoice from './Ordering/Invoice';
import FrontPage from './FrontPage/FrontPage';

import "@fontsource/roboto";
import "@fontsource/roboto/700.css";
import "./global.css"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FrontPage/>
  </React.StrictMode>,
);
