import { Service } from "@/types";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export interface ServiceCardProps {
    service: Service,
    personal?: boolean
}

export const ServiceCard = ({ service, personal = false }: ServiceCardProps) => {
    const router = useRouter();
    const onClickCard = () => {
        if (personal){
            router.push(`/my-services/${service.id}`);
        }else{
            router.push(`/services/${service.id}`);
        }
    }

    return (
        <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={onClickCard}>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>{service.name}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mt-2 text-sm line-clamp-3">{service.description}</p>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-gray-500">Last updated: {new Date(service.updatedAt!).toLocaleDateString()}</p>
            </CardFooter>
        </Card>
    )
}