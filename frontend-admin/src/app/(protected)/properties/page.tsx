import PropertyList from "@/components/list/property/PropertyList";

export default ({searchParams,}: { searchParams?: { query?: string; page?: string; };
}) => {

    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    return (
        <div>
            <h1 className="text-3xl font-bold m-2">Properties</h1>
            <PropertyList query={query} page={currentPage}/>
        </div>
    )
}