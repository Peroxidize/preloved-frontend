import axios from "axios";

const API_URL = "https://prelovedbackend.azurewebsites.net/store/";

export const get_balance = async (shop_user_id: any) => {
  let response;
  try {
    response = await axios.get(API_URL + "get_balance", {
      withCredentials: true,
      params: { id: shop_user_id },
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
  return response;
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
