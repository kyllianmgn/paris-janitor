import PropertyList from "@/app/(protected)/properties/PropertyList";
import ServiceProviderList from "@/app/(protected)/service-providers/ServiceProviderList";

export default () => {

    return (
        <div>
            <h1 className="text-3xl font-bold">Service Providers</h1>
            <ServiceProviderList/>
        </div>
    )
}