import { apiSlice } from '../../api/apiSlice';

export const categoryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: (params) => ({
                url: '/category',
                params: params,
            }),
            providesTags: ['Category'],
        }),
        getAllCategories: builder.query({

            query: () => '/category?query=all',
            providesTags: ['Category'],
        }),
        createCategory: builder.mutation({
            query: (data) => ({
                url: '/category',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Category'],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetAllCategoriesQuery,
    useCreateCategoryMutation,
} = categoryApi;
