using SkyRoute.Api.Models;

namespace SkyRoute.Api.Providers;

public class BudgetWingsProvider : IFlightProvider
{
    public string ProviderName => "BudgetWings";

    public List<Flight> SearchFlights(FlightSearchRequest request)
    {
        var flights = new List<Flight>();
        var count = Random.Shared.Next(3, 6);
        var isInternational = AirportsData.IsInternational(request.Origin, request.Destination);

        for (int i = 0; i < count; i++)
        {
            var baseFare = GenerateBaseFare(request.CabinClass, isInternational);
            var discounted = baseFare * 0.90m;
            var pricePerPassenger = Math.Max(Math.Round(discounted, 2), 29.99m);

            var departureTime = GenerateDepartureTime(request.Date);
            var duration = GenerateDuration(isInternational);
            var arrivalTime = departureTime.AddMinutes(duration);

            flights.Add(new Flight
            {
                Id = Guid.NewGuid().ToString(),
                Provider = ProviderName,
                FlightNumber = $"BW{Random.Shared.Next(100, 999)}",
                Origin = request.Origin,
                Destination = request.Destination,
                DepartureTime = departureTime,
                ArrivalTime = arrivalTime,
                DurationMinutes = duration,
                CabinClass = request.CabinClass,
                PricePerPassenger = pricePerPassenger,
                TotalPrice = Math.Round(pricePerPassenger * request.Passengers, 2),
                IsInternational = isInternational
            });
        }

        return flights;
    }

    private decimal GenerateBaseFare(string cabinClass, bool isInternational)
    {
        var basePrice = isInternational ? Random.Shared.Next(150, 700) : Random.Shared.Next(50, 250);
        var multiplier = cabinClass switch
        {
            "Business" => 2.0m,
            "First" => 3.5m,
            _ => 1.0m
        };
        return Math.Round(basePrice * multiplier, 2);
    }

    private DateTime GenerateDepartureTime(DateTime date)
    {
        var hour = Random.Shared.Next(5, 23);
        var minute = Random.Shared.Next(0, 60);
        return new DateTime(date.Year, date.Month, date.Day, hour, minute, 0);
    }

    private int GenerateDuration(bool isInternational)
    {
        return isInternational ? Random.Shared.Next(480, 900) : Random.Shared.Next(60, 240);
    }
}
