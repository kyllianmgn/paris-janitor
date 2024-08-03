export interface Landlords {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface ApiResponse {
    data: Landlords
}

export const getLandlordById = async (id: string): Promise<ApiResponse> => {
    const res = await fetch(`/landlords/${id}`);

    if (!res.ok) {
        throw new Error('Failed to fetch landlords');
    }

    return res.json();
}
