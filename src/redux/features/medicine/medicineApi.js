import { apiSlice } from '../../api/apiSlice';

export const medicineApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMedicines: builder.query({
            query: (params) => ({
                url: '/medicine',
                params: params,
            }),
            providesTags: ['Medicine'],
        }),
        getAllMedicines: builder.query({
            query: () => '/medicine?query=all',
            providesTags: ['Medicine'],
        }),
        createMedicine: builder.mutation({
            query: (data) => ({
                url: '/medicine?query=single',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Medicine'],
        }),
        createBulkMedicine: builder.mutation({
            query: (formData) => ({
                url: '/medicine?query=createMany',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Medicine'],
        }),
        getMedicineById: builder.query({
            query: (id) => `/medicine/${id}`,
            providesTags: ['Medicine'],
        }),
    }),
});

export const {
    useGetMedicinesQuery,
    useGetAllMedicinesQuery,
    useCreateMedicineMutation,
    useCreateBulkMedicineMutation,
    useGetMedicineByIdQuery,
} = medicineApi;
