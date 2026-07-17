using Microsoft.EntityFrameworkCore;
using Mokeb.Application.Contracts;
using Mokeb.Application.Dtos;
using Mokeb.Domain.Model.Entities;
using Mokeb.Domain.Model.Enums;
using Mokeb.Infrastructure.Context;

namespace Mokeb.Infrastructure.Repositories
{
    public class IndividualRepository : IIndividualRepository
    {
        private readonly DbSet<IndividualPrincipal> _individual;

        public IndividualRepository(MokebDbContext context)
        {
            _individual = context.Set<IndividualPrincipal>();
        }

        public void AddIndividualPrincipal(IndividualPrincipal individualPrincipal)
        {
            _individual.Add(individualPrincipal);
        }

        public async Task<IndividualPrincipal> GetIndividualByUsernameAsync(string username, string password, CancellationToken ct)
        {
            return await _individual.SingleOrDefaultAsync(x => x.IdentityInformation.Username == username && x.IdentityInformation.Password == password, ct);
        }

        public async Task<bool> IsIndividualByIdenticalInformationExists(string username, string nationalCode, string passportNumber, CancellationToken ct)
        {
            return await _individual.AnyAsync(x => x.IdentityInformation.Username == username || x.NationalCode == nationalCode || x.PassportNumber == passportNumber, ct);
        }
        public async Task<List<Request>> GetAcceptedOrOutGoingRequestsByDateAsync(DateOnly date, CancellationToken ct)
        {
            return await _individual
                .Include(x => x.IdentityInformation)
                .Include(x => x.Requests)
                .ThenInclude(x => x.Travelers)
                .SelectMany(x => x.Requests)
                .Where(x => DateOnly.FromDateTime(x.EnterTime) == date && (x.State == State.Accepted || x.State == State.DelayInEntrance || x.State == State.Entered))
                .ToListAsync(ct);
        }

        public async Task<IndividualPrincipal> GetIndividualByIdAsync(Guid Id, CancellationToken ct)
        {
            return await _individual
                .Include(x => x.Companion)
                .Include(x => x.Requests)
                .ThenInclude(x => x.Travelers)
                .SingleOrDefaultAsync(x => x.Id == Id, ct);
        }

        public async Task<List<Request>> GetAcceptedOrOutGoingCaravansRequestsByDateAsync(DateOnly date, CancellationToken ct)
        {
            return await _individual
                .Include(x => x.IdentityInformation)
                .Include(x => x.Requests)
                .ThenInclude(x => x.Travelers)
                .SelectMany(x => x.Requests)
                .Where(x => DateOnly.FromDateTime(x.ExitTime) == date && (x.State == State.Accepted || x.State == State.DelayInExit || x.State == State.Exited))
                .ToListAsync(ct);
        }
        public async Task<GenderStatsDto> GetEntryStatsAsync(DateOnly date, CancellationToken ct)
        {
            var query = _individual
                .Include(x => x.Requests)
                .SelectMany(x => x.Requests)
                .Where(x => DateOnly.FromDateTime(x.EnterTime) == date);

            var result = await query
                .GroupBy(x => 1)
                .Select(g => new GenderStatsDto
                {
                    MaleCount = g.Sum(x => (x.State == State.Entered || x.State == State.DelayInEntrance) ? (int)x.MaleCount : 0),
                    FemaleCount = g.Sum(x => (x.State == State.Entered || x.State == State.DelayInEntrance) ? (int)x.FemaleCount : 0),

                    MaleExpected = g.Sum(x => (x.State == State.Entered || x.State == State.DelayInEntrance || x.State == State.Accepted) ? (int)x.MaleCount : 0),
                    FemaleExpected = g.Sum(x => (x.State == State.Entered || x.State == State.DelayInEntrance || x.State == State.Accepted) ? (int)x.FemaleCount : 0)
                })
                .FirstOrDefaultAsync(ct);

            return result ?? new GenderStatsDto();
        }

        public async Task<GenderStatsDto> GetExitStatsAsync(DateOnly date, CancellationToken ct)
        {
            var query = _individual
                .Include(x => x.Requests)
                .SelectMany(x => x.Requests)
                .Where(x => DateOnly.FromDateTime(x.ExitTime) == date);

            var result = await query
                .GroupBy(x => 1)
                .Select(g => new GenderStatsDto
                {
                    MaleCount = g.Sum(x => (x.State == State.Exited || x.State == State.DelayInExit) ? (int)x.MaleCount : 0),
                    FemaleCount = g.Sum(x => (x.State == State.Exited || x.State == State.DelayInExit) ? (int)x.FemaleCount : 0),

                    MaleExpected = g.Sum(x => (x.State == State.Entered || x.State == State.DelayInEntrance || x.State == State.Exited || x.State == State.DelayInExit) ? (int)x.MaleCount : 0),
                    FemaleExpected = g.Sum(x => (x.State == State.Entered || x.State == State.DelayInEntrance || x.State == State.Exited || x.State == State.DelayInExit) ? (int)x.FemaleCount : 0)
                })
                .FirstOrDefaultAsync(ct);

            return result ?? new GenderStatsDto();
        }

        public async Task<GenderStatsDto> GetPresentStatsAsync(DateOnly date, CancellationToken ct)
        {
            var query = _individual
                .Include(x => x.Requests)
                .SelectMany(x => x.Requests)
                .Where(x => DateOnly.FromDateTime(x.EnterTime) <= date && DateOnly.FromDateTime(x.ExitTime) > date);

            var result = await query
                .GroupBy(x => 1)
                .Select(g => new GenderStatsDto
                {
                    MaleCount = g.Sum(x => (x.State == State.Entered || x.State == State.DelayInEntrance) ? (int)x.MaleCount : 0),
                    FemaleCount = g.Sum(x => (x.State == State.Entered || x.State == State.DelayInEntrance) ? (int)x.FemaleCount : 0),

                    MaleExpected = g.Sum(x => (x.State == State.Entered || x.State == State.Accepted || x.State == State.DelayInEntrance) ? (int)x.MaleCount : 0),
                    FemaleExpected = g.Sum(x => (x.State == State.Entered || x.State == State.Accepted || x.State == State.DelayInEntrance) ? (int)x.FemaleCount : 0)
                })
                .FirstOrDefaultAsync(ct);

            return result ?? new GenderStatsDto();
        }
        public async Task<Request> GetRequestByIdAsync(Guid Id, CancellationToken ct)
        {
            return await _individual
                .Include(x => x.Requests)
                .SelectMany(x => x.Requests)
                .Include(x => x.Travelers)
                .Include(x => x.Rooms)
                .SingleOrDefaultAsync(x => x.Id == Id, ct);
        }
        public async Task<List<Request>> SearchInEnteredOrDelayInEnterRequestWithNameOrFamilyName(DateOnly date, string input, CancellationToken ct)
        {
            return await _individual
                .Where(x => x.Name.ToLower().Contains(input.ToLower()) || x.FamilyName.ToLower().Contains(input.ToLower()))
                .SelectMany(x => x.Requests)
                .Include(x => x.Travelers)
                .Where(x => DateOnly.FromDateTime(x.EnterTime) == date &&
                (x.State == State.Accepted || x.State == State.DelayInEntrance || x.State == State.Entered))
                .ToListAsync(ct);
        }
        public async Task<List<Request>> SearchInExitedOrDelayInExitRequestWithNameOrFamilyName(DateOnly date, string input, CancellationToken ct)
        {
            return await _individual
                .Where(x => x.Name.ToLower().Contains(input.ToLower()) || x.FamilyName.ToLower().Contains(input.ToLower()))
                .SelectMany(x => x.Requests)
                .Include(x => x.Travelers)
                .Where(x => DateOnly.FromDateTime(x.EnterTime) == date &&
                (x.State == State.Exited || x.State == State.DelayInExit || x.State == State.Accepted))
                .ToListAsync(ct);
        }

        public async Task<List<IndividualPrincipalDto>> GetAllIndividualsWithTheirCompanions(CancellationToken ct)
        {
            return await _individual
                .Select(x => new IndividualPrincipalDto(
                    x.Id,
                    x.Name,
                    x.FamilyName,
                    x.ContactInformation.PhoneNumber,
                    x.Companion.Select(x => new CompanionDto(
                        x.Name,
                        x.FamilyName,
                        x.PhoneNumber,
                        x.NationalCode)).ToList(),
                        x.IsActive))
                .ToListAsync(ct);
        }

        public void RemoveIndividual(IndividualPrincipal individualPrincipal)
        {
            _individual.Remove(individualPrincipal);
        }

        public async Task<List<IndividualPrincipalDto>> SearchForIndividualsByNameOrFamilyName(string input, CancellationToken ct)
        {
            return await _individual
                .Include(x => x.ContactInformation)
                .Include(x => x.IdentityInformation)
                .Include(x => x.Companion)
                .Where(x => x.Name.ToLower().Contains(input.ToLower()) || x.FamilyName.ToLower().Contains(input.ToLower()))
                .Select(x => new IndividualPrincipalDto(
                    x.Id,
                    x.Name,
                    x.FamilyName,
                    x.ContactInformation.PhoneNumber,
                    x.Companion.Select(x => new CompanionDto(
                        x.Name,
                        x.FamilyName,
                        x.PhoneNumber,
                        x.NationalCode)).ToList(),
                        x.IsActive))
                .ToListAsync(ct);
        }
        public async Task<GenderStatsInAYearDto> GetTravelersOfRequestsStatInAYear(DateOnly date, CancellationToken ct)
        {
            var startDateTime = date.ToDateTime(TimeOnly.MinValue);
            var endDateTime = date.AddYears(1).ToDateTime(TimeOnly.MaxValue);

            return await _individual
                .SelectMany(x => x.Requests)
                .Where(x => x.EnterTime >= startDateTime && x.ExitTime <= endDateTime
                && (x.State == State.Entered || x.State == State.DelayInEntrance || x.State == State.DelayInExit || x.State == State.Exited))
                .GroupBy(x => 1)
                .Select(x => new GenderStatsInAYearDto
                (
                    (uint)x.Sum(x => x.MaleCount),
                    (uint)x.Sum(x => x.FemaleCount)
                ))
                .FirstOrDefaultAsync(ct) ?? new GenderStatsInAYearDto();
        }
        public async Task<int> GetAllCaravanRequestsAmountInAYear(DateOnly date, CancellationToken ct)
        {
            var startDateTime = date.ToDateTime(TimeOnly.MinValue);
            var endDateTime = date.AddYears(1).ToDateTime(TimeOnly.MaxValue);
            return await _individual
                .SelectMany(x => x.Requests)
                .Where(x =>
                    x.EnterTime >= startDateTime &&
                    x.ExitTime < endDateTime &&
                    (x.State == State.Entered || x.State == State.DelayInEntrance ||
                     x.State == State.DelayInExit || x.State == State.Exited))
                .CountAsync(ct);
        }

        public async Task<List<Request>> SearchInRequestAsync(Guid individualId, DateOnly date, CancellationToken ct)
        {
            return await _individual
                .Where(x => x.Id == individualId)
                .SelectMany(x => x.Requests)
                .Include(x => x.Travelers)
                .Where(x => DateOnly.FromDateTime(x.EnterTime) == date || DateOnly.FromDateTime(x.ExitTime) == date)
                .ToListAsync(ct);
        }
    }
}
