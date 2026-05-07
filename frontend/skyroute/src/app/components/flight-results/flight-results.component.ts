import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Flight } from '../../models/flight.model';

type SortOption = 'priceAsc' | 'priceDesc' | 'duration' | 'departure';

@Component({
  selector: 'app-flight-results',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './flight-results.component.html',
  styleUrls: ['./flight-results.component.scss']
})
export class FlightResultsComponent implements OnInit {
  flights: Flight[] = [];
  sortedFlights: Flight[] = [];
  searchCriteria: any = null;
  loading = false;
  sortBy: SortOption = 'priceAsc';

  sortOptions: { value: SortOption; label: string }[] = [
    { value: 'priceAsc', label: 'Price: Low to High' },
    { value: 'priceDesc', label: 'Price: High to Low' },
    { value: 'duration', label: 'Duration' },
    { value: 'departure', label: 'Departure Time' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || (window.history.state as any);

    if (state?.flights) {
      this.flights = state.flights;
      this.searchCriteria = state.search;
      this.applySort();
    } else {
      this.router.navigate(['/']);
    }
  }

  onSortChange(): void {
    this.applySort();
  }

  private applySort(): void {
    const sorted = [...this.flights];
    switch (this.sortBy) {
      case 'priceAsc':
        sorted.sort((a, b) => a.totalPrice - b.totalPrice);
        break;
      case 'priceDesc':
        sorted.sort((a, b) => b.totalPrice - a.totalPrice);
        break;
      case 'duration':
        sorted.sort((a, b) => a.durationMinutes - b.durationMinutes);
        break;
      case 'departure':
        sorted.sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime());
        break;
    }
    this.sortedFlights = sorted;
  }

  formatDuration(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }

  formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString();
  }

  selectFlight(flight: Flight): void {
    this.router.navigate(['/booking'], { state: { flight, search: this.searchCriteria } });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
