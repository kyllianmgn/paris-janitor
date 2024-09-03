import {Button} from "@/components/ui/button";
import React, {FormEvent, useRef, useState} from "react";
import {useToast} from "@/components/ui/use-toast";
import {profileService} from "@/api/services/profileService";

export interface ChangePasswordReq {
    oldPassword: string;
    newPassword: string;
}

export const SecurityTab = () => {
    const oldPasswordInput = useRef<HTMLInputElement>(null);
    const newPasswordInput = useRef<HTMLInputElement>(null);
    const confirmPasswordInput = useRef<HTMLInputElement>(null);

    const [error, setError] = useState<string | null>(null);
    const {toast} = useToast();

    const onChange = async () => {
        setError(null);
    }

    const onFormSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!oldPasswordInput.current?.value || !newPasswordInput.current?.value || !confirmPasswordInput.current?.value) {
            setError("Please fill in all fields");
            return;
        }

        if (newPasswordInput.current.value !== confirmPasswordInput.current.value) {
             setError("Passwords don't match");
            return;
        }

        const res = await profileService.changePassword({
            oldPassword: oldPasswordInput.current.value,
            newPassword: newPasswordInput.current.value,
        });

        if (res.status === 200) {
            oldPasswordInput.current.value = "";
            newPasswordInput.current.value = "";
            confirmPasswordInput.current.value = "";

            toast({
                title: "Success",
                description: "Password changed successfully",
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
            <h4 className="text-2xl font-bold text-center pb-6 w-full">Change password</h4>

            <form onSubmit={onFormSubmit}>
                <div className="flex justify-center">
                    <div className="text-left w-fit" id="divtocenter">
                        <p className="font-bold w-fit">Old Password</p>
                        <input name="oldPassword" type="password" onChange={onChange} ref={oldPasswordInput} required
                               className="mb-3 h-10 w-full rounded-md border border-input px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"/>

                        <p className="font-bold w-fit">New Password</p>
                        <input name="newPassword" type="password" onChange={onChange} ref={newPasswordInput} minLength={8} required
                               className="mb-3 h-10 w-full rounded-md border border-input px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"/>

                        <p className="font-bold w-fit">Confirm Password</p>
                        <input name="confirmPassword" type="password" onChange={onChange} ref={confirmPasswordInput} minLength={8} required
                               className="mb-3 h-10 w-full rounded-md border border-input px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"/>
                    </div>
                </div>

                {error !== null && (
                    <p className="text-red-600 mb-4">{error}</p>
                )}
                <Button type="submit" disabled={error !== null}>Submit</Button>
            </form>
        </div>
    );
}
