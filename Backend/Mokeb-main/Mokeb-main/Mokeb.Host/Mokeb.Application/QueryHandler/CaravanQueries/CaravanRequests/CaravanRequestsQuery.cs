using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.CaravanQueries.CaravanRequests
{
    public class CaravanRequestsQuery : QueryBase, IRequest<CaravanRequestsQueryResponse>
    {
        public Guid CaravanId { get; set; }
        public override void Validate()
        {
            new CaravanRequestsQueryValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
