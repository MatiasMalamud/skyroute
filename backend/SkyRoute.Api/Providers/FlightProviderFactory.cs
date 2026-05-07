using SkyRoute.Api.Models;

namespace SkyRoute.Api.Providers;

public interface IFlightProviderFactory
{
    IEnumerable<IFlightProvider> GetAllProviders();
}

public class FlightProviderFactory : IFlightProviderFactory
{
    private readonly List<IFlightProvider> _providers;

    public FlightProviderFactory()
    {
        _providers = new List<IFlightProvider>
        {
            new GlobalAirProvider(),
            new BudgetWingsProvider()
        };
    }

    public IEnumerable<IFlightProvider> GetAllProviders()
    {
        return _providers;
    }
}
