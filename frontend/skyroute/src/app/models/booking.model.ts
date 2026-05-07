import { Flight } from './flight.model';

export interface PassengerDetail {
  fullName: string;
  email: string;
  documentNumber: string;
  documentType: string;
}

export interface BookingRequest {
  flightId: string;
  passengers: number;
  passengerDetails: PassengerDetail[];
}

export interface Booking {
  bookingReference: string;
  flightSummary: Flight;
  totalPrice: number;
  passengerDetails: PassengerDetail[];
  createdAt: string;
}
