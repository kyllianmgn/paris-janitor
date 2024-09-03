import {User} from "@/types";
import {Button} from "@/components/ui/button";
import React, {FormEvent, useRef, useState} from "react";
import {profileService} from "@/api/services/profileService";
import {useToast} from "@/components/ui/use-toast";

export interface UpdateUserInfoReq {
    firstName: string;
    lastName: string;
    email: string;
}

export interface PersonalInfoTabProps {
    user: User
}

export const PersonalInfoTab = ({user}: PersonalInfoTabProps) => {
    const firstNameInput = useRef<HTMLInputElement>(null);
    const lastNameInput = useRef<HTMLInputElement>(null);
    const emailInput = useRef<HTMLInputElement>(null);

    const [error, setError] = useState<boolean>(false);
    const {toast} = useToast();

    const onFormSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!firstNameInput.current?.value || !lastNameInput.current?.value || !emailInput.current?.value) {
            setError(true);
            return;
        }

        const res = await profileService.updateUserInfo({
            firstName: firstNameInput.current.value,
            lastName: lastNameInput.current.value,
            email: emailInput.current.value,
        });

        if (res.status === 200) {
            toast({
                title: "Success",
                description: "Personal informations updated successfully",
            });
            return;
        }

        toast({
            variant: "destructive",
            title: "Error",
            description: "An error has occurred.",
        });
    }

    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 text-center">
            <h4 className="text-2xl font-bold pb-6">Personal informations</h4>

            <form onSubmit={onFormSubmit}>
                <div className="grid grid-cols-2 grid-rows-2 gap-4">
                    <div className="text-left">
                        <p className="font-bold">First name</p>
                        <input name="firstName" type="text" defaultValue={user.firstName} ref={firstNameInput} required
                               className="mb-3 h-10 w-full rounded-md border border-input px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"/>
                    </div>
                    <div className="text-left">
                        <p className="font-bold">Last name</p>
                        <input name="lastName" type="text" defaultValue={user.lastName} ref={lastNameInput} required
                               className="mb-3 h-10 w-full rounded-md border border-input px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"/>
                    </div>
                    <div className="text-left">
                        <p className="font-bold">Email</p>
                        <input name="email" type="email" defaultValue={user.email} ref={emailInput} required
                               className="mb-3 h-10 w-full rounded-md border border-input px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"/>
                    </div>
                </div>

                {error && (
                    <p className="text-red-600 mb-4">Please check the information and try again.</p>
                )}
                <Button type="submit" disabled={error}>Submit</Button>
            </form>
        </div>
    );
}
