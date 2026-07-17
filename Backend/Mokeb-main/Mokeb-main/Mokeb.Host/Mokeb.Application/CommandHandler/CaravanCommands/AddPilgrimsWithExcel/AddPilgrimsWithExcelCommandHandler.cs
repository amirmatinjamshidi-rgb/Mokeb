using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.Contracts;
using Mokeb.Application.Dtos;
using Mokeb.Application.Exceptions;
using Mokeb.Application.Services;
using Mokeb.Common.Base.ApplicationExceptions;
using Mokeb.Domain.Model.Entities;
using Mokeb.Domain.Model.Enums;
using ResponseModel = Mokeb.Application.CommandHandler.CaravanCommands.AddPilgrimsWithExcel.AddPilgrimsWithExcelCommandResponse;
namespace Mokeb.Application.CommandHandler.CaravanCommands.AddPilgrimsWithExcel
{
    public class AddPilgrimsWithExcelCommandHandler : IRequestHandler<AddPilgrimsWithExcelCommand, AddPilgrimsWithExcelCommandResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;
        private readonly IUnitOfWork _unitOfWork;

        public AddPilgrimsWithExcelCommandHandler(ICaravanPrincipalRepository caravanPrincipalRepository, IUnitOfWork unitOfWork)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<AddPilgrimsWithExcelCommandResponse> Handle(AddPilgrimsWithExcelCommand request, CancellationToken cancellationToken)
        {
            var caravan = await GetCaravan(request.CaravanId, cancellationToken);
            var pilgrims = await ExcelService.GenereateObjectFromExcelAsync<Pilgrim, ExcelCompanionAndPilgrimDto>(request.ExcelFile, (dto) => new Pilgrim
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
            CheckPilgrimsExistance(pilgrims, caravan);
            AddPilgrims(pilgrims, caravan);

            var savingResult = await _unitOfWork.Commit(cancellationToken);
            savingResult.ThrowIfNoChanges<NoChangesApplicationException>();

            return ResponseModel
                .Response()
                .WithResult(true);

        }
        #region Private Methods   
        private async Task<CaravanPrincipal> GetCaravan(Guid caravanId, CancellationToken ct)
        {
            var caravan = await _caravanPrincipalRepository.GetCaravanByIdAsync(caravanId, ct);
            if (caravan is null)
                throw new PrincipalNotFoundApplicationException();
            return caravan;
        }
        private void CheckPilgrimsExistance(List<Pilgrim> pilgrims, CaravanPrincipal caravan)
        {
            foreach (var pilgrim in pilgrims)
            {
                if (caravan.Pilgrims.Any(x => x.NationalCode == pilgrim.NationalCode))
                    throw new PilgrimExistException();
            }
        }
        private void AddPilgrims(List<Pilgrim> pilgrims, CaravanPrincipal caravan)
        {
            foreach (var pilgrim in pilgrims)
                caravan.AddPilgrim(pilgrim);
        }
        #endregion
    }
}
