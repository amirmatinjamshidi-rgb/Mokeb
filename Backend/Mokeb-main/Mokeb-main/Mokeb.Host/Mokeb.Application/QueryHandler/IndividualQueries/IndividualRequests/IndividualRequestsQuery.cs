using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.IndividualQueries.IndividualRequests
{
    public class IndividualRequestsQuery : QueryBase, IRequest<IndividualRequestsQueryResponse>
    {
        public Guid IndividualId { get; set; }
        public override void Validate()
        {
            new IndividualRequestsQueryValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
