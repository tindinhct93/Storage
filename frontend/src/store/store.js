import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { ProductApi, ProductSuppyApi, SupplierApi } from "services/createApi";
import ProductReducer from "./reducers";
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    [ProductApi.reducerPath]: ProductApi.reducer,
    [ProductSuppyApi.reducerPath]: ProductSuppyApi.reducer,
    [SupplierApi.reducerPath]: SupplierApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(ProductApi.middleware)
      .concat(SupplierApi.middleware)
      .concat(ProductSuppyApi.middleware),
});
