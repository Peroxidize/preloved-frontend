import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SignUp from './SignUp/SignUp';
import Login from './Login/Login';
import Ordering from './Ordering/Ordering';
import Invoice from './Ordering/Invoice';
import FrontPage from './FrontPage/FrontPage';
import TicketCenterUser from './TicketCenterUser/TicketCenterUser';
import TicketScreenSeller from './TicketScreen(Seller)/TicketScreenSeller';

import "@fontsource/roboto";
import "@fontsource/roboto/700.css";
import "./global.css";



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" Component={Login} />
        <Route path="/signup" Component={SignUp} />
        <Route path="/frontpage" Component={FrontPage} />
        <Route path="/ordering" Component={Ordering} />
        <Route path="/invoice" Component={Invoice} />
        <Route path="/ticketscreen" Component={TicketScreenSeller} />
      </Routes>
    </Router>    
  </React.StrictMode>,
);
