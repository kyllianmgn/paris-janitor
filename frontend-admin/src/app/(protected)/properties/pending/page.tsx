import PropertyList from "@/app/(protected)/properties/PropertyList";

export default () => {
    return (
        <div>

            <h1 className="text-3xl font-bold m-2">Pending Properties</h1>
            <PropertyList pending={true}/>
        </div>
    )
}