using Microsoft.AspNetCore.Mvc;
using SkyRoute.Api.Models;
using SkyRoute.Api.Services;
using System.Text.Json;

namespace SkyRoute.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly IFlightService _flightService;
    private readonly IBookingService _bookingService;
    private readonly ILogger<BookingsController> _logger;

    public BookingsController(
        IFlightService flightService,
        IBookingService bookingService,
        ILogger<BookingsController> logger)
    {
        _flightService = flightService;
        _bookingService = bookingService;
        _logger = logger;
    }

    [HttpPost]
    public ActionResult<Booking> CreateBooking([FromBody] BookingRequest request)
    {
        _logger.LogInformation("=== BOOKING REQUEST RECEIVED ===");
        _logger.LogInformation("Raw deserialized request: {@Request}", request);
        _logger.LogInformation("FlightId value: '{FlightId}'", request.FlightId);
        _logger.LogInformation("Passengers value: {Passengers}", request.Passengers);
        _logger.LogInformation("PassengerDetails count: {Count}", request.PassengerDetails?.Count ?? 0);

        if (!ModelState.IsValid)
        {
            var errors = ModelState
                .Where(x => x.Value?.Errors.Count > 0)
                .SelectMany(x => x.Value!.Errors.Select(e => $"{x.Key}: {e.ErrorMessage}"))
                .ToList();

            _logger.LogWarning("ModelState validation errors: {Errors}", string.Join("; ", errors));
            return BadRequest(new { message = "Validation failed", errors });
        }

        if (string.IsNullOrWhiteSpace(request.FlightId))
        {
            _logger.LogWarning("Validation failed: FlightId is missing or empty");
            return BadRequest(new { message = "FlightId is required." });
        }

        if (request.Passengers < 1 || request.Passengers > 9)
        {
            _logger.LogWarning("Validation failed: Passengers={Passengers} is out of range", request.Passengers);
            return BadRequest(new { message = "Passengers must be between 1 and 9." });
        }

        if (request.PassengerDetails == null || request.PassengerDetails.Count != request.Passengers)
        {
            _logger.LogWarning(
                "Validation failed: PassengerDetails count={DetailCount} does not match Passengers={Passengers}",
                request.PassengerDetails?.Count ?? 0,
                request.Passengers);
            return BadRequest(new { message = $"Exactly {request.Passengers} passenger details are required." });
        }

        foreach (var passenger in request.PassengerDetails)
        {
            _logger.LogInformation(
                "Passenger detail: FullName='{FullName}', Email='{Email}', DocumentNumber='{DocumentNumber}', DocumentType='{DocumentType}'",
                passenger.FullName,
                passenger.Email,
                passenger.DocumentNumber,
                passenger.DocumentType);

            if (string.IsNullOrWhiteSpace(passenger.FullName))
            {
                return BadRequest(new { message = "Full name is required for all passengers." });
            }

            if (string.IsNullOrWhiteSpace(passenger.Email) || !passenger.Email.Contains("@"))
            {
                return BadRequest(new { message = "A valid email is required for all passengers." });
            }

            if (string.IsNullOrWhiteSpace(passenger.DocumentNumber))
            {
                return BadRequest(new { message = "Document number is required for all passengers." });
            }
        }

        var flight = _flightService.GetFlightById(request.FlightId);
        if (flight == null)
        {
            _logger.LogWarning("Flight not found for FlightId='{FlightId}'", request.FlightId);
            return BadRequest(new { message = "Flight not found. Please search again." });
        }

        var booking = _bookingService.CreateBooking(request, flight);
        _logger.LogInformation("Booking created successfully: Reference={Reference}", booking.BookingReference);
        return Ok(booking);
    }
}
