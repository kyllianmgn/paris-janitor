import {Button} from "@/components/ui/button";
import React from "react";

export const SecurityTab = () => {

    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 text-center">
            <h4 className="text-2xl font-bold text-center pb-6 w-full">Change password</h4>

            <div className="flex justify-center">
                <div className="text-left w-fit" id="divtocenter">
                    <p className="font-bold w-fit">Old Password</p>
                    <input
                        className="mb-3 h-10 w-full rounded-md border border-input px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        name="oldpassword" type="password"/>

                    <p className="font-bold w-fit">New Password</p>
                    <input
                        className="mb-3 h-10 w-full rounded-md border border-input px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        name="newpassword" type="password"/>

                    <p className="font-bold w-fit">Confirm Password</p>
                    <input
                        className="mb-3 h-10 w-full rounded-md border border-input px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        name="confirmpassword" type="password"/>
                </div>
            </div>

            <Button>Submit</Button>
        </div>
    );
}
