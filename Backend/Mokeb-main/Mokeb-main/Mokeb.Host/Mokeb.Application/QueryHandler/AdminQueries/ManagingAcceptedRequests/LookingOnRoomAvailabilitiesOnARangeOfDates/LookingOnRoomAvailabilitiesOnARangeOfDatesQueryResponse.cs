using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.LookingOnRoomAvailabilitiesOnARangeOfDates
{
    public class LookingOnRoomAvailabilitiesOnARangeOfDatesQueryResponse
    {
        public static LookingOnRoomAvailabilitiesOnARangeOfDatesQueryResponse ToResponse(List<RoomAvailabilityDto> maleAvailability, List<RoomAvailabilityDto> femaleAvailability)
        {
            return new LookingOnRoomAvailabilitiesOnARangeOfDatesQueryResponse()
            {
                MaleAvailability = maleAvailability,
                FemaleAvailability = femaleAvailability
            };
        }
        public List<RoomAvailabilityDto> MaleAvailability { get; set; }
        public List<RoomAvailabilityDto> FemaleAvailability { get; set; }
    }
}
