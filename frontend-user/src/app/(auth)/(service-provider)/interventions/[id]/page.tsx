import {ServiceDetail} from "@/components/services/ServiceDetail";
import {InterventionDetails} from "@/components/interventions/InterventionDetail";

export default function InterventionsIdPage({params}: Readonly<{ params: { id: number } }>) {
    return <InterventionDetails serviceId={params.id}></InterventionDetails>
}
