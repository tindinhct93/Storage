import axios from "axios";

const SERVER_PATH = process.env.REACT_APP_BACKEND_URL;
export const SupplierAPI = {
  createQueryString: (filters) => {
    const params = Object.entries(filters)
      .filter(([key, value]) => value !== "") // filter out empty values
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      );
    return params.join("&");
  },
  fetchSupplier: async function (
    page = 0,
    limit = 5,
    filters = { status: "active" }
  ) {
    const filterstring = this.createQueryString(filters);
    const URL = `${SERVER_PATH}/report?page=${
      page + 1
    }&limit=${limit}&${filterstring}`;
    console.log(URL);
    return await axios.get(URL);
  },
  createSupplier: async (data) => {
    const URL = `${SERVER_PATH}/report`;
    return await axios.post(URL, data);
  },
  editSupplier: async (data) => {
    let { HQAddress, WHAddress, OFFAddress, ...submitObject } = data;
    const URL = `${SERVER_PATH}/supplier`;
    return await axios.put(URL, submitObject);
  },
  returnReport: async (id) => {
    const URL = `${SERVER_PATH}/report/Return/${id}`;
    return await axios.post(URL);
  },
  editQAReport: async (id, data) => {
    const URL = `${SERVER_PATH}/report/QA/${id}`;
    return await axios.post(URL, data);
  },
  editBorrowReport: async (id, data) => {
    const URL = `${SERVER_PATH}/report/Borrow/${id}`;
    return await axios.post(URL, data);
  },
  createBox: async (id) => {
    const URL = `${SERVER_PATH}/report/Boxes/${id}`;
    return await axios.post(URL);
  },
  deleteBox: async (id) => {
    const URL = `${SERVER_PATH}/report/UnBoxes/${id}`;
    return await axios.post(URL);
  },
};
