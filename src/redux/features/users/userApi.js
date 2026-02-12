import { apiSlice } from '../../api/apiSlice';

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: (params) => ({
                url: '/user',
                params: params,
            }),
            providesTags: ['Users'],
            transformResponse: (response) => {
                return response.data || response;
            }
        }),
        getAllUsers: builder.query({
            query: () => ({
                url: '/user',
                params: 'query=all'
            }),
            providesTags: ['Users'],
            transformResponse: (response) => {
                return response.data || response;
            }
        }),
        addUser: builder.mutation({
            query: (data) => ({
                url: '/user/register',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Users'],
        }),
        updateUser: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/user/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Users'],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/user/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users'],
        }),
        getSingleUser: builder.query({
            query: (id) => `/user/${id}`,
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetAllUsersQuery,
    useAddUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useGetSingleUserQuery
} = userApi;
