using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.Dtos;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.CommandHandler.CaravanCommands.AddTravelersToRequest
{
    public class AddTravelersToRequestCommand : QueryBase, IRequest<AddTravelersToRequestCommandResponse>
    {
        public Guid CaravanId { get; set; }
        public Guid RequestId { get; set; }
        public List<TravelerDto> Travelers { get; set; }
        public override void Validate()
        {
            new AddTravelersToRequestCommandValidator()
                .Validate(this)
                .ThrowIfNeeded();
        }
    }
}
