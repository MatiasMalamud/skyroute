using System.Collections.Concurrent;
using SkyRoute.Api.Models;

namespace SkyRoute.Api.Services;

public interface IFlightCache
{
    void AddOrUpdateFlight(Flight flight);
    Flight? GetFlight(string id);
}

public class FlightCache : IFlightCache
{
    private readonly ConcurrentDictionary<string, Flight> _flights = new();

    public void AddOrUpdateFlight(Flight flight)
    {
        _flights[flight.Id] = flight;
    }

    public Flight? GetFlight(string id)
    {
        return _flights.TryGetValue(id, out var flight) ? flight : null;
    }
}
