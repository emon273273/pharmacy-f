import { apiSlice } from '../../api/apiSlice';
import { setPermissions } from '../auth/authSlice';

export const permissionsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPermissions: builder.query({
            query: () => '/settings/allpermission',
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setPermissions(data?.data || []));
                } catch (error) {
                    console.log('Load permissions error:', error);
                }
            },
            providesTags: ['Permissions'],
        }),

        getAllPermission: builder.query({
            query: () => '/settings/allpermission',
            providesTags: ['Permissions'],
        }),

        addPermission: builder.mutation({
            query: ({ roleId, permissionId }) => ({
                url: '/settings/updateotherpermission',
                method: 'PATCH',
                body: { role: roleId, permissionId },
            }),
            invalidatesTags: ['Permissions'],
        }),

        updateOtherPermission: builder.mutation({
            query: ({ role, permissionId }) => ({
                url: '/settings/updateotherpermission',
                method: 'PATCH',
                body: { role, permissionId },
            }),
            invalidatesTags: ['Permissions'],
        }),
    }),
});

export const {
    useGetPermissionsQuery,
    useGetAllPermissionQuery,
    useAddPermissionMutation,
    useUpdateOtherPermissionMutation,
} = permissionsApi;