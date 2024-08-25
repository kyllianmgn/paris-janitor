import {PropertyDetails} from "@/app/(protected)/properties/[id]/PropertyDetails";

export default async function PropertiesIdPage({params}: {params: {id: string}}){
    return (
        <>
            <PropertyDetails id={+params.id}/>
        </>
    )
}