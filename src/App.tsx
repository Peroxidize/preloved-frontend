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

export const UserContext = createContext<any>(null);

// export const getElement = (user: User | null) => {
//   if (user === null) {
//     return <Login />;
//   }
//   switch(user.type) {
//     case UserType.User:
//       return <FrontPage />;
//     case UserType.Seller:
//       return <FrontPage />;
//     case UserType.Admin:
//       return <AdminPanel />;
//     case UserType.UnverifiedSeller:
//       return <ShopDocumentation submitted={false} />;
//     case UserType.CompletedSeller:
//       return <ShopDocumentation submitted={true} />;
//   }
// }

const ProtectedRoute = ({user, condition}: {user: any, condition: any}) => {
  if (!condition && !user) { // login, signup
    return <Outlet />;
  }
  if (!user) {
    return <Login />;
  }

  return <Outlet />;
};

const App = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <UserContext.Provider value={{user: user, setUser: setUser}}>
      <Routes>
        <Route element={<ProtectedRoute user={user} condition={null} />}>
          <Route index element={<Login/>}/>
          <Route path="signup" element={<SignUp />} />
        </Route>
        <Route element={<ProtectedRoute user={user} condition={UserType.User} />}>
          <Route index element={<FrontPage />} />
          <Route path="ordering" element={<Ordering />} />
          <Route path="invoice" element={<Invoice />} />
          <Route path="ticketcenter" element={<TicketCenter />} />
        </Route>
        {/* <Route path="/frontpage" element={<FrontPage />} />
        <Route path="/ordering" element={<Ordering />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/ticketcenter" element={<TicketCenter />} />
        <Route path="/shopdocs" element={<ShopDocumentation submitted={false} />}/>
        <Route path="/shopdocs/submitted" element={<ShopDocumentation submitted={true} />}/> */}
        <Route path="*" element={<h1>Error 404: Page not found</h1>} />
      </Routes>
    </UserContext.Provider>
  );
};

export default App;