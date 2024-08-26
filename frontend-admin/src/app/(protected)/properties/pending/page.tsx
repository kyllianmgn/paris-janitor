import PropertyList from "@/components/list/property/PropertyList";

export default function PropertiesPendingPage(){
    return (
        <div>

            <h1 className="text-3xl font-bold m-2">Pending Properties</h1>
            <PropertyList pending={true}/>
        </div>
    )
}