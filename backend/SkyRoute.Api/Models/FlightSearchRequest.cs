namespace SkyRoute.Api.Models;

public class FlightSearchRequest
{
    public string Origin { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public int Passengers { get; set; }
    public string CabinClass { get; set; } = "Economy";
}
