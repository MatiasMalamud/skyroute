using Microsoft.AspNetCore.Mvc;
using SkyRoute.Api.Models;
using SkyRoute.Api.Providers;
using SkyRoute.Api.Services;

namespace SkyRoute.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FlightsController : ControllerBase
{
    private readonly IFlightService _flightService;

    public FlightsController(IFlightService flightService)
    {
        _flightService = flightService;
    }

    [HttpPost("search")]
    public ActionResult<List<Flight>> Search([FromBody] FlightSearchRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Origin) || string.IsNullOrWhiteSpace(request.Destination))
        {
            return BadRequest("Origin and destination are required.");
        }

        if (request.Origin.Equals(request.Destination, StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest("Origin and destination cannot be the same.");
        }

        if (request.Date.Date < DateTime.UtcNow.Date)
        {
            return BadRequest("Date must be today or in the future.");
        }

        if (request.Passengers < 1 || request.Passengers > 9)
        {
            return BadRequest("Passengers must be between 1 and 9.");
        }

        var flights = _flightService.SearchFlights(request);
        return Ok(flights);
    }

    [HttpGet("airports")]
    public ActionResult<List<Airport>> GetAirports()
    {
        return Ok(AirportsData.Airports);
    }
}
