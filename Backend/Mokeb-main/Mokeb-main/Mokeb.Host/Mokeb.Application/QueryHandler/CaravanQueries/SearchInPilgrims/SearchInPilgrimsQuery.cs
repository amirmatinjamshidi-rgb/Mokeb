using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.CaravanQueries.SearchInPilgrims
{
    public class SearchInPilgrimsQuery : QueryBase, IRequest<SearchInPilgrimsQueryResponse>
    {
        public Guid CaravanId { get; set; }
        public string Input { get; set; }
        public override void Validate()
        {
            new SearchInPilgrimsQueryValidator()
                .Validate(this)
                .ThrowIfNeeded();
        }
    }
}
