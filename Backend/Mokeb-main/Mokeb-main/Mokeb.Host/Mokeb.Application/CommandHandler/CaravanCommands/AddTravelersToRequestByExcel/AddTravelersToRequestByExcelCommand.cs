using MediatR;
using Microsoft.AspNetCore.Http;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.CaravanCommands.AddTravelersToRequestByExcel
{
    public class AddTravelersToRequestByExcelCommand : CommandBase, IRequest<AddTravelersToRequestByExcelCommandResponse>
    {
        public Guid CaravanId { get; set; }
        public Guid RequestId { get; set; }
        public IFormFile ExcelFile { get; set; }
        public override void Validate()
        {
            new AddTravelersToRequestByExcelCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
