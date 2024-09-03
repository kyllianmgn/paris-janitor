import PropertyDetail from "@/components/properties/PropertyDetail";


export default function PropertiesRoute({params}: Readonly<{ params: { id: number } }>) {
    return <PropertyDetail propertyId={params.id} isPersonal={true}></PropertyDetail>
}
