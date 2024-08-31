import { PropertyForm } from "@/components/properties/PropertyForm";

export default function NewPropertyPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">New Property</h1>
            <PropertyForm />
        </div>
    );
}