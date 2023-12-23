import axios from "axios";

const SERVER_PATH = process.env.REACT_APP_BACKEND_URL;

export const AddressAPI = {
  fetchSupplierAddress: async (id) => {
    const URL = `${SERVER_PATH}/address?supplierid=${id}`;
    console.log(SERVER_PATH);
    return await axios.get(URL);
  },
  deleteAddress: async (id) => {
    const URL = `${SERVER_PATH}/address/${id}`;
    return await axios.delete(URL);
  },
  editAddress: async (data) => {
    const URL = `${SERVER_PATH}/address`;
    return await axios.put(URL, data);
  },
  addAddress: async (data) => {
    const URL = `${SERVER_PATH}/address`;
    return await axios.post(URL, data);
  },
};
