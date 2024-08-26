import {UserDetails} from "@/app/(protected)/users/[id]/UserDetails";

export default function UsersIdPage({params, searchParams}: {params: {id: number},searchParams?: { query?: string; page?: string; }}){
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    return (
        <div>
            <UserDetails id={params.id} query={query} page={currentPage}/>
        </div>
    )
}