import usePermissions from "../../hooks/usePermissions";

const PrivacyGuard = ({ permission, children }) => {
    const { permissions } = usePermissions();

    if (permissions?.includes(permission)) {
        return <>{children}</>;
    } else {
        return "";
    }
};

export default PrivacyGuard;
