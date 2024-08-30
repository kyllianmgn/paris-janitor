'use client';
import React, { useState, useEffect } from 'react';
import { User, ApiResponse } from '@/types';
import DataTable from '@/components/public/DataTable';
import CrudModal from '@/components/public/CrudModal';
import { getUsers, editUser, banUser, deleteUser } from '@/api/services/user-service';
import { Button } from "@/components/ui/button";
import { Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const UserTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'edit' | 'ban'>('edit');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [filters, setFilters] = useState({
        role: {
            landlord: false,
            serviceProvider: false,
            traveler: false
        },
        subscription: {
            active: false,
            inactive: false
        },
        banned: false
    });

    const router = useRouter();
    const itemsPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchQuery, filters]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response: ApiResponse<User[]> = await getUsers(searchQuery, currentPage, filters);
            setUsers(response.data);
            setTotalCount(response.count || 0);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
        setIsLoading(false);
    };

    const handleEdit = (id: number) => {
        const user = users.find(u => u.id === id);
        if (user) {
            setSelectedUser(user);
            setModalMode('edit');
            setModalOpen(true);
        }
    };

    const handleDetails = (id: number) => {
        router.push(`/users/${id}`);
    };

    const handleBan = (id: number) => {
        const user = users.find(u => u.id === id);
        if (user) {
            setSelectedUser(user);
            setModalMode('ban');
            setModalOpen(true);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            await deleteUser(id);
            fetchUsers();
        }
    };

    const handleSubmit = async (data: Partial<User>) => {
        if (modalMode === 'edit' && selectedUser) {
            await editUser(selectedUser.id, data);
        } else if (modalMode === 'ban' && selectedUser && data.bannedUntil) {
            await banUser(selectedUser.id, new Date(data.bannedUntil));
        }
        setModalOpen(false);
        fetchUsers().then();
    };

    const columns: { key: keyof User; header: string }[] = [
        { key: 'firstName', header: 'First Name' },
        { key: 'lastName', header: 'Last Name' },
        { key: 'email', header: 'Email' },
        {
            key: 'role',
            header: 'Role',
            render: (user: User) => getUserRole(user)
        },
        {
            key: 'subscription',
            header: 'Subscription',
            render: (user: User) => getSubscriptionStatus(user)
        },
        {
            key: 'bannedUntil',
            header: 'Banned Until',
            render: (user: User) => user.bannedUntil ? new Date(user.bannedUntil).toLocaleDateString() : 'Not banned'
        },
    ];

    const getUserRole = (user: User): string => {
        if (user.Landlord) return "Landlord";
        if (user.ServiceProvider) return "Service Provider";
        if (user.Traveler) return "Traveler";
        return "None";
    };

    const getSubscriptionStatus = (user: User): string => {
        return user.subscriptions && user.subscriptions.length > 0 ? 'Active' : 'Inactive';
    };

    const modalFields = modalMode === 'edit'
        ? [
            { name: 'firstName', label: 'First Name', type: 'text', required: true },
            { name: 'lastName', label: 'Last Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
        ]
        : [
            { name: 'bannedUntil', label: 'Ban Until', type: 'datetime-local', required: true },
        ];

    const handleFilterChange = (filterType: string, value: string) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterType]: {
                ...prevFilters[filterType as keyof typeof prevFilters],
                [value]: !prevFilters[filterType as keyof typeof prevFilters][value as keyof typeof prevFilters[typeof filterType]]
            }
        }));
    };

    const AdvancedFilters = () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="ml-auto">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Roles</h4>
                        <div className="flex flex-col space-y-1">
                            {['landlord', 'serviceProvider', 'traveler'].map((role) => (
                                <div key={role} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={role}
                                        checked={filters.role[role as keyof typeof filters.role]}
                                        onCheckedChange={() => handleFilterChange('role', role)}
                                    />
                                    <Label htmlFor={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Subscription</h4>
                        <div className="flex flex-col space-y-1">
                            {['active', 'inactive'].map((sub) => (
                                <div key={sub} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={sub}
                                        checked={filters.subscription[sub as keyof typeof filters.subscription]}
                                        onCheckedChange={() => handleFilterChange('subscription', sub)}
                                    />
                                    <Label htmlFor={sub}>{sub.charAt(0).toUpperCase() + sub.slice(1)}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="banned"
                            checked={filters.banned}
                            onCheckedChange={() => setFilters(prev => ({ ...prev, banned: !prev.banned }))}
                        />
                        <Label htmlFor="banned">Show Banned Users</Label>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <AdvancedFilters />
            </div>
            <DataTable
                data={users}
                columns={columns}
                onUpdate={handleEdit}
                onDelete={handleDelete}
                onBan={handleBan}
                onDetails={handleDetails}
                onSearchChange={setSearchQuery}
                onPageChange={setCurrentPage}
                totalCount={totalCount}
                itemsPerPage={itemsPerPage}
                searchPlaceholder="Search users..."
                getColumnValue={(user: User, column) => {
                    if (column.render) {
                        return column.render(user);
                    }
                    return user[column.key as keyof User] as string;
                }}
            />
            <CrudModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                fields={modalFields}
                title={modalMode === 'edit' ? 'Edit User' : 'Ban User'}
                initialData={selectedUser || {}}
                mode={modalMode === 'edit' ? 'edit' : 'create'}
            />
        </div>
    );
};

export default UserTable;