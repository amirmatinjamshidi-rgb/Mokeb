using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.Helper;
using Mokeb.Domain.Model.Entities;

namespace Mokeb.Application.CommandHandler.AdminCommands.AdminLogIn
{
    public class AdminLogInCommandHandler : IRequestHandler<AdminLogInCommand, AdminLogInCommandResponse>
    {
        private readonly IAdminRepository _adminRepository;
        private readonly IJwsService _jwsService;
        public AdminLogInCommandHandler(IAdminRepository adminRepository, IJwsService jwsService)
        {
            _adminRepository = adminRepository;
            _jwsService = jwsService;
        }

        public async Task<AdminLogInCommandResponse> Handle(AdminLogInCommand request, CancellationToken cancellationToken)
        {
            var admin = await GetAdmin(request.Username, request.Password, cancellationToken);
            var jwsCode = await _jwsService.CreateJwsTokenForAdmin(admin, cancellationToken);
            return AdminLogInCommandResponse.Response(jwsCode);
        }
        #region Private Methods
        private async Task<Admin> GetAdmin(string username, string password, CancellationToken ct)
        {
            var result = await _adminRepository.GetAdminAsync(username, Hasher.HashData(password), ct);
            if (result is null)
                throw new UsernameOrPasswordIsWrongException();
            return result;
        }
        #endregion
    }
}
