import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { User, UserType } from './components/misc';

import SignUp from "./components/SignUp/SignUp";
import Login from "./components/Login/Login";
import Ordering from "./components/Ordering/Ordering";
import Invoice from "./components/Ordering/Invoice";
import FrontPage from "./components/FrontPage/FrontPage";
import ShopDocumentation from "./components/ShopVerification/ShopDocumentation";
import AddBalance from "./components/AddBalance/AddBalance";
import TicketCenter from './components/TicketCenter/TicketCenter';
import AdminPanel from './components/AdminPanel/admin-panel';

import "@fontsource/roboto";
import "@fontsource/roboto/700.css";
import "./index.css";

const queryClient = new QueryClient();

const currentUser: User = JSON.parse(localStorage.getItem('userInfo')!);

const AnonymousRoutes = () => {
  return currentUser === null ? <Outlet /> : <Navigate to="/" />;
};

const UserRoutes = () => {
  return currentUser.type === UserType.User ? <Outlet /> : <Navigate to="/" />;
};

const UnverifiedSellerRoutes = () => {
  return currentUser.type === UserType.UnverifiedSeller ? <Outlet /> : <Navigate to="/" />;
};

const VerifiedSellerRoutes = () => {
  return currentUser.type === UserType.Seller ? <Outlet /> : <Navigate to="/" />;
};

const AdminRoutes = () => {
  return currentUser.type === UserType.Admin ? <Outlet /> : <Navigate to="/" />;
};

const getRoutes = (user: User) => {
  if (user === null) {
    return(
      <Route element={<AnonymousRoutes />}>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>
    );
  }
  switch(user.type) {
    case UserType.User:
      return (
        <Route element={<UserRoutes />}>
          <Route path="/frontpage" element={<FrontPage />} />
          <Route path="/ordering" element={<Ordering />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/ticketcenter" element={<TicketCenter />} />
        </Route>
      );
    case UserType.Seller: 
      return(
        <Route element={<VerifiedSellerRoutes />}>
          <Route path="/ticketcenter" element={<TicketCenter />} />
          <Route path="/topup" element={<AddBalance />} />
        </Route>
      );
    case UserType.Admin:
      return (
        <Route element={<AdminRoutes />}>
          <Route path="/adminpanel" element={<AdminPanel />} />
        </Route>
      );
    case UserType.UnverifiedSeller:
      return (
        <Route element={<UnverifiedSellerRoutes />}>
          <Route path="/shopdocs" element={<ShopDocumentation />} />
        </Route>
      );
    default:
      return(
        <Route element={<AnonymousRoutes />}>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
      );
  }
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {getRoutes(currentUser)}
          <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>
);
