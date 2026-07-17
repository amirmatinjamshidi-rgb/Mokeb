using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.CapacityReportByDate
{
    public class CapacityReportByDateQuery : QueryBase, IRequest<CapacityReportByDateQueryResponse>
    {
        public DateOnly Date { get; set; }
        public override void Validate()
        {
            new CapacityReportByDateQueryValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
