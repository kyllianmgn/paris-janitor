import RentalList from "@/components/public/RentalList";

export default function HomePage({searchParams,}: { searchParams?: { query?: string; page?: string}}) {
    const query = searchParams?.query || '';
    const page = searchParams?.page || 0;

  return (
    <div>
        <main>
            <RentalList query={query} page={+page}/>
        </main>
    </div>
  );
}
