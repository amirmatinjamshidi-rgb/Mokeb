using MediatR;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.AdminQueries.GetAllRooms
{
    public class GetAllRoomsQuery : QueryBase, IRequest<GetAllRoomsQueryResponse>
    {
        public override void Validate()
        {
        }
    }
}
