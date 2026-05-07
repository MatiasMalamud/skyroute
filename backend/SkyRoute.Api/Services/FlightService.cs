using SkyRoute.Api.Models;
using SkyRoute.Api.Providers;

namespace SkyRoute.Api.Services;

public interface IFlightService
{
    List<Flight> SearchFlights(FlightSearchRequest request);
    Flight? GetFlightById(string id);
}

public class FlightService : IFlightService
{
    private readonly IFlightProviderFactory _providerFactory;
    private readonly IFlightCache _flightCache;

    public FlightService(IFlightProviderFactory providerFactory, IFlightCache flightCache)
    {
        _providerFactory = providerFactory;
        _flightCache = flightCache;
    }

    public List<Flight> SearchFlights(FlightSearchRequest request)
    {
        var flights = new List<Flight>();
        foreach (var provider in _providerFactory.GetAllProviders())
        {
            flights.AddRange(provider.SearchFlights(request));
        }

        foreach (var flight in flights)
        {
            _flightCache.AddOrUpdateFlight(flight);
        }

        return flights;
    }

    public Flight? GetFlightById(string id)
    {
        return _flightCache.GetFlight(id);
    }
}
