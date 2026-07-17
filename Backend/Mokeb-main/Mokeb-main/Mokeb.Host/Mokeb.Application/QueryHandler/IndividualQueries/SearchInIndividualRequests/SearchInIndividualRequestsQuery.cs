using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.IndividualQueries.SearchInIndividualRequests
{
    public class SearchInIndividualRequestsQuery : QueryBase, IRequest<SearchInIndividualRequestsQueryResponse>
    {
        public Guid IndividualId { get; set; }
        public DateOnly Date { get; set; }
        public override void Validate()
        {
            new SearchInIndividualRequestsQueryValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
