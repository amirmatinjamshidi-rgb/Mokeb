using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.AdminQueries.RequestedRequestsAtADayAmount
{
    public class RequestedRequestsAtADayAmountQuery : QueryBase, IRequest<RequestedRequestsAtADayAmountQueryResponse>
    {
        public DateOnly Date { get; set; }
        public override void Validate()
        {
            new RequestedRequestsAtADayAmountQueryValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
