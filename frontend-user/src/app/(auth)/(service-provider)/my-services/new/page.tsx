import {ServiceForm} from "@/components/services/ServiceForm";

export default function NewPropertyPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Ajouter un nouveau service</h1>
            <ServiceForm />
        </div>
    );
}