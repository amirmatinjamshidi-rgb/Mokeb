using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.Dtos;

namespace Mokeb.Application.CommandHandler.IndividualCommands.ReserveRoom
{
    public class ReserveRoomCommand : CommandBase, IRequest<ReserveRoomCommandResponse>
    {
        public Guid IndividualId { get; set; }
        public DateTime DateOfEntrance { get; set; }
        public DateTime DateOfExit { get; set; }
        public int MaleAmount { get; set; }
        public int FemaleAmount { get; set; }
        public List<TravelerDto> Travelers { get; set; }
        public override void Validate()
        {
            new ReserveRoomCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
