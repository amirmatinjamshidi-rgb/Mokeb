using Microsoft.EntityFrameworkCore;
using Mokeb.Application.Contracts;
using Mokeb.Application.Dtos;
using Mokeb.Domain.Model.Entities;
using Mokeb.Infrastructure.Context;

namespace Mokeb.Infrastructure.Repositories
{
    public class OffiacialsRepository : IOfficialsRepository
    {
        private readonly DbSet<Officials> _officials;

        public OffiacialsRepository(MokebDbContext officials)
        {
            _officials = officials.Set<Officials>();
        }

        public void AddOfficials(Officials official)
        {
            _officials.Add(official);
        }

        public async Task<bool> CheckOfficialsExistanceByInformationAsync(string name, string familyName, string phoneNumber, CancellationToken ct)
        {
            return await _officials
                .AnyAsync(x => x.Name.ToLower() == name.ToLower() || x.LastName.ToLower() == familyName.ToLower() || x.PhoneNumber == phoneNumber, ct);
        }

        public async Task<List<OfficialsDto>> GetAllOfficials(CancellationToken ct)
        {
            return await _officials
                .Select(x => new OfficialsDto
                (
                    x.Name,
                    x.LastName,
                    x.PhoneNumber,
                    x.Id
                    ))
                .ToListAsync(ct);
        }

        public async Task<Officials> GetOfficialByIdAsync(Guid officialId, CancellationToken ct)
        {
            return await _officials
                .SingleOrDefaultAsync(x => x.Id == officialId, ct);
        }

        public void RemoveOfficials(Officials official)
        {
            _officials.Remove(official);
        }
    }
}
