using SkyRoute.Api.Models;

namespace SkyRoute.Api.Services;

public interface IBookingService
{
    Booking CreateBooking(BookingRequest request, Flight flight);
}

public class BookingService : IBookingService
{
    private readonly List<Booking> _bookings = new();
    private readonly Random _random = new();

    public Booking CreateBooking(BookingRequest request, Flight flight)
    {
        var booking = new Booking
        {
            BookingReference = GenerateBookingReference(),
            FlightSummary = flight,
            TotalPrice = flight.TotalPrice,
            PassengerDetails = request.PassengerDetails
        };

        _bookings.Add(booking);
        return booking;
    }

    private string GenerateBookingReference()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return new string(Enumerable.Repeat(chars, 6)
            .Select(s => s[_random.Next(s.Length)]).ToArray());
    }
}
