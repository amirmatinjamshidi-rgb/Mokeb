using Mokeb.Application.Dtos;
using Mokeb.Domain.Model.Entities;

namespace Mokeb.Application.Contracts
{
    public interface ICaravanPrincipalRepository
    {
        void AddCaravan(CaravanPrincipal caravanPrincipal);
        void RemoveCaravan(CaravanPrincipal caravanPrincipal);
        Task<bool> IsCaravanByIdenticalInformationExistsAsync(string username, string nationalCode, string passportNumber, CancellationToken ct);
        Task<CaravanPrincipal> GetCaravanByUsernameAsync(string username, string password, CancellationToken ct);
        Task<CaravanPrincipal> GetCaravanByIdAsync(Guid Id, CancellationToken ct);
        Task<List<Request>> GetAcceptedOrOnTheWayCaravansRequestsByDateAsync(DateOnly date, CancellationToken ct);
        Task<List<Request>> GetAcceptedOrOutGoingCaravansRequestsByDateAsync(DateOnly date, CancellationToken ct);
        Task<Request> GetRequestByIdAsync(Guid Id, CancellationToken ct);

        Task<GenderStatsDto> GetEntryStatsAsync(DateOnly date, CancellationToken ct);
        Task<GenderStatsDto> GetExitStatsAsync(DateOnly date, CancellationToken ct);
        Task<GenderStatsDto> GetPresentStatsAsync(DateOnly date, CancellationToken ct);
        Task<List<Request>> SearchInEnteredOrDelayInEnterRequestWithNameOrFamilyName(DateOnly date, string input, CancellationToken ct);
        Task<List<Request>> SearchInExitedOrDelayInExitRequestWithNameOrFamilyName(DateOnly date, string input, CancellationToken ct);
        Task<List<CaravanPrincipalDto>> SearchForCaravansByNameOrFamilyName(string input, CancellationToken ct);

        Task<List<Request>> GetRequestedRequestsByDateAsync(DateOnly date, CancellationToken ct);
        Task<List<CaravanPrincipalDto>> GetAllCaravansWithTheirTravelers(CancellationToken ct);
        Task<GenderStatsInAYearDto> GetTravelersOfRequestsStatInAYear(DateOnly date, CancellationToken ct);
        Task<int> GetAllCaravanRequestsAmountInAYear(DateOnly date, CancellationToken ct);
        Task<int> GetAllCaravanRequestedRequestsAmountInADay(DateOnly date, CancellationToken ct);

    }
}
