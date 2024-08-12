"use client"
import {ChangeEvent, useEffect, useState} from "react";
import {Service, User} from "@/types";
import {Button} from "@/components/ui/button";
import {getUserRole} from "@/components/list/users/UserCard";
import {getUserById} from "@/api/services/user-service";
import ReservationList from "@/components/list/reservation/ReservationList";
import PropertyList from "@/components/list/property/PropertyList";

export const UserDetails = ({id}: { id: number }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<String>("Loading");
    const [loading, setLoading] = useState<boolean>(true);

    const loadUser = async () => {
        const user = await getUserById(id)
        setUser(user.data)
        setRole(getUserRole(user.data))
    }

    const renderDetails = () => {
        switch (role){
            case "Traveler":
                return (
                    <ReservationList travelerId={user?.Traveler?.id} mode={"traveler"}/>
                )
            case "Service Provider":
                return null
            case "Landlord":
                return (
                    <PropertyList landlordId={user?.Landlord?.id}/>
                )
        }
        return null
    }

    useEffect(() => {
        loadUser().then()
    }, []);

    return (
        <div>

            {
                user ?
                    <>
                        <h1 className="text-xl font-bold">{user.firstName} {user.lastName}</h1>
                        <h2 className="text-lg">Role : {role}</h2>
                        {renderDetails()}
                    </>
                    :
                    loading ?
                        <h1 className="text-xl font-bold">Loading</h1>
                        :
                        <>
                            <h1>Users Not Found</h1>
                        </>
            }
        </div>
    )
}