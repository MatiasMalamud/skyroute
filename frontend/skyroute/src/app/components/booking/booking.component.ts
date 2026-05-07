import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Flight } from '../../models/flight.model';
import { BookingService } from '../../services/booking.service';
import { Booking, PassengerDetail } from '../../models/booking.model';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  flight: Flight | null = null;
  searchCriteria: any = null;
  bookingForm: FormGroup;
  loading = false;
  bookingComplete = false;
  booking: Booking | null = null;
  error: string | null = null;
  formError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef
  ) {
    this.bookingForm = this.fb.group({
      passengers: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const state = window.history.state as any;

    if (state?.flight) {
      this.flight = state.flight;
      this.searchCriteria = state.search;
      this.buildPassengerForms();
    } else {
      this.router.navigate(['/']);
    }
  }

  get passengersArray(): FormArray {
    return this.bookingForm.get('passengers') as FormArray;
  }

  get documentLabel(): string {
    return this.flight?.isInternational ? 'Passport Number' : 'National ID / DNI';
  }

  private buildPassengerForms(): void {
    const count = this.searchCriteria?.passengers || 1;
    for (let i = 0; i < count; i++) {
      this.passengersArray.push(this.createPassengerGroup());
    }
  }

  private createPassengerGroup(): FormGroup {
    return this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]{3,}$/)]],
      email: ['', [Validators.required, Validators.email]],
      documentNumber: ['', [Validators.required, this.documentValidator.bind(this)]]
    });
  }

  private documentValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    if (this.flight?.isInternational) {
      const valid = /^(?=.*[A-Za-z])[A-Za-z0-9]{6,20}$/.test(value);
      return valid ? null : { invalidPassport: true };
    } else {
      const valid = /^\d{7,8}$/.test(value);
      return valid ? null : { invalidDni: true };
    }
  }

  private checkDuplicates(): void {
    // Clear any existing duplicate errors from all passengers
    this.passengersArray.controls.forEach((group) => {
      const g = group as FormGroup;
      const emailControl = g.get('email');
      const docControl = g.get('documentNumber');

      const emailErrors = { ...emailControl?.errors };
      const docErrors = { ...docControl?.errors };

      delete (emailErrors as any).duplicateEmail;
      delete (docErrors as any).duplicateDocument;

      emailControl?.setErrors(Object.keys(emailErrors).length > 0 ? emailErrors : null);
      docControl?.setErrors(Object.keys(docErrors).length > 0 ? docErrors : null);
    });

    const emails = new Map<string, number[]>();
    const documents = new Map<string, number[]>();

    this.passengersArray.controls.forEach((group, index) => {
      const g = group as FormGroup;
      const email = (g.get('email')?.value || '').trim().toLowerCase();
      const doc = (g.get('documentNumber')?.value || '').trim();

      if (email) {
        if (!emails.has(email)) {
          emails.set(email, []);
        }
        emails.get(email)!.push(index);
      }

      if (doc) {
        if (!documents.has(doc)) {
          documents.set(doc, []);
        }
        documents.get(doc)!.push(index);
      }
    });

    // Mark duplicate emails
    emails.forEach((indices) => {
      if (indices.length > 1) {
        indices.forEach((index) => {
          this.markDuplicateError(index, 'email', 'duplicateEmail');
        });
      }
    });

    // Mark duplicate document numbers
    documents.forEach((indices) => {
      if (indices.length > 1) {
        indices.forEach((index) => {
          this.markDuplicateError(index, 'documentNumber', 'duplicateDocument');
        });
      }
    });
  }

  private markDuplicateError(passengerIndex: number, fieldName: string, errorKey: string): void {
    const group = this.passengersArray.at(passengerIndex) as FormGroup;
    const control = group.get(fieldName);
    const currentErrors = { ...control?.errors };
    control?.setErrors({ ...currentErrors, [errorKey]: true });
  }

  onSubmit(): void {
    this.error = null;
    this.formError = null;

    this.bookingForm.markAllAsTouched();
    this.checkDuplicates();

    if (this.bookingForm.invalid || !this.flight) {
      this.formError = 'Please fill in all required fields correctly before submitting.';
      return;
    }

    this.loading = true;

    const passengerDetails: PassengerDetail[] = this.passengersArray.value.map((p: any) => ({
      fullName: p.fullName,
      email: p.email,
      documentNumber: p.documentNumber,
      documentType: this.flight!.isInternational ? 'Passport' : 'National ID'
    }));

    const request = {
      flightId: this.flight.id,
      passengers: passengerDetails.length,
      passengerDetails
    };

    console.log('[Booking] Submitting request:', request);

    this.bookingService.createBooking(request).subscribe({
      next: (result: Booking) => {
        console.log('[Booking] Success:', result);
        this.booking = result;
        this.bookingComplete = true;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[Booking] HTTP error:', err);
        this.loading = false;

        let msg: string;
        if (err.error && typeof err.error === 'object' && err.error.message) {
          msg = err.error.message;
        } else if (err.error && typeof err.error === 'string') {
          msg = err.error;
        } else if (err.message) {
          msg = err.message;
        } else {
          msg = 'Failed to create booking. Please try again.';
        }

        this.error = msg;
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
