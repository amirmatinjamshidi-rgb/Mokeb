using MediatR;
using Microsoft.AspNetCore.Mvc;
using Mokeb.Application.CommandHandler.AdminCommands.AddingRoom;
using Mokeb.Application.CommandHandler.AdminCommands.AddingRoomAvailability;
using Mokeb.Application.CommandHandler.AdminCommands.RemovingRoom;
using Mokeb.Application.CommandHandler.AdminCommands.RemovingRoomAvailability;
using Mokeb.Application.QueryHandler.AdminQueries.GetAllRooms;
using Mokeb.Application.QueryHandler.AdminQueries.GetRoomAvailabilitiesInADate;
using Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.CapacityReportByDate;
using Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.LookingOnRoomAvailabilitiesOnARangeOfDates;
using Mokeb.Application.QueryHandler.AdminQueries.ManagingRequestedRequests.GettingRoomAvailabilitiesOnADateRange;

namespace Mokeb.Host.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RoomController : ControllerBase
    {
        private readonly IMediator _mediator;

        public RoomController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllRooms(CancellationToken ct)
        {
            var query = new GetAllRoomsQuery();
            query.Validate();
            var result = await _mediator.Send(query, ct);
            return Ok(result.Rooms);
        }

        [HttpPost]
        public async Task<IActionResult> AddRoom([FromBody] AddingRoomCommand command, CancellationToken ct)
        {
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (result.Success)
                return Ok(new { id = result.Id, roomId = result.RoomId, message = "Room Added Successfully" });
            return BadRequest("Room Didn't add");
        }

        [HttpDelete("{roomId}")]
        public async Task<IActionResult> RemoveRoom([FromRoute] Guid roomId, [FromBody] RemovingRoomCommand command, CancellationToken ct)
        {
            command.roomId = roomId;
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (result.Success)
                return Ok("Room Removed Successfully");
            return BadRequest("Room Didn't Remove");
        }

        [HttpPost("{roomId}/RoomAvailability")]
        public async Task<IActionResult> AddRoomAvailability([FromRoute] Guid roomId, [FromBody] AddingRoomAvailabilityCommand command, CancellationToken ct)
        {
            command.roomId = roomId;
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (result.Success)
                return Ok("RoomAvailability Added Successfully");
            return BadRequest("RoomAvailability Didn't add");
        }

        [HttpPut("{roomId}/{roomAvailabilityId}/ChangeDate")]
        public async Task<IActionResult> ChangeDateOfAvailableRoom([FromRoute] Guid roomId, [FromRoute] Guid roomAvailabilityId, [FromBody] UpdatingRoomAvailabilityDateCommand command, CancellationToken ct)
        {
            command.AvailabilityId = roomAvailabilityId;
            command.Validate();
            var result = await _mediator.Send(command, ct);
            if (result.Success)
                return Ok("Date Changed Successfully");
            return BadRequest("Date Didn't change");
        }

        [HttpGet("{date}/ReportStats")]
        public async Task<IActionResult> GettingStats([FromRoute] DateOnly date, CancellationToken ct)
        {
            var query = new CapacityReportByDateQuery();
            query.Date = date;
            query.Validate();
            var result = await _mediator.Send(query, ct);
            return Ok(result);
        }

        [HttpGet("RoomAvailabilities/{requestId}/DistinctRoomAvailabilities")]
        public async Task<IActionResult> LookingDistinctOnRoomAvailabilitiesToAddInRequest([FromRoute] Guid requestId, CancellationToken ct)
        {
            var query = new LookingOnRoomAvailabilitiesOnARangeOfDatesQuery();
            query.RequestId = requestId;
            query.Validate();
            var result = await _mediator.Send(query, ct);
            return Ok(result);
        }

        [HttpGet("RoomAvailabilities/{enterDate}/{exitDate}")]
        public async Task<IActionResult> GettingRoomAvailabilitiesOnARange([FromRoute] DateOnly enterDate, [FromRoute] DateOnly exitDate, CancellationToken ct)
        {
            var query = new GettingRoomAvailabilitiesOnADateRangeQuery();
            query.EnterTime = enterDate;
            query.ExitTime = exitDate;
            query.Validate();
            var result = await _mediator.Send(query, ct);
            return Ok(result);
        }

        [HttpGet("RoomAvailabilities/{date}")]
        public async Task<IActionResult> GetAvailableRoomAtDate([FromRoute] DateOnly date, CancellationToken ct)
        {
            var query = new GetRoomAvailabilitiesInADateQuery { Date = date };
            query.Validate();
            var result = await _mediator.Send(query, ct);
            return Ok(result.RoomAvailabilities);
        }
    }
}
