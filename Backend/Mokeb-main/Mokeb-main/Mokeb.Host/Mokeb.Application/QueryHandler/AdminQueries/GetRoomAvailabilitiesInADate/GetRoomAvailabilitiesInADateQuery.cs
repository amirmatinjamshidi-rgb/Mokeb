using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.AdminQueries.GetRoomAvailabilitiesInADate
{
    public class GetRoomAvailabilitiesInADateQuery : QueryBase, IRequest<GetRoomAvailabilitiesInADateQueryResponse>
    {
        public DateOnly Date { get; set; }
        public override void Validate()
        {
            new GetRoomAvailabilitiesInADateQueryValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
