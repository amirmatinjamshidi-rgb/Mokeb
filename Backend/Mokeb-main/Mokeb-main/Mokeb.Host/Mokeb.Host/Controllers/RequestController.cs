using MediatR;
using Microsoft.AspNetCore.Mvc;
using Mokeb.Application.CommandHandler.AdminCommands.AcceptingARequestedRequest;
using Mokeb.Application.CommandHandler.AdminCommands.ChangingEntranceDateOfACaravan;
using Mokeb.Application.CommandHandler.AdminCommands.ChangingExitDateOfAPrincipal;
using Mokeb.Application.CommandHandler.AdminCommands.IncreasingRequestsNumberOfPeople;
using Mokeb.Application.CommandHandler.AdminCommands.RejectingARequestedRequest;
using Mokeb.Application.QueryHandler.AdminQueries.AllTravelersGenderStaticsInAYear;
using Mokeb.Application.QueryHandler.AdminQueries.BiennialBookingStats;
using Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.GettingIncomingOrAcceptedRequestByDate;
using Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.GettingOutGoingOrAcceptedRequestsByDate;
using Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.SearchForEnteredOrDelayInEntrance;
using Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.SearchForExitedOrDelayInExited;
using Mokeb.Application.QueryHandler.AdminQueries.ManagingRequestedRequests.LookingOnRequestedRequests;
using Mokeb.Application.QueryHandler.AdminQueries.RequestedRequestsAtADayAmount;
using Mokeb.Application.QueryHandler.IndividualQueries.CreateRequestPdf;

namespace Mokeb.Host.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RequestController : ControllerBase
    {
        private readonly IMediator _mediator;

        public RequestController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("/IncomingOrAccepted/{date}")]
        public async Task<IActionResult> GettingRequests([FromRoute] DateOnly date, CancellationToken ct)
        {
            var query = new GettingIncomingOrAcceptedRequestByDateQuery();
            query.Date = date;
            query.Validate();
            var result = await _mediator.Send(query, ct);
            return Ok(result.Response);
        }
        [HttpGet("/OutgoingOrAccepted/{date}")]
        public async Task<IActionResult> GettingOutGoingOrAcceptedRequests([FromRoute] DateOnly date, CancellationToken ct)
        {
            var query = new GettingOutGoingOrAcceptedRequestsByDateQuery();
            query.Date = date;
            query.Validate();
            var result = await _mediator.Send(query, ct);
            return Ok(result.Response);
        }
        [HttpPut("/{requestId}/RoomAvailabilities/{roomAvailabilityId}/AddRoomAvailability")]
        public async Task<IActionResult> AddRoomAvailabilityToAnAcceptedOrEnteredRequest([FromRoute] Guid requestId, [FromRoute] Guid roomAvailabilityId,
                                                                            [FromBody] AddingRoomAvailabilityToAnAcceptedRequestCommand command, CancellationToken ct)
        {
            command.RequestId = requestId;
            command.RoomAvailabilityId = roomAvailabilityId;
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (result.Success)
                return Ok("RoomAvailability Added Successfully");
            return BadRequest("RoomAvailability didn't Add Successfully");
        }
        [HttpPut("/{requestId}/ChangingDateOfEntrance")]
        public async Task<IActionResult> ChangingDateOfEntrance([FromRoute] Guid requestId,
                                                                                    [FromBody] ChangingEntranceDateOfAPrincipalCommand command, CancellationToken ct)
        {
            command.RequestId = requestId;
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (result.Success)
                return Ok("DateOfEntrance Changed Successfully");
            return BadRequest("DateOfEntrance Didn't change");
        }
        [HttpPut("/{requestId}/ChangingExitDate")]
        public async Task<IActionResult> ChangingExitDate([FromRoute] Guid requestId,
                                                                                    [FromBody] ChangingExitDateOfAPrincipalCommand command, CancellationToken ct)
        {
            command.RequestId = requestId;
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (result.Success)
                return Ok("ExitDate Changed Successfully");
            return BadRequest("ExitDate Didn't change");
        }
        [HttpGet("IncomingOrAccepted/{date}/Search/{input}")]
        public async Task<IActionResult> SearchForIncomingOrAccepted([FromRoute] string input, [FromRoute] DateOnly date, CancellationToken ct)
        {
            var query = new SearchForEnteredOrDelayInEntranceQuery();
            query.Input = input;
            query.Date = date;
            query.Validate();
            var result = await _mediator.Send(query, ct);
            return Ok(result.Response);
        }
        [HttpGet("OutgoingOrAccepted/{date}/Search/{input}")]
        public async Task<IActionResult> SearchForOutgoingOrAccepted([FromRoute] string input, [FromRoute] DateOnly date, CancellationToken ct)
        {
            var query = new SearchForExitedOrDelayInExitedQuery();
            query.Input = input;
            query.Date = date;
            query.Validate();
            var result = await _mediator.Send(query, ct);
            return Ok(result.Response);
        }
        [HttpGet("RequestedRequests/{entranceDate}")]
        public async Task<IActionResult> GetRequestedRequests([FromRoute] DateOnly entranceDate, CancellationToken ct)
        {
            var query = new LookingOnRequestedRequestsQuery();
            query.EntranceDate = entranceDate;
            var result = await _mediator.Send(query, ct);
            return Ok(result.Requests);
        }
        [HttpPut("{requestId}/AcceptRequest")]
        public async Task<IActionResult> AcceptRequest([FromRoute] Guid requestId, AcceptingARequestedRequestCommand command, CancellationToken ct)
        {
            command.RequestId = requestId;
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (result.Success)
                return Ok("درخواست قبول شد");
            return BadRequest("درخواست قبول نشد");
        }
        [HttpPut("{requestId}/RejectRequest")]
        public async Task<IActionResult> RejectRequest([FromRoute] Guid requestId, RejectingARequestedRequestCommand command, CancellationToken ct)
        {
            command.RequestId = requestId;
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (result.Result)
                return Ok("درخواست رد شد");
            return BadRequest("درخواست رد نشد");
        }
        [HttpPost("GenderStatsInAYear")]
        public async Task<IActionResult> GetGenderStatsInAYear([FromBody] AllTravelersGenderStaticsInAYearQuery query, CancellationToken ct)
        {
            query.Validate();
            var result = await _mediator.Send(query, ct);
            return Ok(result.Stats);
        }
        [HttpPost("RequestsTypeStats")]
        public async Task<IActionResult> GetRequestsTypeStats([FromBody] BiennialBookingStatsQuery query, CancellationToken ct)
        {
            query.Validate();
            var result = await _mediator.Send(query, ct);
            return Ok(result.Stats);
        }
        [HttpGet("{date}/RequestedRequestsAmount")]
        public async Task<IActionResult> GetRequestedRequestsAmount([FromRoute] DateOnly date, CancellationToken ct)
        {
            var query = new RequestedRequestsAtADayAmountQuery();
            query.Date = date;
            query.Validate();
            var result = await _mediator.Send(query, ct);
            return Ok(result.Amount);
        }
        [HttpGet("{requestId}/DownloadIndividualRequestPdf")]
        public async Task<IActionResult> DownloadIndividualRequestPdf([FromRoute] Guid requestId, CancellationToken ct)
        {
            var query = new CreateRequestPdfQuery();
            query.RequestId = requestId;
            query.Validate();
            var result = await _mediator.Send(query, ct);
            return File(result.StreamArray, "application/pdf");
        }
    }
}
