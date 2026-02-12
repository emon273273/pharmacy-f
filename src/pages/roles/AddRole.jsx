import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AddRole = ({ onClose }) => {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="roleName">Role Name</Label>
                <Input id="roleName" placeholder="Enter role name" />
            </div>
            <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="p-4 border rounded-md text-sm text-slate-500 bg-slate-50">
                    Permissions selection will go here.
                </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button>Save Role</Button>
            </div>
        </div>
    );
};

export default AddRole;
