import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import { User } from "./components/misc";

import SignUp from "./components/SignUp/SignUp";
import Login from "./components/Login/Login";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { getRoute } from "./utils/routes";
import CreateShop from "./components/CreateShop/CreateShop";

export const userAtom = atomWithStorage<User | null>("userInfo", null);

const App = () => {
  const [storedUser, setUser] = useAtom<User | null>(userAtom);

  useEffect(() => {
    console.log(storedUser);
  }, [storedUser]);

  return (
    <Routes>
      {storedUser ? (
        <>{getRoute(storedUser.type)}</>
      ) : (
        <>
          <Route path="/" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="shop/create" element={<CreateShop />} />
        </>
      )}
      <Route path="*" element={<h1>Error 404: Page not found</h1>} />
    </Routes>
  );
};

export default App;
