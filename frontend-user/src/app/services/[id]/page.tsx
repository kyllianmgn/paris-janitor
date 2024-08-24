import {ServiceDetail} from "@/components/services/ServiceDetail";

export default ({params}:{params: {id: string}}) => {
    return (
        <>
            <ServiceDetail serviceId={+params.id}></ServiceDetail>
        </>
    )
}
