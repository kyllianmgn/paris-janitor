"use client"
import {User} from "@/types";
import {ArrowRight} from "lucide-react";
import Link from "next/link";
import {ChangeEvent, useEffect, useState} from "react";
import {getServiceCount} from "@/api/services/service-service";
import {Button} from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import {banUser} from "@/api/services/user-service";

export const getUserRole = (user: User): string => {
    if (user.Landlord){
        return "Landlord"
    }else if(user.ServiceProvider){
        return "Service Provider"
    }else if(user.Traveler){
        return "Traveler"
    }
    return "None ?"
}

export const getLink = (user: User): string => {
    if(user.ServiceProvider) return "service-providers"
    return "users"
}

export default function UserCard({user}: {user: User}){
    const role = getUserRole(user)
    const [modalOpen, setModalOpen] = useState(false)
    const [permanentBannedCheckbox, setPermanentBannedCheckbox] = useState(false)

    const openModal = () => {setModalOpen(true); setPermanentBannedCheckbox(false)};
    const closeModal = () => setModalOpen(false);

    const onModalOpen = () => {
        openModal()
    }

    const onModalClose = () => {
        closeModal()
    }

    const onBanCheckboxChange = (event: any) => {
        setPermanentBannedCheckbox(prevState => {return !prevState})
    }

    const onBanSubmit = (data: { bannedUntil?: string, bannedPermanently?: string }) => {
        closeModal();
        if (data.bannedPermanently && data.bannedPermanently == "on"){
            const bannedUntil = new Date();
            bannedUntil.setFullYear(bannedUntil.getFullYear() + 1000);
            banUser(user.id, bannedUntil).then()
        }else if(data.bannedUntil){
            let bannedUntil = new Date(data.bannedUntil)
            banUser(user.id, bannedUntil).then()
        }
    }

    return (
        <div className="flex border-transparent border-b-gray-300 border-2 px-3 py-0.5 items-center justify-between">
            <div className="flex items-center">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold">{user.firstName} {user.lastName}</h1>
                    <h2 className="text-sm">Role : {role}</h2>
                </div>
            </div>
            {
                user.bannedUntil ?
                    <div className="flex flex-col">
                        <Button className="cursor-not-allowed" variant={"destructive"} disabled={true}>Déjà banni</Button>
                        <p>{`Banni jusqu'à ${user.bannedUntil}`}</p>
                    </div>
                    :
                    <Button onClick={onModalOpen} variant={"destructive"}>Bannir</Button>
            }
            <Modal buttonVariant={"destructive"} isOpen={modalOpen} onClose={closeModal} onSubmit={onBanSubmit} submitMessage={"Bannir"}>
                <h1>Bannir {user.firstName} {user.lastName} ?</h1>
                <div>
                    <Label>Bannir jusqu&apos;à</Label>
                    <Input required={!permanentBannedCheckbox} disabled={permanentBannedCheckbox} name={"bannedUntil"} type={"datetime-local"}></Input>
                    <Checkbox checked={permanentBannedCheckbox} title="Bannir Indéfiniment" onClick={onBanCheckboxChange} name={"bannedPermanently"}></Checkbox><Label>Bannir Indéfiniment</Label>
                </div>
            </Modal>
            <Link href={`/${getLink(user)}/` + user.id}>
                <ArrowRight className="cursor-pointer"/>
            </Link>
        </div>
    )
}