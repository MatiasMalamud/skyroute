namespace SkyRoute.Api.Models;

public class BookingRequest
{
    public string FlightId { get; set; } = string.Empty;
    public int Passengers { get; set; }
    public List<PassengerDetail> PassengerDetails { get; set; } = new();
}
