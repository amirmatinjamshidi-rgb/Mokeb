using Mokeb.Application.Dtos;
using Mokeb.Domain.Model.Entities;

namespace Mokeb.Application.Contracts
{
    public interface IOfficialsRepository
    {
        void AddOfficials(Officials official);
        void RemoveOfficials(Officials official);
        Task<Officials> GetOfficialByIdAsync(Guid officialId, CancellationToken ct);
        Task<bool> CheckOfficialsExistanceByInformationAsync(string name, string familyName, string phoneNumber, CancellationToken ct);
        Task<List<OfficialsDto>> GetAllOfficials(CancellationToken ct);
    }
}
