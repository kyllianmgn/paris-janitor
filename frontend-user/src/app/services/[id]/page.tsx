import {ServicePage} from "@/components/services/ServicePage";

export default ({params}:{params: {id: string}}) => {
    return (
        <>
            <ServicePage serviceId={+params.id}></ServicePage>
        </>
    )
}
