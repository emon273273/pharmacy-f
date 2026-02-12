// src/hooks/usePermissions.js
import { useGetPermissionsQuery } from "@/redux/features/permissions/permissionsApi";
import { useSelector } from "react-redux";

const usePermissions = () => {
    const roleId = localStorage.getItem("roleId");
    const { permissions } = useSelector((state) => state.auth);

    const { isLoading } = useGetPermissionsQuery(roleId, {
        skip: !roleId,
    });

    return {
        loading: isLoading,
        permissions: Array.isArray(permissions) ? permissions : [],
    };
};

export default usePermissions;