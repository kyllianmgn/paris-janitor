'use client';
import {SearchIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useDebouncedCallback} from "use-debounce";

export default function Search({placeholder}: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter()

    const handleSearch = useDebouncedCallback((term) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);

        } else {
            params.delete('query');
        }

        params.delete('page');
        router.replace(`${pathname}?${params.toString()}`);
    }, 500);

    return (
        <div className="relative flex flex-1 flex-shrink-0">
            <SearchIcon
                className="absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
            <Input
                defaultValue={searchParams.get('query')?.toString()}
                placeholder={placeholder}
                onChange={(e) => {
                    handleSearch(e.target.value);
                }}
            />
        </div>
    );
}