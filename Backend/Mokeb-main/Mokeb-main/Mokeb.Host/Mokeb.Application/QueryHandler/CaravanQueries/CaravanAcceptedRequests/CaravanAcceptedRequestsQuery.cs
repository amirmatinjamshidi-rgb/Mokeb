using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.CaravanQueries.CaravanAcceptedRequests
{
    public class CaravanAcceptedRequestsQuery : QueryBase, IRequest<CaravanAcceptedRequestsQueryResponse>
    {
        public Guid CaravanId { get; set; }
        public override void Validate()
        {
            new CaravanAcceptedRequestsQueryValidator()
                .Validate(this)
                .ThrowIfNeeded();
        }
    }
}
