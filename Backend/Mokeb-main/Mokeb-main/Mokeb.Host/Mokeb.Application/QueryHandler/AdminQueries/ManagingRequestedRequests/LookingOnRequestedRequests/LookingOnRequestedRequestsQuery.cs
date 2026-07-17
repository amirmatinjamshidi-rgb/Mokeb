using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingRequestedRequests.LookingOnRequestedRequests
{
    public class LookingOnRequestedRequestsQuery : QueryBase, IRequest<LookingOnRequestedRequestsQueryResponse>
    {
        public DateOnly EntranceDate { get; set; }
        public override void Validate()
        {
            new LookingOnRequestedRequestsQueryValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
