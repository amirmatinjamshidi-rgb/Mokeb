using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.GettingOutGoingOrAcceptedRequestsByDate
{
    public class GettingOutGoingOrAcceptedRequestsByDateQuery : QueryBase, IRequest<GettingOutGoingOrAcceptedRequestsByDateQueryResponse>
    {
        public DateOnly Date { get; set; }
        public override void Validate()
        {
            new GettingOutGoingOrAcceptedRequestsByDateQueryValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
