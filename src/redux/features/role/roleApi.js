import { apiSlice } from '../../api/apiSlice';

export const roleApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRoles: builder.query({
            query: (params) => ({
                url: '/role',
                params: params,
            }),
            transformResponse: (response) => {
                return response.data || response;
            }
        }),
        getSingleRole: builder.query({
            query: (id) => `/role/${id}`,
            provideTags: (result, error, id) => [{ type: 'Role', id }],
        }),
    }),
});

export const { useGetRolesQuery, useGetSingleRoleQuery } = roleApi;
