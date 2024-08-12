import { Input } from "@/components/ui/input";
import {Search} from "lucide-react";

export default function SearchBar() {
    return ((
        <div className="hidden sm:block flex-grow max-w-md mx-4">
            <div className="relative">
                <Input
                    type="search"
                    placeholder="Search for properties..."
                    className="w-full pl-10 pr-4"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
            </div>
        </div>
    ));
}