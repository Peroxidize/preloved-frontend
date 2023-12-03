import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import SignUp from './components/SignUp/SignUp';
import Login from './components/Login/Login';
import Ordering from './components/Ordering/Ordering';
import Invoice from './components/Ordering/Invoice';
import FrontPage from './components/FrontPage/FrontPage';
import TicketCenterUser from './components/TicketCenterUser/TicketCenterUser';
import TicketScreenSeller from './components/TicketScreen(Seller)/TicketScreenSeller';

import "@fontsource/roboto";
import "@fontsource/roboto/700.css";
import './index.css';
import ShopDocumentation from './components/ShopVerification/ShopDocumentation';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" Component={Login} />
          <Route path="/signup" Component={SignUp} />
          <Route path="/frontpage" Component={FrontPage} />
          <Route path="/ordering" Component={Ordering} />
          <Route path="/invoice" Component={Invoice} />
          <Route path="/ticketscreen" Component={TicketScreenSeller} />
          <Route path="/shopdocs" Component={ShopDocumentation} />
        </Routes>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>,
)
