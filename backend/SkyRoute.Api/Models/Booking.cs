namespace SkyRoute.Api.Models;

public class Booking
{
    public string BookingReference { get; set; } = string.Empty;
    public Flight FlightSummary { get; set; } = new();
    public decimal TotalPrice { get; set; }
    public List<PassengerDetail> PassengerDetails { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
