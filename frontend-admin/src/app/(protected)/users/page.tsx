import ServiceProviderList from "@/components/list/service-provider/ServiceProviderList";
import UserList from "@/components/list/users/UserList";

export default ({searchParams,}: { searchParams?: { query?: string; page?: string; };
}) => {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    return (
        <div>
            <h1 className="text-3xl font-bold m-2">Users</h1>
            <UserList query={query} page={currentPage}/>
        </div>
    )
}