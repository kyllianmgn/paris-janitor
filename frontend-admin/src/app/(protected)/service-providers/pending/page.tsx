import PropertyList from "@/components/list/property/PropertyList";
import ServiceProviderList from "@/components/list/service-provider/ServiceProviderList";

export default () => {
    return (
        <div>
            <h1 className="text-3xl font-bold m-2">Pending Service Providers</h1>
            <ServiceProviderList pending={true}/>
        </div>
    )
}