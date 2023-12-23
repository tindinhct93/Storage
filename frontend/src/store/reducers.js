import { ProductAPI } from "services/api";
import { ProductApi } from "services/createApi";

const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  id: 1,
  name: "Versache Summer Sweater",
  brand: "VERSS",
  sku: "VER0923SW",
  size: "XXL",
  // suppliers: supplierss,
  color: "Green",
  // status: 'Active',
  stock: 1290,
};

export const ProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    createProduct: (state) => {
      ProductAPI.createProduct(state);
    },
    editProduct: (state) => {
      ProductAPI.editProduct(state);
    },
    printProduct: (state, action) => {
      return {
        ...state,
        name: action.payload,
      };
    },
  },
});

// Below are Action Creator not Action -> you must call the function -> return Action {type, payload}
// dispatch(printProduct())
export const { createProduct, editProduct, printProduct } =
  ProductSlice.actions;
export const getProductName = (state) => state.product;
// Export reducer để nhúng vào Store
export default ProductSlice.reducer;
