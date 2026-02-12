import React, { useState, useEffect } from 'react';
import { useUpdateUserMutation, useGetSingleUserQuery } from '../../redux/features/users/userApi';
import { useGetRolesQuery } from '../../redux/features/role/roleApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import toast from 'react-hot-toast';


const EditUser = ({ userId, onClose }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        roleId: '',
        status: 'true'
    });

    const { data: userData, isLoading: isUserLoading } = useGetSingleUserQuery(userId, { skip: !userId });
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const { data: rolesData } = useGetRolesQuery({ query: 'all' });

    useEffect(() => {
        if (userData) {
            // Adjust based on actual API response structure for single user
            // Assuming userData is the user object directly or nested
            const user = userData.data || userData;
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                username: user.username || '',
                email: user.email || '',
                phone: user.phone || '',
                roleId: user.roleId?.toString() || '',
                status: user.status || 'true'
            });
        }
    }, [userData]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleRoleChange = (value) => {
        setFormData(prev => ({
            ...prev,
            roleId: value
        }));
    };

    const handleStatusChange = (value) => {
        setFormData(prev => ({
            ...prev,
            status: value
        }));
    };

    const handleSubmit = async () => {
        try {
            await updateUser({ id: userId, ...formData }).unwrap();
            toast.success('User updated successfully');
            onClose();
        } catch (error) {
            console.error('Failed to update user:', error);
            toast.error(error?.data?.message || 'Failed to update user');
        }
    };

    if (isUserLoading) return <div>Loading user data...</div>;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="johndoe" value={formData.username} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="01700000000" value={formData.phone} onChange={handleChange} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="roleId">Role</Label>
                <Select onValueChange={handleRoleChange} value={formData.roleId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        {rolesData?.getAllRole?.map((role) => (
                            <SelectItem key={role.id} value={role.id.toString()}>
                                {role.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={handleStatusChange} value={formData.status}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={isUpdating}>
                    {isUpdating ? 'Saving...' : 'Update User'}
                </Button>
            </div>
        </div>
    );
};

export default EditUser;
