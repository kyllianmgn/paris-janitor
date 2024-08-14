import { Property, PropertyStatus } from "@/types";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {Badge, BadgeProps} from "@/components/ui/badge";

export interface PropertyCardProps {
    property: Property
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
    const router = useRouter();
    const onClickCard = () => {
        router.push(`/properties/${property.id}`);
    }

    const getBadgeVariant = (status: PropertyStatus): BadgeProps['variant'] => {
        switch (status) {
            case PropertyStatus.APPROVED:
                return "secondary";
            case PropertyStatus.PENDING:
                return "default";
            case PropertyStatus.REJECTED:
                return "destructive";
            default:
                return "default";
        }
    }

    return (
        <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={onClickCard}>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>{property.city}, {property.country}</span>
                    <Badge variant={getBadgeVariant(property.status!)}>
                        {property.status}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-600">{property.address}</p>
                <p className="mt-2 text-sm line-clamp-3">{property.description}</p>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-gray-500">Last updated: {new Date(property.updatedAt!).toLocaleDateString()}</p>
            </CardFooter>
        </Card>
    )
}