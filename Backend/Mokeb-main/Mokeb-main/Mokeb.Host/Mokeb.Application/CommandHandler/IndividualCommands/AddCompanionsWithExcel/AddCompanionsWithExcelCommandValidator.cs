using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace Mokeb.Application.CommandHandler.IndividualCommands.AddCompanionsWithExcel
{
    public class AddCompanionsWithExcelCommandValidator : AbstractValidator<AddCompanionsWithExcelCommand>
    {
        public AddCompanionsWithExcelCommandValidator()
        {
            RuleFor(x => x.IndividualId)
                .NotEmpty()
                .WithMessage("شناسه فرد نمیتواند خالی باشد");

            RuleFor(x => x.ExcelFile)
                .Must(CheckFileExtension)
                .WithMessage("فورمت فایل درست نمیباشد");
        }
        public bool CheckFileExtension(IFormFile file)
        {
            if (file is null)
                return false;
            var extension = Path.GetExtension(file.FileName).ToLower();
            return extension == ".xlsx";
        }
    }
}
