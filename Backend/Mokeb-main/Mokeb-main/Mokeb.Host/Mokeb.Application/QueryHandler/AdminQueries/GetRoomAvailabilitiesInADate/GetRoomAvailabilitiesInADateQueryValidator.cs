using FluentValidation;

namespace Mokeb.Application.QueryHandler.AdminQueries.GetRoomAvailabilitiesInADate
{
    public class GetRoomAvailabilitiesInADateQueryValidator : AbstractValidator<GetRoomAvailabilitiesInADateQuery>
    {
        public GetRoomAvailabilitiesInADateQueryValidator()
        {
            RuleFor(x => x.Date)
                .NotEmpty()
                .WithMessage("تاریخ نمیتواند خالی باشد");
        }
    }
}
