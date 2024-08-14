import {PropertyDetails} from "@/app/(protected)/properties/[id]/PropertyDetails";
import {ServiceProviderDetails} from "@/app/(protected)/service-providers/[id]/ServiceProviderDetails";

export default async ({params, searchParams}: {params: {id: string},searchParams?: { query?: string; page?: string; }}) => {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    return (
        <>
            <ServiceProviderDetails id={+params.id} query={query} page={currentPage}/>
        </>
    )
}