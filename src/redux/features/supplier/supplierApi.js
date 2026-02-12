import { apiSlice } from '../../api/apiSlice';

export const supplierApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSuppliers: builder.query({
            query: (params) => ({
                url: '/supplier',
                params: params,
            }),
            providesTags: ['Supplier'],
        }),
        getAllSuppliers: builder.query({
            query: () => '/supplier?query=all',
            providesTags: ['Supplier'],
        }),
        createSupplier: builder.mutation({
            query: (data) => ({
                url: '/supplier',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Supplier'],
        }),
    }),
});

export const {
    useGetSuppliersQuery,
    useGetAllSuppliersQuery,
    useCreateSupplierMutation,
} = supplierApi;
