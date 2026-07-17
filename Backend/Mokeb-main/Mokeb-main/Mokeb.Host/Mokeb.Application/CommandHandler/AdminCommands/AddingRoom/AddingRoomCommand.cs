using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Domain.Model.Enums;

namespace Mokeb.Application.CommandHandler.AdminCommands.AddingRoom
{
    public class AddingRoomCommand : CommandBase, IRequest<AddingRoomCommandResponse>
    {
        public string Name { get; set; }
        public Gender Gender { get; set; }
        public uint Capacity { get; set; }
        public override void Validate()
        {
            new AddingRoomCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
