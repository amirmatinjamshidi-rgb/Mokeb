using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.AdminQueries.AllTravelersGenderStaticsInAYear
{
    public class AllTravelersGenderStaticsInAYearQuery : QueryBase, IRequest<AllTravelersGenderStaticsInAYearQueryResponse>
    {
        public string Year { get; set; }
        public override void Validate()
        {
            new AllTravelersGenderStaticsInAYearQueryValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
