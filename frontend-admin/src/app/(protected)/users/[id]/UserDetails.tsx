"use client"
import {ChangeEvent, useEffect, useState} from "react";
import {Service, User} from "@/types";
import {Button} from "@/components/ui/button";
import {getUserRole} from "@/app/(protected)/users/UserCard";
import {getUserById} from "@/api/services/user-service";

export const UserDetails = ({id}: { id: number }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<String>("Loading");
    const [loading, setLoading] = useState<boolean>(true);

    const loadUser = async () => {
        const user = await getUserById(id)
        setUser(user.data)
        setRole(getUserRole(user.data))
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