import {ServicePage} from "@/components/services/ServicePage";

export default function ServicesIdPage({params}:{params: {id: string}}){
    return (
        <>
            <ServicePage serviceId={+params.id}></ServicePage>
        </>
    )
}
