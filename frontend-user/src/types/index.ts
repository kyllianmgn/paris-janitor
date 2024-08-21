

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  Traveler?: Traveler;
  Landlord?: Landlord;
  ServiceProvider?: ServiceProvider;
}

export interface Landlord {
  id: number;
  userId: number;
}

export interface Traveler {
  id: number;
  userId: number;
}

export interface ServiceProvider {
  id: number;
  userId: number;
  status?: ServiceProviderStatus;
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
  createdAt?: Date,
  updatedAt?: Date
}

export type ServiceFormData = Omit<Service, "id" | "providerId" | "provider" | "createdAt" | "updatedAt">

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  role: 'LANDLORD' | 'TRAVELER' | 'SERVICE_PROVIDER' | null;
  idRole: number | null;
}

export interface DecodedToken {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  landlordId?: number;
  travelerId?: number;
  serviceProviderId?: number;
  role:string;
  exp: number;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;

}
export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface RefreshTokenRequest {
  token: string;
}

export interface RevokeRefreshTokenRequest {
  userId: number;
}

export interface ApiResponse<T> {
  data: T
}

export interface DateRange {
  from: Date;
  to: Date;
}


export enum PropertyStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export interface Property {
  id?: number,
  landlordId?: number,
  address: string,
  postalCode: string,
  city: string,
  country: string,
  description: string,
  status?: PropertyStatus,
  createdAt?: Date,
  updatedAt?: Date
}

export type PropertyFormData = Omit<Property, 'id' | 'landlordId' | 'status' | 'createdAt' | 'updatedAt'>;

export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED"
}

export interface PropertyOccupation {
  id: number;
  propertyId: number;
  startDate: string;
  endDate: string;
  reservation?: PropertyReservation;
}

export interface PropertyReservation {
  id: number;
  travelerId: number;
  occupationId: number;
  status: ReservationStatus;
  totalPrice: number;
}

export interface CalendarEvent extends PropertyOccupation {
  title: string;
  resourceId?: number;
  start: Date; // ajouté pour react-big-calendar
  end: Date; // ajouté pour react-big-calendar
}