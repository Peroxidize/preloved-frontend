import { createContext, useEffect, useState } from "react";
import {
  Routes,
  Route,
  Outlet,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { User, UserType } from "./components/misc";

import SignUp from "./components/SignUp/SignUp";
import Login from "./components/Login/Login";
import Ordering from "./components/Ordering/Ordering";
import Invoice from "./components/Ordering/Invoice";
import FrontPage from "./components/FrontPage/FrontPage";
import ShopDocumentation from "./components/ShopVerification/ShopDocumentation";
import AddBalance from "./components/AddBalance/AddBalance";
import TicketCenter from "./components/TicketCenter/TicketCenter";
import AdminPanel from "./components/AdminPanel/admin-panel";
import { Provider, atom, createStore, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { getRoute } from "./utils/routes";


const ProtectedRoute = ({ user, condition}: { user: any; condition: any;  }) => {
  if (!user) {
    return <Login />;
  }
  if (user.type === condition) {
    return <Outlet />;
  }

  // Log the mismatch for debugging purposes
  console.warn(`User type ${user.type} does not match expected condition ${condition}`);

  // Render a message or redirect to a specific route
};

export const userAtom = atomWithStorage<User | null>('userInfo', null);

const App = () => {
  const [storedUser, setUser] = useAtom<User | null>(userAtom);

  useEffect(() => {
    console.log(storedUser);
  }, [storedUser])

  return (
      <Routes>
        {storedUser ? (
          <>
            {getRoute(storedUser.type)}
          </>
        ) : (
          <>
          <Route path="/" element={<Login/>}/>
          <Route path="signup" element={<SignUp />} />
          </>
        )}
        <Route path="*" element={<h1>Error 404: Page not found</h1>} />
      </Routes>
  );
};

export default App;