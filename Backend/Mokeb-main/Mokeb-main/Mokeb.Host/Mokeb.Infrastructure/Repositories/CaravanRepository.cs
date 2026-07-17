using Microsoft.EntityFrameworkCore;
using Mokeb.Application.Contracts;
using Mokeb.Application.Dtos;
using Mokeb.Domain.Model.Entities;
using Mokeb.Domain.Model.Enums;
using Mokeb.Infrastructure.Context;

namespace Mokeb.Infrastructure.Repositories
{
    public class CaravanRepository : ICaravanPrincipalRepository
    {
        private readonly DbSet<CaravanPrincipal> _principal;

        public CaravanRepository(MokebDbContext principal)
        {
            _principal = principal.Set<CaravanPrincipal>();
        }

        public void AddCaravan(CaravanPrincipal caravanPrincipal)
        {
            _principal.Add(caravanPrincipal);
        }

        public async Task<CaravanPrincipal> GetCaravanByUsernameAsync(string username, string password, CancellationToken ct)
        {
            return await _principal.SingleOrDefaultAsync(x => x.IdentityInformation.Username == username && x.IdentityInformation.Password == password, ct);
        }

        public async Task<bool> IsCaravanByIdenticalInformationExistsAsync(string username, string nationalCode, string passportNumber, CancellationToken ct)
        {
            return await _principal.AnyAsync(x => x.IdentityInformation.Username == username || x.NationalCode == nationalCode || x.PassportNumber == passportNumber, ct);
        }

        public async Task<List<Request>> GetAcceptedOrOnTheWayCaravansRequestsByDateAsync(DateOnly date, CancellationToken ct)
        {
            return await _principal
                .Include(x => x.IdentityInformation)
                .Include(x => x.Requests)
                .ThenInclude(x => x.Travelers)
                .SelectMany(x => x.Requests)
                .Where(x => DateOnly.FromDateTime(x.EnterTime) == date && (x.State == State.Accepted || x.State == State.DelayInEntrance || x.State == State.Entered))
                .ToListAsync(ct);
        }

        public async Task<CaravanPrincipal> GetCaravanByIdAsync(Guid Id, CancellationToken ct)
        {
            return await _principal
                .Include(x => x.Pilgrims)
                .Include(x => x.Requests)
                .ThenInclude(x => x.Travelers)
                .SingleOrDefaultAsync(x => x.Id == Id, ct);
        }

        public async Task<List<Request>> GetAcceptedOrOutGoingCaravansRequestsByDateAsync(DateOnly date, CancellationToken ct)
        {
            return await _principal
                .Include(x => x.IdentityInformation)
                .Include(x => x.Requests)
                .ThenInclude(x => x.Travelers)
                .SelectMany(x => x.Requests)
                .Where(x => DateOnly.FromDateTime(x.ExitTime) == date && (x.State == State.Accepted || x.State == State.DelayInExit || x.State == State.Exited))
                .ToListAsync(ct);
        }

        public async Task<GenderStatsDto> GetEntryStatsAsync(DateOnly date, CancellationToken ct)
        {
            var query = _principal
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
            var query = _principal
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
            var query = _principal
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
            return await _principal
                .Include(x => x.Requests)
                .SelectMany(x => x.Requests)
                .SingleOrDefaultAsync(x => x.Id == Id, ct);
        }

        public async Task<List<Request>> SearchInEnteredOrDelayInEnterRequestWithNameOrFamilyName(DateOnly date, string input, CancellationToken ct)
        {
            return await _principal
                .Where(x => x.Name.ToLower().Contains(input.ToLower()) || x.FamilyName.ToLower().Contains(input.ToLower()))
                .SelectMany(x => x.Requests)
                .Include(x => x.Travelers)
                .Where(x => DateOnly.FromDateTime(x.EnterTime) == date &&
                (x.State == State.Accepted || x.State == State.DelayInEntrance || x.State == State.Entered))
                .ToListAsync(ct);
        }

        public async Task<List<Request>> SearchInExitedOrDelayInExitRequestWithNameOrFamilyName(DateOnly date, string input, CancellationToken ct)
        {
            return await _principal
                .Where(x => x.Name.ToLower().Contains(input.ToLower()) || x.FamilyName.ToLower().Contains(input.ToLower()))
                .SelectMany(x => x.Requests)
                .Include(x => x.Travelers)
                .Where(x => DateOnly.FromDateTime(x.EnterTime) == date &&
                (x.State == State.Exited || x.State == State.DelayInExit || x.State == State.Accepted))
                .ToListAsync(ct);
        }

        public async Task<List<Request>> GetRequestedRequestsByDateAsync(DateOnly date, CancellationToken ct)
        {
            return await _principal
                .Include(x => x.Requests)
                .SelectMany(x => x.Requests)
                .Include(x => x.Travelers)
                .Where(x => DateOnly.FromDateTime(x.EnterTime) == date && x.State == State.Requested)
                .ToListAsync(ct);
        }

        public async Task<List<CaravanPrincipalDto>> GetAllCaravansWithTheirTravelers(CancellationToken ct)
        {
            return await _principal
                .Select(x => new CaravanPrincipalDto(
                    x.Name,
                    x.FamilyName,
                    x.ContactInformation.PhoneNumber,
                    (uint)x.Pilgrims.Count(x => x.Gender == Gender.Male),
                    (uint)x.Pilgrims.Count(x => x.Gender == Gender.Female),
                    x.Pilgrims.Select(x => new PilgrimDto(
                        x.Name,
                        x.FamilyName,
                        x.PhoneNumber,
                        x.NationalCode)).ToList(),
                    x.Id,
                    x.IsActive
                        ))
                .ToListAsync(ct);
        }

        public void RemoveCaravan(CaravanPrincipal caravanPrincipal)
        {
            _principal
                .Remove(caravanPrincipal);
        }

        public async Task<List<CaravanPrincipalDto>> SearchForCaravansByNameOrFamilyName(string input, CancellationToken ct)
        {
            return await _principal
                .Include(x => x.IdentityInformation)
                .Include(x => x.ContactInformation)
                .Include(x => x.Pilgrims)
                .Where(x => x.Name.ToLower().Contains(input.ToLower()) || x.FamilyName.ToLower().Contains(input.ToLower()))
                .Select(x => new CaravanPrincipalDto(
                    x.Name,
                    x.FamilyName,
                    x.ContactInformation.PhoneNumber,
                    (uint)x.Pilgrims.Count(x => x.Gender == Gender.Male),
                    (uint)x.Pilgrims.Count(x => x.Gender == Gender.Female),
                    x.Pilgrims.Select(x => new PilgrimDto(
                        x.Name,
                        x.FamilyName,
                        x.PhoneNumber,
                        x.NationalCode)).ToList(),
                    x.Id,
                    x.IsActive
                        ))
                .ToListAsync(ct);
        }

        public async Task<GenderStatsInAYearDto> GetTravelersOfRequestsStatInAYear(DateOnly date, CancellationToken ct)
        {
            var startDateTime = date.ToDateTime(TimeOnly.MinValue);
            var endDateTime = date.AddYears(1).ToDateTime(TimeOnly.MaxValue);

            return await _principal
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
            return await _principal
                .SelectMany(x => x.Requests)
                .Where(x =>
                    x.EnterTime >= startDateTime &&
                    x.ExitTime < endDateTime &&
                    (x.State == State.Entered || x.State == State.DelayInEntrance ||
                     x.State == State.DelayInExit || x.State == State.Exited))
                .CountAsync(ct);
        }

        public async Task<int> GetAllCaravanRequestedRequestsAmountInADay(DateOnly date, CancellationToken ct)
        {
            var startDateTime = date.ToDateTime(TimeOnly.MinValue);
            var endDateTime = date.AddDays(1).ToDateTime(TimeOnly.MinValue);

            return await _principal
                .SelectMany(x => x.Requests)
                .Where(x =>
                    x.EnterTime >= startDateTime &&
                    x.EnterTime < endDateTime &&
                    x.State == State.Requested)
                .CountAsync(ct);
        }
    }
}
