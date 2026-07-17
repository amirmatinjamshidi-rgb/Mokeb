using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.SearchForEnteredOrDelayInEntrance
{
    public class SearchForEnteredOrDelayInEntranceQuery : QueryBase, IRequest<SearchForEnteredOrDelayInEntranceQueryResponse>
    {
        public string Input { get; set; }
        public DateOnly Date { get; set; }
        public override void Validate()
        {
            new SearchForEnteredOrDelayInEntranceQueryValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
