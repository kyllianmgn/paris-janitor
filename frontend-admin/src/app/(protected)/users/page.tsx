import ServiceProviderList from "@/app/(protected)/service-providers/ServiceProviderList";
import UserList from "@/app/(protected)/users/UserList";

export default ({searchParams,}: { searchParams?: { query?: string; page?: string; };
}) => {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    return (
        <div>
            <UserList query={query} page={currentPage} />
        </div>
    )
}