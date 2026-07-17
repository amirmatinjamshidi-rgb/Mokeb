using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingIndividuals.SearchInIndividuals
{
    public class SearchInIndividualsQuery : QueryBase, IRequest<SearchInIndividualsQueryResponse>
    {
        public string Input { get; set; }
        public override void Validate()
        {
            new SearchInIndividualsQueryValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
