using MediatR;
using Microsoft.AspNetCore.Http;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.IndividualCommands.AddCompanionsWithExcel
{
    public class AddCompanionsWithExcelCommand : CommandBase, IRequest<AddCompanionsWithExcelCommandResponse>
    {
        public Guid IndividualId { get; set; }
        public IFormFile ExcelFile { get; set; }
        public override void Validate()
        {
            new AddCompanionsWithExcelCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
