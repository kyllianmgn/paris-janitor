"use client"
import {useEffect, useRef, useState} from "react";
import {User} from "@/types";
import {getUserRole} from "@/components/list/users/UserCard";
import {editUser, getUserById} from "@/api/services/user-service";
import ReservationList from "@/components/list/reservation/ReservationList";
import PropertyList from "@/components/list/property/PropertyList";
import {Check, Pencil, X} from "lucide-react";
import {Input} from "@/components/ui/input";

export const UserDetails = ({id, query, page}: { id: number, query?: string, page?: number}) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<String>("Loading");
    const [loading, setLoading] = useState<boolean>(true);
    const [editing, setEditing] = useState<boolean>(false);
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    const loadUser = async () => {
        const user = await getUserById(id)
        setLoading(true)
        setUser(user.data)
        setRole(getUserRole(user.data))
        setLoading(false)
    }

    const renderDetails = () => {
        switch (role){
            case "Traveler":
                return (
                    <>
                        <h1 className={"text-xl font-semibold"}>Réservation de {user?.firstName} {user?.lastName}</h1>
                        <ReservationList travelerId={user?.Traveler?.id} mode={"traveler"} query={query} page={page}/>
                    </>
                )
            case "Service Provider":
                return null
            case "Landlord":
                return (
                    <>
                        <h1 className={"text-xl font-semibold"}>Propriétés de {user?.firstName} {user?.lastName}</h1>
                        <PropertyList landlordId={user?.Landlord?.id} query={query} page={page}/>
                    </>
            )
        }
        return null
    }

    const handleConfirm = async () => {
        if (!user || !lastNameRef.current || !firstNameRef.current || !emailRef.current) return;
        const newUser = await editUser(user.id, {...user, lastName: lastNameRef?.current.value, firstName: firstNameRef?.current.value, email: emailRef?.current.value})
        setUser(newUser.data)
        setEditing(false)
    }

    useEffect(() => {
        loadUser().then()
    });

    return (
        <div>
            {
                user ?
                    <>
                        <h1 className="text-3xl font-bold flex">Profil de
                            {editing ?
                                <>
                                    <div className={"flex"}>
                                        <Input ref={firstNameRef} className={"max-w-5xl"} defaultValue={user.firstName}/>
                                        <Input ref={lastNameRef} className={"max-w-5xl"} defaultValue={user.lastName}/>

                                    </div>
                                    <X className={"cursor-pointer"} onClick={() => {setEditing(false)}}/>
                                    <Check className={"cursor-pointer"} onClick={() => {handleConfirm().then()}}/>
                                </>
                                :
                                <>
                                     &nbsp;{user.firstName} {user.lastName}
                                    <Pencil className={"cursor-pointer"} onClick={() => {setEditing(true)}}/>
                                </>
                            }
                            </h1>
                        <h2 className="text-2xl font-semibold">Email : {editing ?
                            <Input ref={emailRef} className={"max-w-5xl"} defaultValue={user.email}/> : `${user.email}` }</h2>
                        <h2 className="text-2xl font-semibold">Role : {role}</h2>
                        <hr className={"my-3"}/>
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