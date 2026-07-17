using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace Mokeb.Application.CommandHandler.CaravanCommands.AddTravelersToRequestByExcel
{
    public class AddTravelersToRequestByExcelCommandValidator : AbstractValidator<AddTravelersToRequestByExcelCommand>
    {
        public AddTravelersToRequestByExcelCommandValidator()
        {
            RuleFor(x => x.CaravanId)
                .NotEmpty()
                .WithMessage("شناسه فرد نمیتواند خالی باشد");

            RuleFor(x => x.ExcelFile)
                .Must(CheckFileExtension)
                .WithMessage("فورمت فایل درست نمیباشد");

            RuleFor(x => x.RequestId)
                .NotEmpty()
                .WithMessage("شناسه درخواست نمیتواند خالی باشد");
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
