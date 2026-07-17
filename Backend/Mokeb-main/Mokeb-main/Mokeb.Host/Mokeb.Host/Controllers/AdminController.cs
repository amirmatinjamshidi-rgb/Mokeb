using MediatR;
using Microsoft.AspNetCore.Mvc;
using Mokeb.Application.CommandHandler.AdminCommands.AcceptingARequestedRequest;
using Mokeb.Application.CommandHandler.AdminCommands.ActivingPrincipal;
using Mokeb.Application.CommandHandler.AdminCommands.AdminLogIn;
using Mokeb.Application.CommandHandler.PrincipalsLogOut;

namespace Mokeb.Host.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AdminController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> LogInAdmin([FromBody] AdminLogInCommand command, CancellationToken ct)
        {
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (!string.IsNullOrEmpty(result.JwsCode))
                return Ok(result.JwsCode);
            return BadRequest("You are Not LoggedIn");
        }

        [HttpPost("{adminId}/LogOut")]
        public async Task<IActionResult> Logout([FromRoute] Guid adminId, [FromBody] PrincipalsLogOutCommand command, CancellationToken ct)
        {
            command.Id = adminId;
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (result.Success)
                return Ok("You are logged out successfully");
            return BadRequest("You are not logged out");
        }
    }
}
