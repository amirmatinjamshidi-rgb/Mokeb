using MediatR;
using Microsoft.AspNetCore.Mvc;
using Mokeb.Application.CommandHandler.AdminCommands.ActivingPrincipal;
using Mokeb.Application.CommandHandler.AdminCommands.ChangingIndividualPrincipalInformation;
using Mokeb.Application.CommandHandler.AdminCommands.DeleteIndividual;
using Mokeb.Application.CommandHandler.IndividualCommands.AddCompanion;
using Mokeb.Application.CommandHandler.IndividualCommands.AddCompanionsWithExcel;
using Mokeb.Application.CommandHandler.IndividualCommands.IndividualPrincipalLogIn;
using Mokeb.Application.CommandHandler.IndividualCommands.IndividualPrincipalSignIn;
using Mokeb.Application.CommandHandler.IndividualCommands.RemoveCompanion;
using Mokeb.Application.CommandHandler.IndividualCommands.ReserveRoom;
using Mokeb.Application.CommandHandler.PrincipalsChangePassword;
using Mokeb.Application.CommandHandler.PrincipalsLogOut;
using Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.GettingPrincipalInformation;
using Mokeb.Application.QueryHandler.AdminQueries.ManagingIndividuals.LookingOnIndividuals;
using Mokeb.Application.QueryHandler.AdminQueries.ManagingIndividuals.SearchInIndividuals;
using Mokeb.Application.QueryHandler.IndividualQueries.CheckCapacityForAmount;
using Mokeb.Application.QueryHandler.IndividualQueries.GetCompanions;
using Mokeb.Application.QueryHandler.IndividualQueries.IndividualRequests;
using Mokeb.Application.QueryHandler.IndividualQueries.SearchInIndividualCompanions;
using Mokeb.Application.QueryHandler.IndividualQueries.SearchInIndividualRequests;

namespace Mokeb.Host.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class IndividualController : ControllerBase
    {
        private readonly IMediator _mediator;

        public IndividualController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("SignIn")]
        public async Task<IActionResult> AddIndividual([FromBody] IndividualPrincipalSignInCommand command, CancellationToken ct)
        {
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (result.Success)
                return Ok("Individual Added Successfully");
            return BadRequest("Something Went Wrong");
        }
        [HttpPost("LogIn")]
        public async Task<IActionResult> LogInIndividual([FromBody] IndividualPrincipalLogInCommand command, CancellationToken ct)
        {
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (!string.IsNullOrEmpty(result.JwsCode))
                return Ok(result.JwsCode);
            return BadRequest("You are Not LoggedIn");
        }
        [HttpPost("{individualId}/LogOut")]
        public async Task<IActionResult> Logout([FromRoute] Guid individualId, [FromBody] PrincipalsLogOutCommand command, CancellationToken ct)
        {
            command.Id = individualId;
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (result.Success)
                return Ok("You are logged out successfully");
            return BadRequest("You are not logged out");
        }
        [HttpGet("{individualId}")]
        public async Task<IActionResult> GettingIndividualInformation([FromRoute] Guid individualId, CancellationToken ct)
        {
            var query = new GettingPrincipalInformationQuery();
            query.PrincipalId = individualId;
            query.Validate();
            var result = await _mediator.Send(query, ct);
            return Ok(result.Principal);
        }
        [HttpPut("{individualId}/ActivateOrDeactivatePrincipal")]
        public async Task<IActionResult> ActivateOrDeactivatePrincipal([FromRoute] Guid individualId, [FromBody] ActivingOrDeActivingPrincipalCommand command, CancellationToken ct)
        {
            command.PrincipalId = individualId;
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (result.Result)
                return Ok("درخواست با موفقیت انحام یافت");
            return BadRequest("درخواست انجام نشد");
        }
        [HttpGet]
        public async Task<IActionResult> GetIndividuals(CancellationToken ct)
        {
            var query = new LookingOnIndividualsQuery();
            var result = await _mediator.Send(query, ct);
            return Ok(result);
        }
        [HttpPut("{individualId}/ChangePrincipal")]
        public async Task<IActionResult> ChangingIndividualPrincipal([FromRoute] Guid individualId, [FromBody] ChangingIndividualPrincipalInformationCommand command, CancellationToken ct)
        {
            command.IndividualId = individualId;
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (result.Result)
                return Ok("شخص حقیقی تغییر کرد");
            return BadRequest("شخص حقیقی تغییر نکرد");
        }
        [HttpDelete("{individualId}")]
        public async Task<IActionResult> DeletingIndividual([FromRoute] Guid individualId, [FromBody] DeleteIndividualCommand command, CancellationToken ct)
        {
            command.IndividualId = individualId;
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (result.Success)
                return Ok("شخص با موفقیت حذف شد");
            return BadRequest("شخص حذف نشد");
        }
        [HttpPost("Search")]
        public async Task<IActionResult> SearchInIndividuals([FromBody] SearchInIndividualsQuery query, CancellationToken ct)
        {
            query.Validate();
            var result = await _mediator.Send(query, ct);
            return Ok(result.IndividualPrincipals);
        }
        [HttpPost("{individualId}/CheckCapacity")]
        public async Task<IActionResult> CheckCapacity([FromRoute] Guid individualId, [FromBody] CheckCapacityForAmountQuery query, CancellationToken ct)
        {
            query.IndividualId = individualId;
            query.Validate();
            var result = await _mediator.Send(query, ct);
            return Ok(result.Result);
        }
        [HttpPost("{individualId}/Reserve")]
        public async Task<IActionResult> Reserve([FromRoute] Guid individualId, [FromBody] ReserveRoomCommand command, CancellationToken ct)
        {
            command.IndividualId = individualId;
            var result = await _mediator.Send(command, ct);
            return Ok(result);
        }
        [HttpGet("{individualId}/Requests")]
        public async Task<IActionResult> GetRequests([FromRoute] Guid individualId, CancellationToken ct)
        {
            var query = new IndividualRequestsQuery();
            query.IndividualId = individualId;
            query.Validate();
            var result = await _mediator.Send(query, ct);
            return Ok(result.Requests);
        }
        [HttpGet("{individualId}/Requests/{date}")]
        public async Task<IActionResult> GetRequestsByDate([FromRoute] Guid individualId, [FromRoute] DateOnly date, CancellationToken ct)
        {
            var query = new SearchInIndividualRequestsQuery();
            query.IndividualId = individualId;
            query.Date = date;
            query.Validate();
            var result = await _mediator.Send(query, ct);
            return Ok(result.Requests);
        }
        [HttpPost("{individualId}/Companions")]
        public async Task<IActionResult> AddCompanion([FromRoute] Guid individualId, [FromBody] AddCompanionCommand command, CancellationToken ct)
        {
            command.IndividualId = individualId;
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (result.Result)
                return Ok("همسفر با موفقیت اضافه شد");
            return BadRequest("همسفر ایجاد نشد");
        }
        [HttpDelete("{individualId}/Companions/{companionId}")]
        public async Task<IActionResult> RemoveCompanion([FromRoute] Guid individualId, [FromRoute] Guid companionId, [FromBody] RemoveCompanionCommand command, CancellationToken ct)
        {
            command.IndividualId = individualId;
            command.CompanionId = companionId;
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (result.Result)
                return Ok("همسفر با موفقیت حذف شد");
            return BadRequest("همسفر حذف نشد");
        }
        [HttpGet("{individualId}/Companions")]
        public async Task<IActionResult> GetCompanions([FromRoute] Guid individualId, CancellationToken ct)
        {
            var query = new GetCompanionsQuery();
            query.IndividualId = individualId;
            var result = await _mediator.Send(query, ct);
            return Ok(result.Companions);
        }
        [HttpGet("{individualId}/Companions/Search")]
        public async Task<IActionResult> GetCompanions([FromRoute] Guid individualId, [FromQuery] string input, CancellationToken ct)
        {
            var query = new SearchInIndividualCompanionsQuery();
            query.Input = input;
            query.IndividualId = individualId;
            var result = await _mediator.Send(query, ct);
            return Ok(result.Companions);
        }
        [HttpPost("{individualId}/Companions/File")]
        public async Task<IActionResult> AddCompanion([FromRoute] Guid individualId, [FromForm] AddCompanionsWithExcelCommand command, CancellationToken ct)
        {
            command.IndividualId = individualId;
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (result.Result)
                return Ok("همسفر با موفقیت اضافه شد");
            return BadRequest("همسفر ایجاد نشد");
        }
        [HttpPut("{individualId}/Password")]
        public async Task<IActionResult> ChangePassword([FromRoute] Guid individualId, [FromBody] PrincipalsChangePasswordCommand command, CancellationToken ct)
        {
            command.Id = individualId;
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (result.Result)
                return Ok("رمز با موفقیت تغییر کرد");
            return BadRequest("رمز تغییر نکرد");
        }
    }
}
