using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.AdminQueries.GetAllRooms
{
    public class GetAllRoomsQueryHandler : IRequestHandler<GetAllRoomsQuery, GetAllRoomsQueryResponse>
    {
        private readonly IRoomRepository _roomRepository;

        public GetAllRoomsQueryHandler(IRoomRepository roomRepository)
        {
            _roomRepository = roomRepository;
        }

        public async Task<GetAllRoomsQueryResponse> Handle(GetAllRoomsQuery request, CancellationToken cancellationToken)
        {
            var rooms = await _roomRepository.GetAllRoomsAsync(cancellationToken);
            var items = rooms
                .Select(r => new RoomListItemDto(r.Id, r.Name, r.Gender, r.Capacity))
                .ToList();
            return GetAllRoomsQueryResponse.Response().WithRooms(items);
        }
    }
}
