import {Property} from "@/components/properties/Properties";

interface ApiResponse1 {
    data: Property
}

export const getPropertyById = async (id: string): Promise<ApiResponse1> => {
    const res = await fetch(`http://localhost:3000/properties/${id}`);

    if (!res.ok) {
        throw new Error('Failed to fetch properties');
    }

    return res.json();
}

interface ApiResponse2 {
    data: Property[]
}

export const getProperties = async (): Promise<ApiResponse2> => {
    const res = await fetch(`http://localhost:3000/properties`);

    if (!res.ok) {
        throw new Error('Failed to fetch properties');
    }

    return res.json();
}
