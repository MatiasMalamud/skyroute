using SkyRoute.Api.Models;

namespace SkyRoute.Api.Providers;

public static class AirportsData
{
    public static readonly List<Airport> Airports = new()
    {
        new Airport { Code = "EZE", City = "Buenos Aires", Country = "Argentina" },
        new Airport { Code = "ROS", City = "Rosario", Country = "Argentina" },
        new Airport { Code = "COR", City = "Córdoba", Country = "Argentina" },
        new Airport { Code = "JFK", City = "New York", Country = "USA" },
        new Airport { Code = "MIA", City = "Miami", Country = "USA" },
        new Airport { Code = "LAX", City = "Los Angeles", Country = "USA" }
    };

    public static Airport? GetByCode(string code)
    {
        return Airports.FirstOrDefault(a => a.Code.Equals(code, StringComparison.OrdinalIgnoreCase));
    }

    public static bool IsInternational(string originCode, string destinationCode)
    {
        var origin = GetByCode(originCode);
        var destination = GetByCode(destinationCode);
        if (origin == null || destination == null) return false;
        return origin.Country != destination.Country;
    }
}
