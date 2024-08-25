import {PropertyDetails} from "@/app/(protected)/properties/[id]/PropertyDetails";
import {ServiceDetails} from "@/app/(protected)/services/[id]/ServiceDetails";

export default async function ServicesIdPage({params, searchParams}: {params: {id: string}, searchParams: {query?: string, page?: number}}){
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    return (
        <>
            <ServiceDetails id={+params.id}/>
        </>
    )
}