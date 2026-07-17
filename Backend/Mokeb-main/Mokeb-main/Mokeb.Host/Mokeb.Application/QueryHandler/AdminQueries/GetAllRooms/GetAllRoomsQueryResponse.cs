using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.AdminQueries.GetAllRooms
{
    public class GetAllRoomsQueryResponse
    {
        public static GetAllRoomsQueryResponse Response() => new();

        public GetAllRoomsQueryResponse WithRooms(List<RoomListItemDto> rooms)
        {
            Rooms = rooms;
            return this;
        }

        public List<RoomListItemDto> Rooms { get; set; } = new();
    }
}
