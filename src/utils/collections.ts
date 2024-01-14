import axios from "axios";

const API_URL = "https://prelovedbackend.azurewebsites.net/collections/";

export const create_collection = async (name: any) => {
  const formData = new FormData();
  formData.append("collection_name", name);

  try {
    const response = await axios.post(API_URL + "new_collection", formData, {
      withCredentials: true,
    });
    console.log(response);
  } catch (error: any) {
    console.log(error.data);
    return "failed";
  }
  return "success";
};

export const get_collection = async () => {
  try {
    const response = await axios.get(API_URL + "get_collections", {
      withCredentials: true,
    });
    console.log(response.data);
    // response.data.collections.map((collection: any) => {
    //   console.log(collection);
    // })
    return response.data.collections;
  } catch (error: any) {
    console.log("error");
    console.log(error);
    return null;
  }
};

export const delete_collection = async (id: string) => {
  const formData = new FormData();
  formData.append("collectionID", id);

  try {
    const response = await axios.post(API_URL + "delete_collection", formData, {
      withCredentials: true,
    });
    console.log(response.data);
    return "success";
  } catch (error: any) {
    console.log(error.message);
    return "failed";
  }
};

export const rename_collection = async (id: string, new_name: string) => {
  const formData = new FormData();
  formData.append("collectionID", id);
  formData.append("new_name", new_name);

  try {
    const response = await axios.post(API_URL + "rename_collection", formData, {
      withCredentials: true,
    });
    console.log(response.data);
    return "success";
  } catch (error: any) {
    console.log(error.message);
    return "failed";
  }
};

export const add_item_to_collection = async (collectionID: string, itemID: string) => {
  const formData = new FormData();
  formData.append("collectionID", collectionID);
  formData.append("itemID", itemID);

  try {
    const response = await axios.post(API_URL + "add_item_to_collection", formData, {
      withCredentials: true,
    });
    console.log(response.data);
    return "success";
  } catch (error: any) {
    return String(error.response.data.error);
  }
};
