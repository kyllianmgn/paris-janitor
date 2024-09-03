

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
  user?: User
  status?: LandlordStatus;
}

export enum LandlordStatus {
  PENDING="PENDING",
  ACCEPTED="ACCEPTED",
  REFUSED="REFUSED"
}

export interface Traveler {
  id: number;
  userId: number;
  user?: User
  subscriptionType?: TravelerSubscription;
}

export enum TravelerSubscription {
  FREE="FREE",
  BAG_PACKER="BAG_PACKER",
  EXPLORATOR="EXPLORATOR"
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  userType: UserType;
  features: string[];
}

export enum UserType {
  TRAVELER="TRAVELER",
  LANDLORD="LANDLORD"
}
export interface ServiceProvider {
  id: number;
  userId: number;
  user?: User;
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
  type: ServiceType,
  basePrice: number
  createdAt?: Date,
  updatedAt?: Date
}

export interface Payment {
  id: number;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  propertyReservationId?: number;
  invoiceId?: number;
  services: ServicePayment[];
}

export interface PaymentIntervention {
  id: number;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  date: Date;
  serviceId?: number;
  propertyId?: string;
  invoiceId?: number;
}

export interface ServicePayment {
  serviceId: number;
  amount: number;
  name: string;
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED"
}

export enum InterventionStatus {
  PLANNED="PLANNED",
  IN_PROGRESS="IN_PROGRESS",
  COMPLETED="COMPLETED",
  CANCELLED="CANCELLED",
}

enum ServiceType {
  INTERVENTION="INTERVENTION",
  MISSION="MISSION"
}

export type ServiceFormData = Omit<Service, "id" | "providerId" | "provider" | "createdAt" | "updatedAt">

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  landlordStatus : "PENDING" | "ACTIVE" | "PAST_DUE" | "CANCELED" | null;
  travelerPlan: 'FREE' | 'BAG_PACKER' | 'EXPLORATOR' | null ;
  role: 'LANDLORD' | 'TRAVELER' | 'SERVICE_PROVIDER' | null;
  serviceProviderStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | null
  idRole: number | null;
}

export interface DecodedToken {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  landlordId?: number;
  landlordStatus?: "PENDING" | "ACTIVE" | "PAST_DUE" | "CANCELED" ;
  travelerId?: number;
  travelerPlan?: 'FREE' | 'BAG_PACKER' | 'EXPLORATOR' ;
  serviceProviderId?: number;
  serviceProviderStatus?: 'PENDING' | 'ACCEPTED' | 'REJECTED' ;
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
  sessionUrl?: string;
  data: T,
  count: number
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
  landlord?: Landlord
  address: string,
  postalCode: string,
  city: string,
  country: string,
  description: string,
  pricePerNight: number,
  roomCount: number,
  instruction: string,
  propertyType: PropertyType,
  status?: PropertyStatus,
  createdAt?: Date,
  updatedAt?: Date
}

export enum PropertyType{
  HOUSE="HOUSE",
  APPARTEMENT="APPARTEMENT"
}

export interface PropertyReview {
  id: number
  travelerId: number
  traveler?: Traveler
  propertyId: number
  property?: Property
  note: number
  comment: string
}

export interface ServiceReview {
  id: number
  travelerId: number
  traveler?: Traveler
  landlordId: number
  landlord?: Landlord
  serviceId: number
  service?: Service
  note: number
  comment: string
}

export interface PropertyFormData extends Omit<Property, 'id' | 'landlordId' | 'status' | 'createdAt' | 'updatedAt'>{
  files: any[]
};

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
  property?: Property
  intervention?: Intervention
}

export interface ProviderOccupation{
  id: number
  providerId: number
  provider: ServiceProvider;
  intervention?: Intervention;
  startDate: Date
  endDate: Date
}

export interface Intervention {
  id: number,
  serviceId: number,
  service?: Service,
  propertyOccupationId?: number
  propertyOccupation?: PropertyOccupation
  propertyId?: number
  property?: Property
  providerOccupationId: number
  providerOccupation: ProviderOccupation
  additionalPrice: number
  status: InterventionStatus
}

export interface ProviderCalendarEvent extends ProviderOccupation {
  title: string;
  resourceId?: number;
  start: Date;
  end: Date;
}

export interface PropertyReservation {
  id: number;
  travelerId: number;
  traveler: Traveler;
  occupationId: number;
  status: ReservationStatus;
  totalPrice: number;
  occupation?: PropertyOccupation
}

export interface CalendarEvent extends PropertyOccupation {
  title: string;
  resourceId?: number;
  start: Date; // ajouté pour react-big-calendar
  end: Date; // ajouté pour react-big-calendar
}

export interface Filter {
  page?: number;
  pageSize?: number;
  query?: string;
}