import {PropertyDetail} from "@/components/properties/details/PropertyDetail";

export default function PropertiesRoute({params}: Readonly<{ params: { id: string } }>) {
    return <PropertyDetail propertyId={params.id}></PropertyDetail>
}
