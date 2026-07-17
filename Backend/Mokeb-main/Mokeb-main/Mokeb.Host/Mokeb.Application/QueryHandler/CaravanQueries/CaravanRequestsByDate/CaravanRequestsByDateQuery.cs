using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.CaravanQueries.CaravanRequestsByDate
{
    public class CaravanRequestsByDateQuery : QueryBase, IRequest<CaravanRequestsByDateQueryResponse>
    {
        public Guid CaravanId { get; set; }
        public DateOnly Date { get; set; }
        public override void Validate()
        {
            new CaravanRequestsByDateQueryValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
