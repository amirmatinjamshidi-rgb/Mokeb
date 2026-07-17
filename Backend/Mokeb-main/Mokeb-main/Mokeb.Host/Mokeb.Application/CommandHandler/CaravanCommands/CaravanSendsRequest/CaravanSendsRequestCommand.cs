using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.CaravanCommands.CaravanSendsRequest
{
    public class CaravanSendsRequestCommand : CommandBase, IRequest<CaravanSendsRequestCommandResponse>
    {
        public Guid CaravanId { get; set; }
        public int MaleAmount { get; set; }
        public int FemaleAmount { get; set; }
        public DateTime EnterTime { get; set; }
        public DateTime ExitTime { get; set; }
        public override void Validate()
        {
            new CaravanSendsRequestCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
