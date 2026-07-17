using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.AdminQueries.GetRoomAvailabilitiesInADate
{
    public class GetRoomAvailabilitiesInADateQueryResponse
    {
        public static GetRoomAvailabilitiesInADateQueryResponse Response() => new();
        public GetRoomAvailabilitiesInADateQueryResponse WithRoomAvailabilities(List<RoomAvailabilitiesInformationInADateDto> roomAvailabilitiesInfo)
        {
            RoomAvailabilities = roomAvailabilitiesInfo;
            return this;
        }
        public List<RoomAvailabilitiesInformationInADateDto> RoomAvailabilities { get; set; }
    }
}
