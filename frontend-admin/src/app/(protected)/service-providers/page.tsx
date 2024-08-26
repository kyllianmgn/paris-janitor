import PropertyList from "@/components/list/property/PropertyList";
import ServiceProviderList from "@/components/list/service-provider/ServiceProviderList";

export default function ServiceProviderPage({searchParams,}: { searchParams?: { query?: string; page?: string; };
}){
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    return (
        <div>
            <h1 className="text-3xl font-bold m-2">Service Providers</h1>
            <ServiceProviderList query={query} page={currentPage}/>
        </div>
    )
}