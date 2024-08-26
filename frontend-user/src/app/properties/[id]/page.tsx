import {PropertyPage} from "@/components/properties/PropertyPage";

export default function PropertiesRoute({params}: Readonly<{ params: { id: number } }>) {
    return <PropertyPage propertyId={params.id}></PropertyPage>
}
