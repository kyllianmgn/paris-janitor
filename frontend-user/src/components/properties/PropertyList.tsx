import {Property} from "@/components/properties/Properties";
import {PropertyCard} from "@/components/properties/PropertyCard";

export interface PropertyListProps {
    properties: Property[]
}

export const PropertyList = ({properties}: PropertyListProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {properties.map((property: Property) => (
                <PropertyCard key={property.id} property={property}></PropertyCard>
            ))}
        </div>
    )
}
