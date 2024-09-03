import {Intervention, Service} from "@/types";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export interface InterventionCardProps {
    intervention: Intervention,
}

export const InterventionCard = ({ intervention }: InterventionCardProps) => {
    const router = useRouter();
    const onClickCard = () => {
            router.push(`/interventions/${intervention.id}`);
    }

    return (
        <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={onClickCard}>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>{intervention.service?.name}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mt-2 text-sm line-clamp-3">{intervention?.providerOccupation?.startDate.toISOString()} {intervention?.providerOccupation?.endDate.toISOString()}</p>
            </CardContent>
        </Card>
    )
}