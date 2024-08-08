import {ArrowLeft, ArrowRight} from "lucide-react";
import {useDebouncedCallback} from "use-debounce";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

export default function Pagination({count, itemsName}: {count: number, itemsName: string}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter()

    const handlePageChange = useDebouncedCallback((term) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('page', term);
        } else {
            params.delete('page');
        }
        router.replace(`${pathname}?${params.toString()}`);
    }, 500);

    const onBackPage = () => {
        const params = new URLSearchParams(searchParams);
        const oldPage = Number(params.get('page') || 1);
        params.set('page',String(oldPage-1));
        router.replace(`${pathname}?${params.toString()}`);
    }

    const onNextPage = () => {
        const params = new URLSearchParams(searchParams);
        const oldPage = Number(params.get('page') || 1);
        params.set('page',String(oldPage+1));
        router.replace(`${pathname}?${params.toString()}`);
    }

    const pageSize = (+(searchParams.get('pageSize') || 10 ))
    const page = (+(searchParams.get('page')?.toString() || 1))

    const options = Array.from({ length: Math.ceil(count/pageSize)}, (_, index) => index + 1);

    return (
        <div className="flex justify-between">
            <h2 className="text-lg">{count} {itemsName}</h2>
            <div className="flex align-middle ">
                <button onClick={onBackPage} disabled={page <= 1}><ArrowLeft></ArrowLeft></button>
                <select className="rounded p-1"
                    value={page}
                    onChange={(e) => {
                        handlePageChange(e.target.value);
                    }}
                >
                    {
                        options.length ?
                        options.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))
                            :
                        <option>1</option>
                    }

                </select>
                /{Math.ceil(count / pageSize)}
                <button onClick={onNextPage} disabled={page >= Math.ceil(count / pageSize)}><ArrowRight></ArrowRight>
                </button>
            </div>
        </div>
    )
}