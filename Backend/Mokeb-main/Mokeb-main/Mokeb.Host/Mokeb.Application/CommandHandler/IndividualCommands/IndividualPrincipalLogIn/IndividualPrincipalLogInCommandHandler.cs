using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.Helper;
using Mokeb.Domain.Model.Entities;

namespace Mokeb.Application.CommandHandler.IndividualCommands.IndividualPrincipalLogIn
{
    public class IndividualPrincipalLogInCommandHandler : IRequestHandler<IndividualPrincipalLogInCommand, IndividualPrincipalLogInCommandResponse>
    {
        private readonly IIndividualRepository _individualRepository;
        private readonly IJwsService _jwsService;

        public IndividualPrincipalLogInCommandHandler(IIndividualRepository individualRepository, IJwsService jwsService)
        {
            _individualRepository = individualRepository;
            _jwsService = jwsService;
        }

        public async Task<IndividualPrincipalLogInCommandResponse> Handle(IndividualPrincipalLogInCommand request, CancellationToken cancellationToken)
        {
            var caravan = await GetIndividualPrincipal(request.Username, request.Password, cancellationToken);
            var jwsCode = await _jwsService.CreateJwsToken(caravan, cancellationToken);
            return IndividualPrincipalLogInCommandResponse.Response(jwsCode);
        }
        #region Private Methods
        private async Task<IndividualPrincipal> GetIndividualPrincipal(string username, string password, CancellationToken ct)
        {
            var result = await _individualRepository.GetIndividualByUsernameAsync(username, Hasher.HashData(password), ct);
            if (result is null)
                throw new UsernameOrPasswordIsWrongException();
            return result;
        }
        #endregion
    }
}
