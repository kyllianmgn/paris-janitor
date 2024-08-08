import {PropertyDetails} from "@/app/(protected)/properties/[id]/PropertyDetails";
import {ServiceProviderDetails} from "@/app/(protected)/service-providers/[id]/ServiceProviderDetails";

export default async ({params}: {params: {id: string}}) => {
    return (
        <>
            <ServiceProviderDetails id={+params.id}/>
        </>
    )
}