using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.CommandHandler.IndividualCommands.AddCompanion;
using Mokeb.Application.Contracts;
using Mokeb.Application.Dtos;
using Mokeb.Application.Exceptions;
using Mokeb.Application.Services;
using Mokeb.Common.Base.ApplicationExceptions;
using Mokeb.Domain.Model.Entities;
using Mokeb.Domain.Model.Enums;
using ResponseModel = Mokeb.Application.CommandHandler.IndividualCommands.AddCompanionsWithExcel.AddCompanionsWithExcelCommandResponse;
namespace Mokeb.Application.CommandHandler.IndividualCommands.AddCompanionsWithExcel
{
    public class AddCompanionsWithExcelCommandHandler : IRequestHandler<AddCompanionsWithExcelCommand, AddCompanionsWithExcelCommandResponse>
    {
        private readonly IIndividualRepository _individualRepository;
        private readonly IUnitOfWork _unitOfWork;

        public AddCompanionsWithExcelCommandHandler(IIndividualRepository individualRepository, IUnitOfWork unitOfWork)
        {
            _individualRepository = individualRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<AddCompanionsWithExcelCommandResponse> Handle(AddCompanionsWithExcelCommand request, CancellationToken cancellationToken)
        {
            var individual = await GetIndividual(request.IndividualId, cancellationToken);
            var companions = await ExcelService.GenereateObjectFromExcelAsync<Companion, ExcelCompanionAndPilgrimDto>(request.ExcelFile, (dto) => new Companion
            (
                dto.Name,
                dto.FamilyName,
                dto.NationalCode,
                dto.DateOfBirth.ToGregorianDateOnly(),
                dto.PhoneNumber,
                dto.Gender == "اقا" || dto.Gender == "آقا" ? Gender.Male : Gender.Female,
                dto.PassportNumber,
                dto.EmergencyPhoneNumber
            ),
            cancellationToken);
            CheckCompanionExistance(companions, individual);
            AddCompanions(companions, individual);
            var savingResult = await _unitOfWork.Commit(cancellationToken);
            savingResult.ThrowIfNoChanges<NoChangesApplicationException>();
            return ResponseModel
                .Response()
                .WithResult(true);

        }
        #region Private Methods
        private async Task<IndividualPrincipal> GetIndividual(Guid individualId, CancellationToken ct)
        {
            var individual = await _individualRepository.GetIndividualByIdAsync(individualId, ct);
            if (individual is null)
                throw new PrincipalNotFoundApplicationException();
            return individual;
        }
        private void CheckCompanionExistance(List<Companion> companions, IndividualPrincipal individual)
        {
            foreach (var companion in companions)
            {
                if (individual.Companion.Any(x => x.NationalCode == companion.NationalCode))
                    throw new CompanionExistException();
            }
        }
        private void AddCompanions(List<Companion> companions, IndividualPrincipal principal)
        {
            foreach (var companion in companions)
                principal.AddCompanion(companion);
        }
        #endregion
    }
}
