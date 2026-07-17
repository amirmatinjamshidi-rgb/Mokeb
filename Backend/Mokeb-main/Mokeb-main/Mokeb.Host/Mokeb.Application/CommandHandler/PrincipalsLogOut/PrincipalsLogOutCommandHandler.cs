using MediatR;
using Microsoft.AspNetCore.Http;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;

namespace Mokeb.Application.CommandHandler.PrincipalsLogOut
{
    public class PrincipalsLogOutCommandHandler : IRequestHandler<PrincipalsLogOutCommand, PrincipalsLogOutCommandResponse>
    {
        private readonly IHttpContextAccessor _requestContext;
        private readonly IJwsService _jwsService;

        public PrincipalsLogOutCommandHandler(IHttpContextAccessor requestContext, IJwsService jwsService)
        {
            _requestContext = requestContext;
            _jwsService = jwsService;
        }

        public async Task<PrincipalsLogOutCommandResponse> Handle(PrincipalsLogOutCommand request, CancellationToken cancellationToken)
        {
            await _jwsService.DeleteJwsTokenAsync(request.Id, GetJwsCodeFromHttpContext(_requestContext.HttpContext));
            return PrincipalsLogOutCommandResponse.Succeeded;
        }
        #region Private Methods
        private string GetJwsCodeFromHttpContext(HttpContext httpContext)
        {
            var authorizationHeader = httpContext.Request.Headers["Authorization"].FirstOrDefault();
            if (string.IsNullOrEmpty(authorizationHeader))
                throw new AuthorizationHeaderNotFoundException();
            var jws = authorizationHeader.Split(" ").Last();
            if (string.IsNullOrWhiteSpace(jws))
                throw new YouAreNotLoggedInException();
            return jws;
        }
        #endregion
    }
}
