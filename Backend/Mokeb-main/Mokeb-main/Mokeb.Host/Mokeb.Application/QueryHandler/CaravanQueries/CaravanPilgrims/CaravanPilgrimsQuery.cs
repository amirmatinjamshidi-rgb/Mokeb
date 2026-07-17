using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.CaravanQueries.CaravanPilgrims
{
    public class CaravanPilgrimsQuery : QueryBase, IRequest<CaravanPilgrimsQueryResponse>
    {
        public Guid CaravanId { get; set; }
        public override void Validate()
        {
            new CaravanPilgrimsQueryValidator().Validate(this)
                .ThrowIfNeeded();
        }
    }
}
