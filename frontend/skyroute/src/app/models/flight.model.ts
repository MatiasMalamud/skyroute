export interface Flight {
  id: string;
  provider: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  cabinClass: string;
  pricePerPassenger: number;
  totalPrice: number;
  isInternational: boolean;
}
