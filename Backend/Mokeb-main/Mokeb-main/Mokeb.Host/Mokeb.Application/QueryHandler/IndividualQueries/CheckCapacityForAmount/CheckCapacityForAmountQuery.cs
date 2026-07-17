using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.IndividualQueries.CheckCapacityForAmount
{
    public class CheckCapacityForAmountQuery : QueryBase, IRequest<CheckCapacityForAmountQueryResponse>
    {
        public Guid IndividualId { get; set; }
        public DateOnly EnterTime { get; set; }
        public DateOnly ExitTime { get; set; }
        public int MaleAmount { get; set; }
        public int FemaleAmount { get; set; }
        public override void Validate()
        {
            new CheckCapacityForAmountQueryValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
