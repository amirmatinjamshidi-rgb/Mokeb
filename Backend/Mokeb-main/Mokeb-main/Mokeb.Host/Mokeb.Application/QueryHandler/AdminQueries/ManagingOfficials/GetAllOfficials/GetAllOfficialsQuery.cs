using MediatR;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingOfficials.GetAllOfficials
{
    public class GetAllOfficialsQuery : QueryBase, IRequest<GetAllOfficialsQueryResponse>
    {
        public override void Validate()
        {
        }
    }
}
