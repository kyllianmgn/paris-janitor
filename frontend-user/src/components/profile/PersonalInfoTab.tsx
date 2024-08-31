import {User} from "@/types";
import {Button} from "@/components/ui/button";
import React from "react";

export interface PersonalInfoTabProps {
    user: User
}

export const PersonalInfoTab = ({user}: PersonalInfoTabProps) => {

    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 text-center">
            <h4 className="text-2xl font-bold pb-6">Personal informations</h4>

            <div className="grid grid-cols-2 grid-rows-2 gap-4">
                <div className="text-left">
                    <p className="font-bold">First name</p>
                    <input
                        className="mb-3 h-10 w-full rounded-md border border-input px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        name="firstName" type="text" value={user.firstName}/>
                </div>
                <div className="text-left">
                    <p className="font-bold">Last Name</p>
                    <input
                        className="mb-3 h-10 w-full rounded-md border border-input px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        name="lastName" type="text" value={user.lastName}/>
                </div>
                <div className="text-left">
                    <p className="font-bold">Email</p>
                    <input
                        className="mb-3 h-10 w-full rounded-md border border-input px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        name="email" type="email" value={user.email}/>
                </div>
            </div>

            <Button>Submit</Button>
        </div>
    );
}
