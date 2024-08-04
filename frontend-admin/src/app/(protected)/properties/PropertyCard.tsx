import {Property} from "@/types";

export default function PropertyCard({property}: {property: Property}){
    return (
        <div className="flex gap-3">
            {property.address}
            {property.description}
            {property.status}
            {property.landlord?.user?.firstName } { property.landlord?.user?.lastName }
        </div>
    )
}