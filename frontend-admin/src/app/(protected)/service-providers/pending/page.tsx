import PropertyList from "@/app/(protected)/properties/PropertyList";
import ServiceProviderList from "@/app/(protected)/service-providers/ServiceProviderList";

export default () => {
    return (
        <div>
            <h1 className="text-3xl font-bold m-2">Pending Service Providers</h1>
            <ServiceProviderList pending={true}/>
        </div>
    )
}