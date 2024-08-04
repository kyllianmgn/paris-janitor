import RentalList from "@/components/public/RentalList";
import Header from "@/components/public/Header";

export default function HomePage() {
  return (
    <div>
        <Header />
        <main>
            <RentalList />
        </main>
    </div>
  );
}
