const { ProductAPI } = require("services/api");

const CreateProductAction = {
  type: "CREATE_PRODUCT",
  payload: ProductAPI.createProduct,
};

const EditProductAction = {
  type: "EDIT_PRODUCT",
  payload: [{ name: "iPhone XR" }, { name: "Samsung Galaxy S10" }],
};
