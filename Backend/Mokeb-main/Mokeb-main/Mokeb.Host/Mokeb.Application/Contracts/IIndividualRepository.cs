using Mokeb.Application.Dtos;
using Mokeb.Domain.Model.Entities;

namespace Mokeb.Application.Contracts
{
    public interface IIndividualRepository
    {
        Task<bool> IsIndividualByIdenticalInformationExists(string username, string nationalCode, string passportNumber, CancellationToken ct);
        Task<IndividualPrincipal> GetIndividualByUsernameAsync(string username, string password, CancellationToken ct);
        Task<IndividualPrincipal> GetIndividualByIdAsync(Guid Id, CancellationToken ct);
        Task<List<IndividualPrincipalDto>> GetAllIndividualsWithTheirCompanions(CancellationToken ct);
        void AddIndividualPrincipal(IndividualPrincipal individualPrincipal);
        void RemoveIndividual(IndividualPrincipal individualPrincipal);
        Task<Request> GetRequestByIdAsync(Guid Id, CancellationToken ct);

        Task<List<Request>> GetAcceptedOrOutGoingRequestsByDateAsync(DateOnly date, CancellationToken ct);
        Task<List<Request>> GetAcceptedOrOutGoingCaravansRequestsByDateAsync(DateOnly date, CancellationToken ct);

        Task<GenderStatsDto> GetEntryStatsAsync(DateOnly date, CancellationToken ct);
        Task<GenderStatsDto> GetExitStatsAsync(DateOnly date, CancellationToken ct);
        Task<GenderStatsDto> GetPresentStatsAsync(DateOnly date, CancellationToken ct);
        Task<List<Request>> SearchInEnteredOrDelayInEnterRequestWithNameOrFamilyName(DateOnly date, string input, CancellationToken ct);
        Task<List<Request>> SearchInExitedOrDelayInExitRequestWithNameOrFamilyName(DateOnly date, string input, CancellationToken ct);
        Task<List<IndividualPrincipalDto>> SearchForIndividualsByNameOrFamilyName(string input, CancellationToken ct);
        Task<GenderStatsInAYearDto> GetTravelersOfRequestsStatInAYear(DateOnly date, CancellationToken ct);
        Task<int> GetAllCaravanRequestsAmountInAYear(DateOnly date, CancellationToken ct);
        Task<List<Request>> SearchInRequestAsync(Guid individualId, DateOnly date, CancellationToken ct);







    }
}
