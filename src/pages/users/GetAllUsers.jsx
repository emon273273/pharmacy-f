import React, { useState } from 'react';
import { useDeleteUserMutation, useGetUsersQuery } from '../../redux/features/users/userApi';
import { useGetRolesQuery } from '../../redux/features/role/roleApi';
import DynamicTable from '@/components/customTable/DynamicTable';
import { Button } from '@/components/ui/button';
import Card from '@/components/card/Card';
import CustomDrawer from '@/components/customDrawer/CustomDrawer';
import AddUser from './AddUser';
import EditUser from './EditUser';
import toast from 'react-hot-toast';
import PrivacyGuard from '@/components/Guard/PrivacyGuard';
import { DeleteButton, EditButton } from '@/components/button/ActionButtons';

const GetAllUsers = () => {
    const [pageConfig, setPageConfig] = useState({
        page: 1,
        count: 10
    });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const { data: users, isLoading, error } = useGetUsersQuery(pageConfig);
    const [deleteUser] = useDeleteUserMutation();

    const handleDelete = async (id) => {
        try {
            await deleteUser(id).unwrap();
            toast.success('User deleted successfully');
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const handleEdit = (id) => {
        setSelectedUserId(id);
        setIsEditDrawerOpen(true);
    };

    const columns = [
        {
            title: "ID",
            key: "id",
            dataIndex: "id",
        },
        {
            title: "Name",
            key: "name",
            render: (record) => `${record.firstName} ${record.lastName}`
        },
        {
            title: "Username",
            key: "username",
            dataIndex: "username",
        },
        {
            title: "Role",
            key: "role",
            render: (record) => record.role?.name || 'N/A'
        },
        {
            title: "Status",
            key: "status",
            dataIndex: 'status',
            render: (record) => (
                <span className={`px-2 py-1 rounded-full text-xs ${String(record.status) === "true" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                    {String(record.status) === "true" ? "Active" : "Inactive"}
                </span>
            )
        },
        {
            title: "Actions",
            key: "actions",
            render: (record) => (
                <div className="flex items-center gap-2">
                    <EditButton onClick={() => handleEdit(record.id)} permission="update-user" />


                    <DeleteButton onClick={() => handleDelete(record.id)} permission="delete-user" />

                </div>
            )
        }
    ];

    if (error) {
        return <div className="p-6 text-red-500">Error loading users: {error.message || "Unknown error"}</div>;
    }

    const { data: rolesData } = useGetRolesQuery({ query: 'all' });

    const filterOptions = [
        {
            key: "roleId",
            label: "Role",
            mode: "single",
            options: rolesData?.getAllRole?.map(role => ({
                label: role.name,
                value: String(role.id)
            })) || [],
        },
        {
            key: "status",
            label: "Status",
            mode: "single",
            options: [
                { label: "Active", value: "true" },
                { label: "Inactive", value: "false" },
            ],
        }
    ];

    return (
        <Card title={"User List"} action={<Button onClick={() => setIsDrawerOpen(true)}>Create User</Button>}>
            <CustomDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title="Create New User"
                description="Fill in the details below to create a new user."
            >
                <AddUser onClose={() => setIsDrawerOpen(false)} />
            </CustomDrawer>

            <CustomDrawer
                isOpen={isEditDrawerOpen}
                onClose={() => setIsEditDrawerOpen(false)}
                title="Edit User"
                description="Update the user details below."
            >
                <EditUser userId={selectedUserId} onClose={() => setIsEditDrawerOpen(false)} />
            </CustomDrawer>

            <PrivacyGuard permission="readAll-user">
                <DynamicTable
                    title="User List"
                    columns={columns}
                    list={users?.getAllUser}
                    total={users?.totalUser}
                    loading={isLoading}
                    pageConfig={pageConfig}
                    setPageConfig={setPageConfig}
                    filterOptions={filterOptions}
                    actionPermission={['update-user', 'delete-user']}
                />
            </PrivacyGuard>
        </Card>
    );
};

export default GetAllUsers;
