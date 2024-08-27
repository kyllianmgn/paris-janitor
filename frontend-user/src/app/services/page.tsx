import {Services} from "@/components/services/Services";

export default function ServicesPage({searchParams,}: { searchParams?: { query?: string; page?: string; }}){
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    return (
        <>
            <Services query={query} page={currentPage}></Services>
        </>
    )
}
