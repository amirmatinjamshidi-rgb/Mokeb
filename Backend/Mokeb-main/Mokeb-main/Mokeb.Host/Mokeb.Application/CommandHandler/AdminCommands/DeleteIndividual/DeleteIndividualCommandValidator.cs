using FluentValidation;

namespace Mokeb.Application.CommandHandler.AdminCommands.DeleteIndividual
{
    public class DeleteIndividualCommandValidator : AbstractValidator<DeleteIndividualCommand>
    {
        public DeleteIndividualCommandValidator()
        {
            RuleFor(x => x.IndividualId)
                .NotEmpty()
                .WithMessage("ایدی شخص نمیتواند خالی باشد");
        }
    }
}
