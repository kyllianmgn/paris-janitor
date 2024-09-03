import {UserDetails} from "@/app/(protected)/users/[id]/UserDetails";

export default function UsersIdPage({params}: {params: {id: number}}){

    return (
        <div>
            <UserDetails id={params.id}/>
        </div>
    )
}