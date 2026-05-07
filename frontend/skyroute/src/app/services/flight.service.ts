import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Airport } from '../models/airport.model';
import { Flight } from '../models/flight.model';

export interface FlightSearchRequest {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
  cabinClass: string;
}

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getAirports(): Observable<Airport[]> {
    return this.http.get<Airport[]>(`${this.apiUrl}/flights/airports`);
  }

  searchFlights(request: FlightSearchRequest): Observable<Flight[]> {
    return this.http.post<Flight[]>(`${this.apiUrl}/flights/search`, request);
  }
}
