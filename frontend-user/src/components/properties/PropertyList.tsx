import {Property} from "@/components/properties/Properties";
import {PropertyCard} from "@/components/properties/PropertyCard";
import "./PropertyList.css"

export interface PropertyListProps {
    properties: Property[]
}

export const PropertyList = ({properties}: PropertyListProps) => {
    return (
        <div className="property-list">
            {properties.map((property: Property) => (
                <PropertyCard key={property.id} property={property}></PropertyCard>
            ))}
        </div>
    )
}
