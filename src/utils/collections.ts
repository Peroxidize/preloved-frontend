import axios from "axios";

const API_URL = "https://prelovedbackend.azurewebsites.net/collections/";

export const create_collection = async (name: any) => {
  const formData = new FormData();
  formData.append("collection_name", name);

  try {
    const response = await axios.post(API_URL + "new_collection", formData, {
      withCredentials: true
    });
    console.log(response);
  } catch (error: any) {
    console.log(error.data);
    return false;
  }
  return true;
};

export const get_collection = async () => {
  try {
    const response = await axios.get(API_URL + "get_collections", {
      withCredentials: true
    });
    console.log(response);
    return response;
  } catch (error: any) {
    console.log(error.data);
    return null;
  }
};