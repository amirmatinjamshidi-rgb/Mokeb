using MediatR;
using Microsoft.AspNetCore.Mvc;
using Mokeb.Application.CommandHandler.AdminCommands.AddFAQ;
using Mokeb.Application.CommandHandler.AdminCommands.EditFAQ;
using Mokeb.Application.QueryHandler.AdminQueries.ManagingFAQs.GetAllFAQs;

namespace Mokeb.Host.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FAQController : ControllerBase
    {
        private readonly IMediator _mediator;

        public FAQController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpPost]
        public async Task<IActionResult> AddFAQ([FromBody] AddFAQCommand command, CancellationToken ct)
        {
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (result.Result)
                return Ok("سوال اضافه شد");
            return BadRequest("سوال اضافه نشد");
        }
        [HttpGet]
        public async Task<IActionResult> GetFAQs(CancellationToken ct)
        {
            var query = new GetAllFAQsQuery();
            query.Validate();
            var result = await _mediator.Send(query, ct);
            return Ok(result.Faqs);
        }
        [HttpPut("{faqId}")]
        public async Task<IActionResult> UpdateFaq([FromRoute] Guid faqId, [FromBody] EditFAQCommand command, CancellationToken ct)
        {
            command.FaqId = faqId;
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (result.Success)
                return Ok("سوال تغییر کرد");
            return BadRequest("سوال تغییر نکرد");
        }
    }
}
