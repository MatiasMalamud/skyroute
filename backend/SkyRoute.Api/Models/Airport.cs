namespace SkyRoute.Api.Models;

public class Airport
{
    public string Code { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string DisplayName => $"{City} ({Code})";
}
