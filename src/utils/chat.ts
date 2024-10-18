import axios from "axios";

const API_URL = "https://preloved.westus2.cloudapp.azure.com/chat/";

export const send_message = async (message: string, userID: string, sellerID: string, sender: string) => {
    const formData = new FormData();
    formData.append("message", message);
    formData.append("userID", userID);
    formData.append("sellerID", sellerID);
    formData.append("sender", sender);
  
    try {
      const response = await axios.post(API_URL + "send_message", formData, {
        withCredentials: true,
      });
      console.log(response);
      console.log(formData);
    } catch (error: any) {
      console.log(error.data);
      return "failed";
    }
    return "success";
};

export const fetch_chat_history_user = async () => {
    try {
      const response = await axios.get(API_URL + "fetch_chat_history_user", {
        withCredentials: true,
      });
      console.log("fetching chat");
      console.log(response.data.chat_info);
      return response.data.chat_info;
    } catch (error: any) {
      console.log(error.response.data);
      return null;
    }
};

export const fetch_chat_history_seller = async () => {
    try {
      const response = await axios.get(API_URL + "fetch_chat_history_seller", {
        withCredentials: true,
      });
      console.log(response.data.chat_info);
      return response.data.chat_info;
    } catch (error: any) {
      console.log(error.response.data);
      return null;
    }
};

export const fetch_all_messages = async (userID: string, sellerID: string) => {
    try {
      const response = await axios.get(API_URL + "fetch_all_messages", {
        params: {userID: userID, sellerID: sellerID},
        withCredentials: true,
      });
      console.log(response.data.messages);
      return response.data.messages;
    } catch (error: any) {
      console.log(error.response.data);
      return null;
    }
};

export const long_poll_messages = async (userID: string, sellerID: string) => {
    try {
      const response = await axios.get(API_URL + "long_poll_messages", {
        params: {userID: userID, sellerID: sellerID},
        withCredentials: true,
      });
      console.log(response.data.messages);
      return response.data.messages;
    } catch (error: any) {
      console.log(error);
      return null;
    }
};

export const get_seller_id = async (storeID: string) => {
    try {
      const response = await axios.get(API_URL + "get_seller_id", {
        params: {storeID: storeID},
        withCredentials: true,
      });
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      console.log(error.response.data);
      return null;
    }
};