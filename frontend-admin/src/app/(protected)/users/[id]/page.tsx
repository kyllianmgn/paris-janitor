import {UserDetails} from "@/app/(protected)/users/[id]/UserDetails";

export default ({params}: {params: {id: number}}) => {
    return (
        <div>
            <UserDetails id={params.id}/>
        </div>
    )
}