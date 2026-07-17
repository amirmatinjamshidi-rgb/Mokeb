using MediatR;
using Microsoft.AspNetCore.Http;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.CaravanCommands.AddPilgrimsWithExcel
{
    public class AddPilgrimsWithExcelCommand : CommandBase, IRequest<AddPilgrimsWithExcelCommandResponse>
    {
        public Guid CaravanId { get; set; }
        public IFormFile ExcelFile { get; set; }
        public override void Validate()
        {
            new AddPilgrimsWithExcelCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
