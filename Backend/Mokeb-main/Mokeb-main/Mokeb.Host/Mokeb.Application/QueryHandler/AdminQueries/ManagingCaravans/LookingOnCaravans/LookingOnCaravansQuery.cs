using MediatR;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingCaravans.LookingOnCaravans
{
    public class LookingOnCaravansQuery : QueryBase, IRequest<LookingOnCaravansQueryResponse>
    {
        public override void Validate()
        {
        }
    }
}
