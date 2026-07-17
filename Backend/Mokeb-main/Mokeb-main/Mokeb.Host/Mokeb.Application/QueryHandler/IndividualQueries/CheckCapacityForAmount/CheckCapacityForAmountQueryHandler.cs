using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Domain.Model.Entities;
using Mokeb.Domain.Model.Enums;
using ResponseModel = Mokeb.Application.QueryHandler.IndividualQueries.CheckCapacityForAmount.CheckCapacityForAmountQueryResponse;
namespace Mokeb.Application.QueryHandler.IndividualQueries.CheckCapacityForAmount
{
    public class CheckCapacityForAmountQueryHandler : IRequestHandler<CheckCapacityForAmountQuery, CheckCapacityForAmountQueryResponse>
    {
        private readonly IRoomRepository _roomRepository;
        private readonly IIndividualRepository _individualRepository;

        public CheckCapacityForAmountQueryHandler(IRoomRepository roomRepository, IIndividualRepository individualRepository)
        {
            _roomRepository = roomRepository;
            _individualRepository = individualRepository;
        }

        public async Task<CheckCapacityForAmountQueryResponse> Handle(CheckCapacityForAmountQuery request, CancellationToken cancellationToken)
        {
            var individual = await GetIndividual(request.IndividualId, cancellationToken);
            if (individual.Gender == Gender.Male)
                request.MaleAmount++;
            else
                request.FemaleAmount++;
            var listOfDays = request.EnterTime.GetRangeTo(request.ExitTime);
            var maleCapacityResult = await _roomRepository.CheckAmountForMales(listOfDays, request.MaleAmount, cancellationToken);
            var femaleCapacityResult = await _roomRepository.CheckAmountForFemales(listOfDays, request.FemaleAmount, cancellationToken);
            if (maleCapacityResult && femaleCapacityResult)
                return ResponseModel
                    .Response()
                    .WithResult(true);
            return ResponseModel
                .Response()
                .WithResult(false);
        }
        #region Private Methods
        private async Task<IndividualPrincipal> GetIndividual(Guid individualId, CancellationToken ct)
        {
            var individual = await _individualRepository.GetIndividualByIdAsync(individualId, ct);
            if (individual is null)
                throw new PrincipalNotFoundApplicationException();
            return individual;
        }
        #endregion
    }
}
