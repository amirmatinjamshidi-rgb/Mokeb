using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.GettingIncomingOrAcceptedRequestByDate
{
    public class GettingIncomingOrAcceptedRequestByDateQuery : QueryBase, IRequest<GettingIncomingOrAcceptedRequestByDateQueryResponse>
    {
        public DateOnly Date { get; set; }
        public override void Validate()
        {
            new GettingIncomingOrAcceptedRequestByDateQueryValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
