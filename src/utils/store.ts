import axios from "axios";

const API_URL = "https://preloved.westus3.cloudapp.azure.com/store/";

export const get_balance = async (shop_user_id: any) => {
  let response;
  try {
    response = await axios.get(API_URL + "get_balance", {
      params: { id: shop_user_id },
      withCredentials: true,
    });
    console.log(response);
  } catch (error: any) {
    console.log(error.data);
  }
  return response?.data.balance;
};

export const get_vouchers = async () => {
  let response;
  try {
    response = await axios.get(API_URL + "codegen", { withCredentials: true });
    console.log("response");
    console.log(response);
    response = response.data["valid vouchers: "];
    response.sort((a: any, b: any) => {
      return a.amount - b.amount;
    });
  } catch (error) {
    response = undefined;
    console.log(error);
  }
  return response;
};

export const redeem_voucher = async (voucher_code: string) => {
  const formData = new FormData();
  formData.append("code", voucher_code);

  let response;
  try {
    response = await axios.post(API_URL + "redeem_voucher", formData, {
      withCredentials: true,
    });

    const newBalance = response.data["new balance"];
    return `Your new balance is now ${newBalance}`;
  } catch (error: any) {
    if (/already been redeemed/.test(JSON.stringify(error.response.data))) {
      return "Voucher code already redeemed";
    }
    return "Voucher code invalid";
  }
};
