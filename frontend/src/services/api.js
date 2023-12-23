import axios from "axios";
export const ProductAPI = {
  fetchAllProducts: async () => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/product`;
    return await axios.get(URL).then((res) => {
      return res.data;
    });
  },

  editProduct: async (body) => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/product/${body?.id}`;
    return await axios.post(URL, body).then((res) => res.data);
  },
  deleteProduct: async (productId) => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/product/${productId}`;
    try {
      return await axios
        .delete(URL)
        .then((res) => res.data)
        .catch((err) => err);
    } catch (e) {
      // >>> client log error
      console.log(e);
    }
  },
  createProduct: async (body) => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/product`;
    await axios.post(URL, body).then((res) => res.data);
  },
};
