namespace SkyRoute.Api.Models;

public class Flight
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Provider { get; set; } = string.Empty;
    public string FlightNumber { get; set; } = string.Empty;
    public string Origin { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public DateTime DepartureTime { get; set; }
    public DateTime ArrivalTime { get; set; }
    public int DurationMinutes { get; set; }
    public string CabinClass { get; set; } = string.Empty;
    public decimal PricePerPassenger { get; set; }
    public decimal TotalPrice { get; set; }
    public bool IsInternational { get; set; }
}
