using MediatR;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingFAQs.GetAllFAQs
{
    public class GetAllFAQsQuery : QueryBase, IRequest<GetAllFAQsQueryResponse>
    {
        public override void Validate()
        {
        }
    }
}
