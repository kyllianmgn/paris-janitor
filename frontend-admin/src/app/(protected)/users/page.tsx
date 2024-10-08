import UserList from "@/components/list/users/UserList";
import UserTable from "@/components/list/users/UserTable";

export default function UsersPage({searchParams,}: { searchParams?: { query?: string; page?: string; };
}){
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    return (
        <div>
            <h1 className="text-3xl font-bold m-2">Users</h1>
            <UserTable />
        </div>
    )
}