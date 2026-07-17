using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.IndividualQueries.GetCompanions
{
    public class GetCompanionsQuery : QueryBase, IRequest<GetCompanionsQueryResponse>
    {
        public Guid IndividualId { get; set; }
        public override void Validate()
        {
            new GetCompanionsQueryValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
