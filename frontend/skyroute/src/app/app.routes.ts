import { Routes } from '@angular/router';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { FlightResultsComponent } from './components/flight-results/flight-results.component';
import { BookingComponent } from './components/booking/booking.component';

export const routes: Routes = [
  { path: '', component: SearchFormComponent },
  { path: 'results', component: FlightResultsComponent },
  { path: 'booking', component: BookingComponent },
  { path: '**', redirectTo: '' }
];
