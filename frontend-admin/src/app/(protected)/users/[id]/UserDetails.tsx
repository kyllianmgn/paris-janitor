"use client"
import React, { useEffect, useState } from "react";
import { User } from "@/types";
import { getUserById, editUser, banUser, resetPassword } from "@/api/services/user-service";
import { EntityDetails } from "@/components/public/EntityDetails";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import ReservationList from "@/components/list/reservation/ReservationList";
import PropertyList from "@/components/list/property/PropertyList";
import ServiceList from "@/components/list/service/ServiceList";
import { useRouter } from "next/navigation";

export const UserDetails: React.FC<{ id: number }> = ({ id }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [editing, setEditing] = useState<boolean>(false);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        loadUser();
    }, [id]);

    const loadUser = async () => {
        setLoading(true);
        try {
            const response = await getUserById(id);
            setUser(response.data);
        } catch (error) {
            console.error("Error loading user:", error);
            toast({
                title: "Error",
                description: "Failed to load user details",
                variant: "destructive",
            });
        }
        setLoading(false);
    };

    const handleEdit = async (updatedData: Partial<User>) => {
        if (!user) return;
        try {
            const response = await editUser(user.id, updatedData);
            setUser(response.data);
            toast({
                title: "Success",
                description: "User details updated successfully",
            });
        } catch (error) {
            console.error("Error updating user:", error);
            toast({
                title: "Error",
                description: "Failed to update user details",
                variant: "destructive",
            });
        }
        setEditing(false);
    };

    const handleBan = async () => {
        if (!user) return;
        try {
            await banUser(user.id, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // Ban for 30 days
            await loadUser();
            toast({
                title: "Success",
                description: "User banned successfully",
            });
        } catch (error) {
            console.error("Error banning user:", error);
            toast({
                title: "Error",
                description: "Failed to ban user",
                variant: "destructive",
            });
        }
    };

    const handleResetPassword = async () => {
        if (!user) return;
        try {
            await resetPassword(user.id);
            toast({
                title: "Success",
                description: "Password reset email sent",
            });
        } catch (error) {
            console.error("Error resetting password:", error);
            toast({
                title: "Error",
                description: "Failed to reset password",
                variant: "destructive",
            });
        }
    };

    const handleBack = () => {
        router.push('/users');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    const sections = [
        {
            title: "Personal Information",
            content: (user: User) => (
                <div className="space-y-2">
                    <div>
                        <strong>First Name:</strong> {editing ? <Input value={user.firstName} onChange={(e) => handleEdit({ ...user, firstName: e.target.value })} /> : user.firstName}
                    </div>
                    <div>
                        <strong>Last Name:</strong> {editing ? <Input value={user.lastName} onChange={(e) => handleEdit({ ...user, lastName: e.target.value })} /> : user.lastName}
                    </div>
                    <div>
                        <strong>Email:</strong> {editing ? <Input value={user.email} onChange={(e) => handleEdit({ ...user, email: e.target.value })} /> : user.email}
                    </div>
                </div>
            ),
        },
        {
            title: "Account Information",
            content: (user: User) => (
                <div className="space-y-2">
                    <div><strong>Role:</strong> {user.Landlord ? "Landlord" : user.ServiceProvider ? "Service Provider" : user.Traveler ? "Traveler" : "Unknown"}</div>
                    <div><strong>Status:</strong> {user.bannedUntil ? `Banned until ${new Date(user.bannedUntil).toLocaleDateString()}` : "Active"}</div>
                    <div><strong>Subscription:</strong> {user.subscriptions && user.subscriptions.length > 0 ? "Active" : "Inactive"}</div>
                </div>
            ),
        },
        {
            title: "Related Information",
            content: (user: User) => (
                <div className="space-y-4">
                    {user.Traveler && (
                        <div>
                            <h3 className="text-lg font-semibold">Reservations</h3>
                            <ReservationList travelerId={user.Traveler.id} mode="traveler" />
                        </div>
                    )}
                    {user.Landlord && (
                        <div>
                            <h3 className="text-lg font-semibold">Properties</h3>
                            <PropertyList landlordId={user.Landlord.id} />
                        </div>
                    )}
                    {user.ServiceProvider && (
                        <div>
                            <h3 className="text-lg font-semibold">Services</h3>
                            <ServiceList providerId={user.ServiceProvider.id} />
                        </div>
                    )}
                </div>
            ),
        },
    ];

    const actions = (
        <div className="space-x-2">
            <Button onClick={handleBack}>Back</Button>
            <Button onClick={() => setEditing(!editing)}>{editing ? "Cancel" : "Edit"}</Button>
            <Button onClick={handleResetPassword}>Reset Password</Button>
            <Button onClick={handleBan} variant="destructive">Ban User</Button>
        </div>
    );

    return <EntityDetails entity={user} title={`User Details: ${user.firstName} ${user.lastName}`} sections={sections} actions={actions} />;
};