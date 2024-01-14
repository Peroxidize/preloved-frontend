import axios from "axios";
import { Collection } from "../components/Collections/collections";
import { LINK_GET_ITEM_IMAGES } from "../components/misc";

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

// async function getImageLinks(ids: string[]) {
//   let img_ids: string[] = [];
//   let img_links: string[] = [];
//   const links = await get_image_link(ids);
//   img_ids.push(links.id);
//   if (links.image_links.length > 0) {
//     img_links.push(links.image_links[0]);
//   } else {
//     img_links.push(links.image_links);
//   }
//   return { img_ids, img_links };
// }

// async function getCompleteData(collection: Collection) {
//   const ids = await get_collection_items(String(collection.id));
//   const { img_ids, img_links } = await getImageLinks(ids);
//   return { ...collection, img_ids, img_links };
// }

async function getCompleteData(collection: Collection) {
  const ids = await get_collection_items(String(collection.id));

  let img_ids: string[] = [];
  let img_links: string[] = [];
  const get_img_links = ids.itemIDs.map(async (id: string) => {
    const links = await get_image_link(id);
    img_ids.push(links.id);
    if (links.image_links.length > 0) {
      img_links.push(links.image_links[0]);
    } else {
      img_links.push(links.image_links);
    }
    return { img_ids, img_links };
  });
  await Promise.all(get_img_links);
  return { ...collection, img_ids, img_links };
}

export const get_collection = async () => {
  try {
    const response = await axios.get(API_URL + "get_collections", {
      withCredentials: true,
    });

    const get_imgs_data = response.data.collections.map((collection: Collection) =>
      getCompleteData(collection)
    );

    const collections_with_all_data: Collection[] = await Promise.all(get_imgs_data);

    console.log(collections_with_all_data);

    return collections_with_all_data;
  } catch (error: any) {
    console.log("error");
    console.log(error);
    return null;
  }
};

const get_collection_items = async (id: string) => {
  try {
    const response = await axios.get(API_URL + "get_collection_items", {
      params: { collection_id: id },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.log(error.response.data);
    return null;
  }
};

const get_image_link = async (id: string) => {
  try {
    const response = await axios.get(LINK_GET_ITEM_IMAGES, {
      params: { id: id },
      withCredentials: true,
    });
    // console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.log(error.response.data);
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

export const remove_item_from_collection = async (collectionID: string, itemID: string) => {
  const formData = new FormData();
  formData.append("collectionID", collectionID);
  formData.append("itemID", itemID);

  try {
    const response = await axios.post(API_URL + "remove_item_from_collection", formData, {
      withCredentials: true,
    });
    console.log(response.data);
    return "success";
  } catch (error: any) {
    console.log(error.data);
    return "failed";
  }
};
