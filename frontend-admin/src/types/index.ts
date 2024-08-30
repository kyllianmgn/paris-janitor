export interface Admin {
    id: number;
    username: string;
}

export interface AdminLoginRequest {
    username: string;
    password: string;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

export interface DecodedAdminToken {
    adminId: number;
    username: string;
    exp: number;
}

export interface AuthState {
    admin: Admin | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
}

export interface Property {
    id?: number;
    landlordId: number;
    address: string;
    description: string;
    status: PropertyStatus;
    createdAt: string;
    updatedAt: string;
    landlord?: Landlord
}

export interface Landlord {
    id: number,
    userId: number;
    user?: User
}


export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    Landlord: Landlord | null;
    ServiceProvider: ServiceProvider | null;
    Traveler: Traveler | null;
    bannedUntil: Date | null;
    subscriptions: Subscription[];
}

export interface Landlord {
    id: number;
    userId: number;
}

export interface ServiceProvider {
    id: number;
    userId: number;
}

export interface Traveler {
    id: number;
    userId: number;
}

export interface Subscription {
    id: number;
    userId: number;
    planId: number;
    status: SubscriptionStatus;
    startDate: Date;
    endDate?: Date | null;
}

export enum SubscriptionStatus {
    ACTIVE="ACTIVE",
    PAST_DUE="PAST_DUE",
    CANCELED="CANCELED",
    UNPAID="UNPAID"
}

export interface ServiceProvider {
    id: number,
    userId: number;
    status: ServiceProviderStatus
    user?: User
}

export enum PropertyStatus {
    PENDING="PENDING",
    APPROVED="APPROVED",
    REJECTED="REJECTED",
}

export enum ServiceProviderStatus {
    PENDING="PENDING",
    ACCEPTED="ACCEPTED",
    REFUSED="REFUSED"
}

export interface Service{
    id: number,
    provider?: ServiceProvider,
    providerId: number,
    name: string,
    description: string,
    basePrice: number
}

export interface Traveler {
    id: number,
    userId: number;
    user?: User
}

export interface PropertyOccupation {
    id: number
    property?: Property
    startDate: Date
    endDate: Date
}

export interface PropertyReservation {
    id: number
    traveler?: Traveler
    occupation?: PropertyOccupation
    status: ReservationStatus
    totalPrice: number
}

export enum ReservationStatus {
    PENDING="PENDING",
    CONFIRMED="CONFIRMED",
    CANCELLED="CANCELLED",
}

export interface ProviderOccupation{
    id: number
    providerId: number
    startDate: Date
    endDate: Date
}

export interface Intervention {
    id: number,
    service?: Service,
    propertyOccupation?: PropertyOccupation
    providerOccupationId?: ProviderOccupation
    additionalPrice: number
    status: InterventionStatus
}

export enum InterventionStatus {
    PLANNED="PLANNED",
    IN_PROGRESS="IN_PROGRESS",
    COMPLETED="COMPLETED",
    CANCELLED="CANCELLED",
}

export interface ApiResponse<T>{
    data: T,
    count?: number
}