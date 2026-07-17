using FluentValidation.Results;
using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.CommandHandler.Base.Extension
{
    public static class ValidateResultExtension
    {
        public static void ThrowIfNeeded(this ValidationResult validationResult)
        {
            var errors = validationResult.Errors;

            if (errors.Any())
                throw new InputValidationFailedApplicationException(string.Join(Environment.NewLine, errors.Select(e => e.ErrorMessage)));
        }

    }
}
