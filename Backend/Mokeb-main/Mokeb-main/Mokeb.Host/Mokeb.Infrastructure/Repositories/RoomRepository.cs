using Microsoft.EntityFrameworkCore;
using Mokeb.Application.Contracts;
using Mokeb.Application.Dtos;
using Mokeb.Domain.Model.Entities;
using Mokeb.Domain.Model.Enums;
using Mokeb.Infrastructure.Context;

namespace Mokeb.Infrastructure.Repositories
{
    public class RoomRepository : IRoomRepository
    {
        private readonly DbSet<Room> _rooms;
        private readonly DbSet<RoomAvailability> _roomAvailabilities;

        public RoomRepository(MokebDbContext rooms)
        {
            _rooms = rooms.Set<Room>();
            _roomAvailabilities = rooms.Set<RoomAvailability>();
        }

        public void AddRoom(Room room)
        {
            _rooms.Add(room);
        }

        public async Task<bool> CheckAvailabilityDayOfARoomAsync(Guid roomId, DateOnly date, CancellationToken ct)
        {
            return await _rooms.Include(x => x.RoomAvailabilities).Where(x => x.Id == roomId).SelectMany(x => x.RoomAvailabilities).AnyAsync(x => x.AvailableDay == date, ct);
        }

        public async Task<bool> CheckRoomExistanceByIdAsync(Guid roomId, CancellationToken ct)
        {
            return await _rooms.AnyAsync(x => x.Id == roomId, ct);
        }

        public async Task<bool> CheckRoomExistanceByNameAsync(string roomName, CancellationToken ct)
        {
            return await _rooms.AnyAsync(x => x.Name.ToLower() == roomName.ToLower(), ct);
        }

        public async Task<RoomAvailability> GetRoomAvailabilityByIdAsync(Guid availableRoomId, CancellationToken ct)
        {
            return await _rooms.Include(x => x.RoomAvailabilities).SelectMany(x => x.RoomAvailabilities).SingleOrDefaultAsync(x => x.Id == availableRoomId, ct);
        }

        public async Task<List<RoomAvailability>> GetAvailabilitiesByRoomIdAndDatesAsync(Guid roomId, List<DateOnly> dates, CancellationToken ct)
        {
            return await _rooms.Include(x => x.RoomAvailabilities)
            .SelectMany(x => x.RoomAvailabilities)
            .Where(ra => ra.RoomId == roomId && dates.Contains(ra.AvailableDay))
            .ToListAsync(ct);
        }

        public async Task<Room> GetRoomByIdAsync(Guid roomId, CancellationToken ct)
        {
            return await _rooms.SingleOrDefaultAsync(x => x.Id == roomId, ct);
        }

        public async Task<int> GetSumOfAllFemaleRoomsCapacities(CancellationToken ct)
        {
            return await _rooms.Where(x => x.Gender == Gender.Female).SumAsync(x => (int)x.Capacity, ct);
        }

        public async Task<int> GetSumOfAllMaleRoomsCapacities(CancellationToken ct)
        {
            return await _rooms.Where(x => x.Gender == Gender.Male).SumAsync(x => (int)x.Capacity, ct);
        }

        public async Task<int> GetSumOfAllRoomsCapacities(CancellationToken ct)
        {
            return await _rooms
                .SumAsync(x => (int)x.Capacity, ct);
        }

        public async Task<int> GetSumOfAvailableCapacityAtADay(DateOnly date, CancellationToken ct)
        {
            return await _rooms
                .Include(x => x.RoomAvailabilities)
                .SelectMany(x => x.RoomAvailabilities)
                .Where(x => x.AvailableDay == date)
                .SumAsync(x => (int)x.AvailableCapacity, ct);
        }

        public void RemoveRoomById(Room room)
        {
            _rooms.Remove(room);
        }
        public async Task<List<RoomAvailabilityDto>> GetDistinctRoomAvailabilitesFromEnteredRoomIdList(List<Guid> roomIds, List<DateOnly> dateRange, CancellationToken ct)
        {
            return await _rooms
                    .Where(r => !roomIds.Contains(r.Id))
                    .SelectMany(r => r.RoomAvailabilities, (room, availability) => new { room, availability })
                    .Where(x => dateRange.Contains(x.availability.AvailableDay))
                    .Select(x => new RoomAvailabilityDto(
                        x.availability.AvailableDay,
                        x.availability.AvailableCapacity,
                        x.room.Gender,
                        x.room.Capacity,
                        x.room.Capacity - x.availability.AvailableCapacity
                    )
                    {
                        RoomAvailabilityId = x.availability.Id,
                        RoomId = x.room.Id,
                        RoomName = x.room.Name,
                    })
                    .ToListAsync(ct);
        }

        public async Task<List<RoomAvailability>> GetAvailabilitiesByRoomIdsAndDatesAsync(List<Guid> roomIds, List<DateOnly> dates, CancellationToken ct)
        {
            return await _rooms
                .Include(x => x.RoomAvailabilities)
                .Where(x => roomIds.Contains(x.Id))
                .SelectMany(x => x.RoomAvailabilities)
                .Include(x => x.Room)
                .Where(x => dates.Contains(x.AvailableDay))
                .ToListAsync(ct);
        }

        public async Task<List<RoomAvailabilityDto>> GetRoomAvailabilitiesAtDatesAsync(List<DateOnly> dateRange, CancellationToken ct)
        {
            return await _rooms
                .Include(x => x.RoomAvailabilities)
                .SelectMany(x => x.RoomAvailabilities, (room, availability) => new { room, availability })
                .Where(x => dateRange.Contains(x.availability.AvailableDay))
                .Select(x => new RoomAvailabilityDto(
                    x.availability.AvailableDay,
                    x.availability.AvailableCapacity,
                    x.room.Gender,
                    x.room.Capacity,
                    x.room.Capacity - x.availability.AvailableCapacity
                    )
                {
                    RoomAvailabilityId = x.availability.Id,
                    RoomId = x.room.Id,
                    RoomName = x.room.Name,
                })
                .ToListAsync(ct);
        }

        public async Task<List<RoomAvailability>> GetRoomAvailabilitiesByRoomAvailabilityIdsAsync(List<Guid> roomAvailabilityIds, CancellationToken ct)
        {
            return await _rooms
                .Include(x => x.RoomAvailabilities)
                .SelectMany(x => x.RoomAvailabilities)
                .Include(x => x.Room)
                .Where(x => roomAvailabilityIds.Contains(x.Id))
                .ToListAsync(ct);
        }

        public async Task<List<RoomAvailabilitiesInformationInADateDto>> GetRoomAvailabilitiesInformationInADateAsync(DateOnly date, CancellationToken ct)
        {
            return await _rooms
                .SelectMany(x => x.RoomAvailabilities)
                .Where(x => x.AvailableDay == date)
                .Select(x => new RoomAvailabilitiesInformationInADateDto(
                    x.AvailableDay,
                    x.Room.Capacity - x.AvailableCapacity,
                    x.AvailableCapacity,
                    x.Room.Gender
                    ))
                .ToListAsync(ct);
        }

        public async Task<bool> CheckAmountForMales(List<DateOnly> dates, int maleAmount, CancellationToken ct)
        {
            var requiredDaysCount = dates.Distinct().Count();

            var validDaysCount = await _rooms
                .SelectMany(x => x.RoomAvailabilities)
                .Where(x => dates.Contains(x.AvailableDay) && x.Room.Gender == Gender.Male)
                .GroupBy(x => x.AvailableDay)
                .Select(g => new
                {
                    Day = g.Key,
                    TotalCapacity = g.Sum(x => x.AvailableCapacity)
                })
                .Where(x => x.TotalCapacity >= maleAmount)
                .CountAsync(ct);

            return validDaysCount == requiredDaysCount;
        }


        public async Task<bool> CheckAmountForFemales(List<DateOnly> dates, int femaleAmount, CancellationToken ct)
        {
            var requiredDaysCount = dates.Distinct().Count();

            var validDaysCount = await _rooms
                .SelectMany(x => x.RoomAvailabilities)
                .Where(x => dates.Contains(x.AvailableDay) && x.Room.Gender == Gender.Female)
                .GroupBy(x => x.AvailableDay)
                .Select(g => new
                {
                    Day = g.Key,
                    TotalCapacity = g.Sum(x => x.AvailableCapacity)
                })
                .Where(x => x.TotalCapacity >= femaleAmount)
                .CountAsync(ct);

            return validDaysCount == requiredDaysCount;
        }

        public async Task<List<RoomAvailability>> GetRoomAvailabilities(List<DateOnly> dateRange, CancellationToken ct)
        {
            return await _rooms
                .SelectMany(x => x.RoomAvailabilities)
                .Where(x => dateRange.Contains(x.AvailableDay) && x.AvailableCapacity > 0)
                .Include(x => x.Room)
                .OrderBy(x => x.AvailableCapacity)
                .ToListAsync(ct);
        }

        public async Task<List<Room>> GetAllRoomsAsync(CancellationToken ct)
        {
            return await _rooms.AsNoTracking().OrderBy(x => x.Name).ToListAsync(ct);
        }

        //public async Task<List<Room>> GetAvailableRooms(List<DateOnly> dateRange, CancellationToken ct)
        //    => await _rooms
        //            .Include(c => c.RoomAvailabilities)
        //            .Where(c => c.RoomAvailabilities.Any(q => dateRange.Contains(q.AvailableDay) &&
        //                                                      q.AvailableCapacity > 0))
        //            .ToListAsync(ct);
    }
}
