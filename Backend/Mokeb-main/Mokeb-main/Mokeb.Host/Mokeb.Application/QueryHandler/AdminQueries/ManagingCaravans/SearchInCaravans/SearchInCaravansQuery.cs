using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingCaravans.SearchInCaravans
{
    public class SearchInCaravansQuery : QueryBase, IRequest<SearchInCaravansQueryResponse>
    {
        public string Input { get; set; }
        public override void Validate()
        {
            new SearchInCaravansQueryValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
