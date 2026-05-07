import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlightService } from '../../services/flight.service';
import { Airport } from '../../models/airport.model';
import { Flight } from '../../models/flight.model';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {
  searchForm: FormGroup;
  airports: Airport[] = [];
  loading = false;
  loadingAirports = false;
  error: string | null = null;

  cabinClasses = ['Economy', 'Business', 'First'];
  passengerOptions = Array.from({ length: 9 }, (_, i) => i + 1);

  constructor(
    private fb: FormBuilder,
    private flightService: FlightService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.searchForm = this.fb.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      date: [new Date(), [Validators.required, this.futureDateValidator]],
      passengers: [1, [Validators.required, Validators.min(1), Validators.max(9)]],
      cabinClass: ['Economy', Validators.required]
    }, { validators: this.differentAirportsValidator });
  }

  ngOnInit(): void {
    this.loadAirports();
  }

  loadAirports(): void {
    this.loadingAirports = true;
    this.error = null;

    this.flightService.getAirports().subscribe({
      next: (data) => {
        console.log('[SearchForm] Airports loaded:', data);
        this.airports = data;
        this.loadingAirports = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[SearchForm] Failed to load airports:', err);
        this.loadingAirports = false;

        let msg = 'Failed to load airports.';
        if (err.status === 0) {
          msg = 'Cannot connect to the server. Make sure the backend is running at http://localhost:5000 and CORS is enabled.';
        } else if (err.error && typeof err.error === 'object' && err.error.message) {
          msg = err.error.message;
        } else if (err.error && typeof err.error === 'string') {
          msg = err.error;
        } else if (err.message) {
          msg = err.message;
        }

        this.error = msg;
        this.cdr.detectChanges();
      }
    });
  }

  private futureDateValidator(control: AbstractControl): ValidationErrors | null {
    const selected = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);
    if (selected < today) {
      return { pastDate: true };
    }
    return null;
  }

  private differentAirportsValidator(group: AbstractControl): ValidationErrors | null {
    const origin = group.get('origin')?.value;
    const destination = group.get('destination')?.value;
    if (origin && destination && origin === destination) {
      return { sameAirport: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const formValue = this.searchForm.value;
    const request = {
      origin: formValue.origin,
      destination: formValue.destination,
      date: formValue.date.toISOString(),
      passengers: formValue.passengers,
      cabinClass: formValue.cabinClass
    };

    console.log('[SearchForm] Searching flights:', request);

    this.flightService.searchFlights(request).subscribe({
      next: (flights: Flight[]) => {
        console.log('[SearchForm] Flights found:', flights.length);
        this.loading = false;
        this.router.navigate(['/results'], { state: { flights, search: formValue } });
      },
      error: (err) => {
        console.error('[SearchForm] Search failed:', err);
        this.loading = false;

        let msg: string;
        if (err.status === 0) {
          msg = 'Cannot connect to the server. Make sure the backend is running.';
        } else if (err.error && typeof err.error === 'object' && err.error.message) {
          msg = err.error.message;
        } else if (err.error && typeof err.error === 'string') {
          msg = err.error;
        } else if (err.message) {
          msg = err.message;
        } else {
          msg = 'Failed to search flights. Please try again.';
        }

        this.error = msg;
      }
    });
  }
}
