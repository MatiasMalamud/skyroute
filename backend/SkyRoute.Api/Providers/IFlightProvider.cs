using SkyRoute.Api.Models;

namespace SkyRoute.Api.Providers;

public interface IFlightProvider
{
    string ProviderName { get; }
    List<Flight> SearchFlights(FlightSearchRequest request);
}
