import { UserType } from "../components/misc";
import { Route } from "react-router-dom";

import FrontPage from "../components/FrontPage/FrontPage";
import Invoice from "../components/Ordering/Invoice";
import Ordering from "../components/Ordering/Ordering";
import TicketCenter from "../components/TicketCenter/TicketCenter";
import AddBalance from "../components/AddBalance/AddBalance";
import AdminPanel from "../components/AdminPanel/admin-panel";
import ShopDocumentation from "../components/ShopVerification/ShopDocumentation";
import CreateShop from "../components/CreateShop/CreateShop";
import Shop from "../components/ProductManagement/Shop";
import AddItem from "../components/ProductManagement/AddItem";
import CodeGen from "../components/AdminPanel/code-gen";
import RedeemVoucher from "../components/RedeemVoucher/redeem-voucher";

export const UserRoute = () => {
  return (
    <>
      <Route index element={<FrontPage />} />
      <Route path="ordering" element={<Ordering />} />
      <Route path="invoice" element={<Invoice />} />
      <Route path="ticketcenter" element={<TicketCenter />} />
    </>
  );
};

export const VerifiedSellerRoute = () => {
  return (
    <>
      <Route index element={<TicketCenter />} />
      <Route path="topup" element={<AddBalance />} />
      <Route path="redeem" element={<RedeemVoucher />} />
      <Route path="shop/create" element={<CreateShop />} />
      <Route path="shop" element={<Shop />} />
      <Route path="shop/add" element={<AddItem />} />
    </>
  );
};

export const AdminRoute = () => {
  return (
    <>
      <Route index element={<AdminPanel />} />
      <Route path="generate" element={<CodeGen />} />
    </>
  );
};

export const UnsubmittedSellerRoute = () => {
  return (
    <>
      <Route index element={<ShopDocumentation submitted={false} />} />
      <Route
        path="/shopdocs/submitted"
        element={<ShopDocumentation submitted={true} />}
      />
    </>
  );
};

export const SubmittedSellerRoute = () => {
  return (
    <>
      <Route index element={<ShopDocumentation submitted={true} />} />
    </>
  );
};

export const getRoute = (type: UserType): any => {
  switch (type) {
    case UserType.User:
      return UserRoute();
    case UserType.Seller:
      return VerifiedSellerRoute();
    case UserType.Admin:
      return AdminRoute();
    case UserType.UnverifiedSeller:
      return UnsubmittedSellerRoute();
    default:
      return SubmittedSellerRoute();
  }
};
