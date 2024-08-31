'use client';
import React, { useState, useEffect } from 'react';
import { User, ApiResponse, ServiceProviderStatus } from '@/types';
import DataTable from '@/components/public/DataTable';
import CrudModal from '@/components/public/CrudModal';
import { getUsers, editUser, banUser, deleteUser } from '@/api/services/user-service';
import {
    approveServiceProvider,
    rejectServiceProvider,
    updateServiceProviderStatus
} from '@/api/services/service-provider-service';
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
import { useToast } from "@/components/ui/use-toast";

const UserTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'edit' | 'ban' | 'approveReject'>('edit');
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
        banned: false,
        serviceProviderStatus: {
            pending: false,
            accepted: false,
            refused: false
        }
    });

    const router = useRouter();
    const { toast } = useToast();
    const itemsPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchQuery, filters]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response: ApiResponse<User[]> = await getUsers(searchQuery, currentPage, {
                ...filters,
                serviceProviderStatus: Object.entries(filters.serviceProviderStatus)
                    .filter(([_, value]) => value)
                    .map(([key]) => key.toUpperCase())
            });
            setUsers(response.data);
            setTotalCount(response.count || 0);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast({
                title: "Error",
                description: "Failed to fetch users",
                variant: "destructive",
            });
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
            if (user.ServiceProvider && user.ServiceProvider.status === ServiceProviderStatus.PENDING) {
                setSelectedUser(user);
                setModalMode('approveReject');
                setModalOpen(true);
            } else {
                setSelectedUser(user);
                setModalMode('ban');
                setModalOpen(true);
            }
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id);
                fetchUsers();
                toast({
                    title: "Success",
                    description: "User deleted successfully",
                });
            } catch (error) {
                console.error('Error deleting user:', error);
                toast({
                    title: "Error",
                    description: "Failed to delete user",
                    variant: "destructive",
                });
            }
        }
    };

    const handleSubmit = async (data: Partial<User>) => {
        if (modalMode === 'edit' && selectedUser) {
            try {
                await editUser(selectedUser.id, data);
                fetchUsers();
                setModalOpen(false);
                toast({
                    title: "Success",
                    description: "User updated successfully",
                });
            } catch (error) {
                console.error('Error updating user:', error);
                toast({
                    title: "Error",
                    description: "Failed to update user",
                    variant: "destructive",
                });
            }
        } else if (modalMode === 'ban' && selectedUser && data.bannedUntil) {
            try {
                await banUser(selectedUser.id, new Date(data.bannedUntil));
                fetchUsers();
                setModalOpen(false);
                toast({
                    title: "Success",
                    description: "User banned successfully",
                });
            } catch (error) {
                console.error('Error banning user:', error);
                toast({
                    title: "Error",
                    description: "Failed to ban user",
                    variant: "destructive",
                });
            }
        }
    };

    const handleApproveServiceProvider = async () => {
        if (selectedUser?.ServiceProvider) {
            try {
                const response = await updateServiceProviderStatus({...selectedUser.ServiceProvider, status: ServiceProviderStatus.ACCEPTED})
                fetchUsers().then();
                setModalOpen(false);
                toast({
                    title: "Success",
                    description: "Service Provider approved successfully",
                });
            } catch (error) {
                console.error('Error approving service provider:', error);
                toast({
                    title: "Error",
                    description: "Failed to approve Service Provider",
                    variant: "destructive",
                });
            }
        }
    };

    const handleRejectServiceProvider = async () => {
        if (selectedUser?.ServiceProvider) {
            try {
                await updateServiceProviderStatus({...selectedUser.ServiceProvider, status: ServiceProviderStatus.REFUSED})
                fetchUsers().then();
                setModalOpen(false);
                toast({
                    title: "Success",
                    description: "Service Provider rejected successfully",
                });
            } catch (error) {
                console.error('Error rejecting service provider:', error);
                toast({
                    title: "Error",
                    description: "Failed to reject Service Provider",
                    variant: "destructive",
                });
            }
        }
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
        {
            key: 'serviceProviderStatus',
            header: 'Service Provider Status',
            render: (user: User) => user.ServiceProvider ? user.ServiceProvider.status : 'N/A'
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
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Service Provider Status</h4>
                        <div className="flex flex-col space-y-1">
                            {['PENDING', 'ACCEPTED', 'REFUSED'].map((status) => (
                                <div key={status} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`sp-${status}`}
                                        checked={filters.serviceProviderStatus[status.toLowerCase() as keyof typeof filters.serviceProviderStatus]}
                                        onCheckedChange={() => handleFilterChange('serviceProviderStatus', status.toLowerCase())}
                                    />
                                    <Label htmlFor={`sp-${status}`}>{status}</Label>
                                </div>
                            ))}
                        </div>
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
                title={modalMode === 'edit' ? 'Edit User' : modalMode === 'ban' ? 'Ban User' : 'Approve/Reject Service Provider'}
                initialData={selectedUser || {}}
                mode={modalMode === 'edit' ? 'edit' : 'create'}
                additionalActions={
                    modalMode === 'approveReject' && selectedUser?.ServiceProvider
                        ? (
                            <>
                                <Button onClick={handleApproveServiceProvider}>Approve</Button>
                                <Button onClick={handleRejectServiceProvider} variant="destructive">Reject</Button>
                            </>
                        )
                        : undefined
                }
            />
        </div>
    );
};

export default UserTable;