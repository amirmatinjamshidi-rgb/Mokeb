using MediatR;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingIndividuals.LookingOnIndividuals
{
    public class LookingOnIndividualsQuery : QueryBase, IRequest<LookingOnIndividualsQueryResponse>
    {
        public override void Validate()
        {
        }
    }
}
