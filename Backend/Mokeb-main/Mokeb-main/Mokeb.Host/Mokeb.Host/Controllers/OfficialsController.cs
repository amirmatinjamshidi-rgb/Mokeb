using MediatR;
using Microsoft.AspNetCore.Mvc;
using Mokeb.Application.CommandHandler.OfficialsCommands.AddOfficials;
using Mokeb.Application.CommandHandler.OfficialsCommands.EditOfficials;
using Mokeb.Application.CommandHandler.OfficialsCommands.RemoveOfficials;
using Mokeb.Application.QueryHandler.AdminQueries.ManagingOfficials.GetAllOfficials;

namespace Mokeb.Host.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OfficialsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public OfficialsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> AddOfficials([FromBody] AddOfficialsCommand command, CancellationToken ct)
        {
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (result.Result)
                return Ok("مسعول اضافه شد");
            return BadRequest("مسعول اضافه نشد");
        }
        [HttpDelete("{officialId}")]
        public async Task<IActionResult> RemoveOfficial([FromRoute] Guid officialId, RemoveOfficialsCommand command, CancellationToken ct)
        {
            command.OfficialId = officialId;
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (result.Result)
                return Ok("مسعول حذف شد");
            return BadRequest("مسعول حذف نشد");
        }
        [HttpGet]
        public async Task<IActionResult> GetAllOfficials(CancellationToken ct)
        {
            var query = new GetAllOfficialsQuery();
            var result = await _mediator.Send(query, ct);
            return Ok(result.Officials);
        }
        [HttpPut("{officialId}")]
        public async Task<IActionResult> UpdateOfficial([FromRoute] Guid officialId, [FromBody] EditOfficialsCommand command, CancellationToken ct)
        {
            command.Id = officialId;
            var result = await _mediator.Send(command, ct);
            if (result.Result)
                return Ok("مسعول با موفقیت بروز شد");
            return BadRequest("مسعول بروز نشد");
        }

    }
}
