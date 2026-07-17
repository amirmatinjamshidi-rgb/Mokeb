using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.IndividualQueries.SearchInIndividualCompanions
{
    public class SearchInIndividualCompanionsQuery : QueryBase, IRequest<SearchInIndividualCompanionsQueryResponse>
    {
        public Guid IndividualId { get; set; }
        public string Input { get; set; }
        public override void Validate()
        {
            new SearchInIndividualCompanionsQueryValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
