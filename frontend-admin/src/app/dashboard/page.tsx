import {useDispatch, useSelector} from "react-redux";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {RootState} from "@/store";

export default function Dashboard() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { admin, isAuthenticated } = useSelector((state: RootState) => state.auth);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <div className="flex items-center">
                        <span className="mr-4">Welcome, {admin.username}</span>
                        <Button onClick={() => alert("logout")}>Logout</Button>
                    </div>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

                    <div className="px-4 py-6 sm:px-0">
                        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
                            <h2 className="text-2xl font-semibold mb-4">Dashboard Content</h2>
                        </div>
                    </div>
                </div>
            </main>
        </div>

    );
}