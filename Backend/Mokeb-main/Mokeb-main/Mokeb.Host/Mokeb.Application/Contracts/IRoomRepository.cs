using Mokeb.Application.Dtos;
using Mokeb.Domain.Model.Entities;

namespace Mokeb.Application.Contracts
{
    public interface IRoomRepository
    {
        void AddRoom(Room room);
        void RemoveRoomById(Room room);
        Task<bool> CheckRoomExistanceByNameAsync(string roomName, CancellationToken ct);
        Task<bool> CheckRoomExistanceByIdAsync(Guid roomId, CancellationToken ct);
        Task<bool> CheckAvailabilityDayOfARoomAsync(Guid roomId, DateOnly date, CancellationToken ct);
        Task<Room> GetRoomByIdAsync(Guid roomId, CancellationToken ct);
        Task<RoomAvailability> GetRoomAvailabilityByIdAsync(Guid availableRoomId, CancellationToken ct);
        Task<int> GetSumOfAllRoomsCapacities(CancellationToken ct);
        Task<int> GetSumOfAvailableCapacityAtADay(DateOnly date, CancellationToken ct);
        Task<int> GetSumOfAllMaleRoomsCapacities(CancellationToken ct);
        Task<int> GetSumOfAllFemaleRoomsCapacities(CancellationToken ct);
        Task<List<RoomAvailability>> GetAvailabilitiesByRoomIdAndDatesAsync(Guid roomId, List<DateOnly> dates, CancellationToken ct);
        Task<List<RoomAvailabilityDto>> GetDistinctRoomAvailabilitesFromEnteredRoomIdList(List<Guid> roomIds, List<DateOnly> dateRange, CancellationToken ct);
        Task<List<RoomAvailability>> GetAvailabilitiesByRoomIdsAndDatesAsync(List<Guid> roomIds, List<DateOnly> dateRange, CancellationToken ct);
        Task<List<RoomAvailabilityDto>> GetRoomAvailabilitiesAtDatesAsync(List<DateOnly> dateRange, CancellationToken ct);
        Task<List<RoomAvailability>> GetRoomAvailabilitiesByRoomAvailabilityIdsAsync(List<Guid> roomAvailabilityIds, CancellationToken ct);
        Task<List<RoomAvailabilitiesInformationInADateDto>> GetRoomAvailabilitiesInformationInADateAsync(DateOnly date, CancellationToken ct);
        Task<bool> CheckAmountForMales(List<DateOnly> dates, int maleAmount, CancellationToken ct);
        Task<bool> CheckAmountForFemales(List<DateOnly> dates, int femaleAmount, CancellationToken ct);
        Task<List<RoomAvailability>> GetRoomAvailabilities(List<DateOnly> dateRange, CancellationToken ct);
        Task<List<Room>> GetAllRoomsAsync(CancellationToken ct);
    }
}
