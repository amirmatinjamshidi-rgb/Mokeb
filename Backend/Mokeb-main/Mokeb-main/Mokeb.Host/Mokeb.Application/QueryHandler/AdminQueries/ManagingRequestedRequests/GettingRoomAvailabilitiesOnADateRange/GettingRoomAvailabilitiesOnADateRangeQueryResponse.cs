using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingRequestedRequests.GettingRoomAvailabilitiesOnADateRange
{
    public class GettingRoomAvailabilitiesOnADateRangeQueryResponse
    {
        public static GettingRoomAvailabilitiesOnADateRangeQueryResponse Response() => new();
        public GettingRoomAvailabilitiesOnADateRangeQueryResponse WithRoomAvailabilities(List<RoomAvailabilityDto> maleRoomAvailabilities
            , List<RoomAvailabilityDto> femaleRoomAvailabilities)
        {
            MaleRoomAvailabilities = maleRoomAvailabilities;
            FemaleRoomAvailabilities = femaleRoomAvailabilities;
            return this;
        }
        public List<RoomAvailabilityDto> MaleRoomAvailabilities { get; set; }
        public List<RoomAvailabilityDto> FemaleRoomAvailabilities { get; set; }

    }
}
