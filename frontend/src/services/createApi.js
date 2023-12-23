import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ProductApi = createApi({
  reducerPath: "ProductApiReducer",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BACKEND_URL}/product`,
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    providesTags: ["Product"],
    getAllProducts: builder.query({
      query: () => {
        console.log("Query :>>>");
        return { name: "productA", sku: "092MMDK" };
      },
    }),

    getProductById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),

    getPaginationProducts: builder.query({
      providesTags: ["Product"],
      query: (req) => ({
        url: `?page=${req.page + 1}`,
        method: "GET",
      }),
    }),

    editProduct: builder.mutation({
      providesTags: ["Product"],
      query: (productInfo) => ({
        url: `/`,
        method: "PUT",
        body: productInfo,
      }),
    }),
    createNewProduct: builder.mutation({
      providesTags: ["Product"],
      query: (product) => ({
        url: "/",
        method: "POST",
        body: product,
      }),
    }),
    deleteProduct: builder.mutation({
      providesTags: ["Product"],
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const ProductSuppyApi = createApi({
  reducerPath: "ProductSuppyApiReducer",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BACKEND_URL}/productsupply`,
  }),
  tagTypes: ["ProductSupply", "Product", "Supplier"],
  endpoints: (builder) => ({
    getSupplierByProductId: builder.query({
      providesTags: ["ProductSupply"],
      query: (productId) => ({
        url: `/supplier?productId=${productId}`,
        method: "GET",
      }),
    }),
    deleteSupplierOfProduct: builder.mutation({
      providesTags: ["ProductSupply"],
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
    createNewSupplierOfProduct: builder.mutation({
      invalidatesTags: [`Product`],
      providesTags: ["ProductSupply"],
      query: (body) => {
        console.log("Create new supplier", body);
        return {
          url: "/",
          method: "POST",
          body: {
            supplierid: body.supplierId,
            stock: body.supplierStock,
            productid: body.productId,
          },
        };
      },
    }),
  }),
});

export const SupplierApi = createApi({
  reducerPath: "SupplierApiReducer",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BACKEND_URL}/supplier`,
  }),
  tagTypes: ["Supplier"],
  endpoints: (builder) => ({
    getAllSuppliers: builder.query({
      providesTags: ["Supplier"],
      query: () => ({
        url: `/name`,
        method: "GET",
      }),
    }),
  }),
});

// Export ra ngoài thành các hooks để sử dụng theo cú pháp use + endpoints (login) + endpoints type (mutation)
export const {
  useGetAllProductsQuery,
  useLazyGetPaginationProductsQuery,
  useEditProductMutation,
  useCreateNewProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
} = ProductApi;

export const {
  useGetSupplierByProductIdQuery,
  useCreateNewSupplierOfProductMutation,
  useDeleteSupplierOfProductMutation,
} = ProductSuppyApi;

export const { useGetAllSuppliersQuery } = SupplierApi;
