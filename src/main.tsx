import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import SignUp from "./components/SignUp/SignUp";
import Login from "./components/Login/Login";
import Ordering from "./components/Ordering/Ordering";
import Invoice from "./components/Ordering/Invoice";
import FrontPage from "./components/FrontPage/FrontPage";
import TicketCenterUser from "./components/TicketCenter/TicketCenter";
import ShopDocumentation from "./components/ShopVerification/ShopDocumentation";

import "@fontsource/roboto";
import "@fontsource/roboto/700.css";
import "./index.css";
import AddBalance from "./components/AddBalance/AddBalance";

const queryClient = new QueryClient();

let currentUser: any;
if (localStorage.getItem("userInfo") !== null) {
  currentUser = JSON.parse(localStorage.getItem("userInfo")!);
} else {
  currentUser = null;
}

const PrivateRoutes = () => {
  return currentUser !== null ? <Outlet /> : <Navigate to="/" />;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/frontpage" element={<FrontPage />} />
            <Route path="/ordering" element={<Ordering />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/ticketcenter" element={<TicketCenterUser />} />
            <Route path="/shopdocs" element={<ShopDocumentation />} />
            <Route path="/topup" element={<AddBalance />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>
);
