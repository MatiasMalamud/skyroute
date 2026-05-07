# SkyRoute

A complete Flight Search & Booking application built with Angular 18 (standalone components) and .NET 10 Web API.

## Architecture Overview

- **Backend**: Clean Architecture with Controllers → Services → Providers
- **Frontend**: Angular 18 standalone components with Angular Material
- **Communication**: REST API with CORS enabled

> [!NOTE]
> AI coding tools were used during development, as permitted by the challenge guidelines.

## How to Run

### Prerequisites

- .NET 10 SDK
- Node.js 18+ and npm
- Angular CLI (`npm install -g @angular/cli`)

### Backend (.NET 10)

```bash
cd backend/SkyRoute.Api
dotnet run
```

The API will be available at `http://localhost:5000`.

### Frontend (Angular 18)

```bash
cd frontend/skyroute
npm install
ng serve
```

The application will be available at `http://localhost:4200`.

## Architecture Decisions

### Factory Pattern for Flight Providers

The backend uses the **Factory Pattern** to create flight provider instances. This adheres to the **SOLID Open/Closed Principle**: new providers can be added without modifying existing code. The `FlightProviderFactory` returns all registered providers, and the `FlightService` aggregates results from each.

### Thread-Safe Flight Cache
Flights are stored using `ConcurrentDictionary` to handle 
concurrent requests safely without manual locks.

### No Database

All data is mocked in memory to keep the project lightweight and focused on architecture and UI patterns. In a production scenario, Entity Framework Core with SQL Server or PostgreSQL would be added, along with persistent booking storage.

### Clean Architecture

The backend is organized into clear layers:
- **Controllers**: Handle HTTP requests/responses and validation
- **Services**: Contain business logic (pricing calculations, booking creation)
- **Providers**: Encapsulate third-party integration logic (mocked here)

## Features

- Search flights between 6 airports (Argentina & USA)
- Two mock providers with different pricing rules:
  - **GlobalAir**: Base fare + 15% fuel surcharge
  - **BudgetWings**: Base fare - 10% discount (minimum USD 29.99)
- Automatic domestic/international flight detection
- Sortable results by price, duration, and departure time
- Booking flow with passenger details and conditional document fields
- Booking reference generation

## Known Limitations & Future Improvements

- **No persistence**: Bookings and flights are stored in memory and lost on restart. A database should be added.
- **No authentication**: Users cannot manage their bookings. JWT or OAuth2 could be added.
- **No payment integration**: A real system would integrate with Stripe, PayPal, etc.
- **No caching**: Flight search results could be cached with Redis to improve performance.
- **No real-time updates**: SignalR or WebSockets could notify users of price changes.
- **No pagination**: Results are returned in full; pagination should be added for scalability.
- **No email service**: Booking confirmations are mocked; SendGrid or AWS SES could be integrated.
