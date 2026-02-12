import React, { useState } from 'react';
import { useGetRolesQuery } from '../../redux/features/role/roleApi';
import DynamicTable from '@/components/customTable/DynamicTable';
import { Button } from '@/components/ui/button';
import Card from '@/components/card/Card';
import CustomDrawer from '@/components/customDrawer/CustomDrawer';
import AddRole from './AddRole';
import { ViewButton, EditButton, DeleteButton } from '@/components/button/ActionButtons';

const GetAllRole = () => {
    const [pageConfig, setPageConfig] = useState({
        page: 1,
        count: 10
    })
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { data: roles, isLoading, error } = useGetRolesQuery(pageConfig);


    const columns = [
        {
            title: "ID",
            key: "id",
            render: (record) => record.id
        },
        {
            title: "Name",
            key: "name",
            dataIndex: "name",
        },
        {
            title: "Permissions",
            key: "permissions",
            render: (record) => record.rolePermission.length
        },
        {
            title: "Created At",
            key: "createdAt",
            dataIndex: "createdAt",
        },
        {
            title: "Actions",
            key: "actions",
            render: (record) => (
                <div className="flex items-center gap-2">
                    <ViewButton to={`/admin/role/${record.id}`} />
                    <EditButton onClick={() => {
                        // TODO: Implement Edit Logic
                        console.log("Edit clicked", record.id);
                    }} />
                    <DeleteButton onClick={() => {
                        // TODO: Implement Delete Logic
                        console.log("Delete clicked", record.id);
                    }} />
                </div>
            )
        }
    ]


    if (error) {
        return <div className="p-6 text-red-500">Error loading roles: {error.message || "Unknown error"}</div>;
    }

    const filterOptions = [
        {
            key: "roleId",        // The key that will be added to pageConfig (e.g., pageConfig.roleId)
            label: "Role",        // The name shown in the "Add Filter" menu
            mode: "single",       // Enable single select mode
            options: [
                { label: "Super Admin", value: "1" },
                { label: "Manager", value: "2" },
                { label: "Sales Man", value: "3" },
                { label: "Customer", value: "4" },
            ],
        },
        {
            key: "status",        // The key added to pageConfig (e.g., pageConfig.status)
            label: "Status",
            mode: "single",       // Enable single select mode
            options: [
                { label: "Active", value: "true" },
                { label: "Inactive", value: "false" },
            ],
        },
        {
            key: "department",
            label: "Department",
            options: [
                { label: "HR", value: "hr" },
                { label: "Engineering", value: "engineering" },
                { label: "Marketing", value: "marketing" }
            ]
        }
    ];

    return (
        <Card title={"Role List"} action={<Button onClick={() => setIsDrawerOpen(true)}>Create Role</Button>}>
            <CustomDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title="Create New Role"
                description="Fill in the details below to create a new role."
            >
                <AddRole onClose={() => setIsDrawerOpen(false)} />
            </CustomDrawer>
            <DynamicTable
                title="Role List"
                columns={columns}
                list={roles?.getAllRole}
                total={roles?.totalRole}
                loading={isLoading}
                pageConfig={pageConfig}
                setPageConfig={setPageConfig}
                filterOptions={filterOptions}
            />
        </Card>
    );
};

export default GetAllRole;
