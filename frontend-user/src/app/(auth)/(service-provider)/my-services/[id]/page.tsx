import {ServiceDetail} from "@/components/services/ServiceDetail";

export default function PropertiesRoute({params}: Readonly<{ params: { id: number } }>) {
    return <ServiceDetail serviceId={params.id}></ServiceDetail>
}
