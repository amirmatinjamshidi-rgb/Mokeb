using Mokeb.Application.Dtos;
using Mokeb.Domain.Model.Base;
using Mokeb.Domain.Model.Entities;

namespace Mokeb.Application.QueryHandler.AdminQueries
{
    public static class ResponseMapper
    {
        public static List<GettingIncomingOrAcceptedRequestsResponseDto> ToGettingAcceptedRequestResponseDto(this List<Request> requests)
        {
            var result = new List<GettingIncomingOrAcceptedRequestsResponseDto>();
            foreach (var request in requests)
            {
                result.Add(new GettingIncomingOrAcceptedRequestsResponseDto(request.Travelers.First().Name + " " + request.Travelers.First().FamilyName,
                   request.MaleCount, request.FemaleCount, DateOnly.FromDateTime(request.ExitTime), request.Travelers, request.Id));
            }
            return result;
        }
        public static List<GettingOutGoingOrAcceptedRequestsResponseDto> ToGettingOutGoingOrAcceptedRequestResponseDto(this List<Request> requests)
        {
            var result = new List<GettingOutGoingOrAcceptedRequestsResponseDto>();
            foreach (var request in requests)
            {
                result.Add(new GettingOutGoingOrAcceptedRequestsResponseDto(request.Travelers.First().Name + " " + request.Travelers.First().FamilyName,
                   request.MaleCount, request.FemaleCount, DateOnly.FromDateTime(request.EnterTime), request.Travelers, request.Id));
            }
            return result;
        }
        public static PrincipalDto ToPrincipalDto(this Principal principal)
        {
            return new PrincipalDto(principal.Name, principal.FamilyName, principal.NationalCode, principal.PassportNumber
                                    , principal.DateOfBirth, principal.Gender, principal.ContactInformation.Gmail
                                    , principal.ContactInformation.PhoneNumber, principal.ContactInformation.EmergencyPhoneNumber, principal.Id);
        }
        public static List<RequestedRequestsDto> ToRequestedRequestsDto(this List<Request> requests)
        {
            var result = new List<RequestedRequestsDto>();
            foreach (var request in requests)
            {
                result.Add(new RequestedRequestsDto
                    (
                        request.Travelers.First().Name,
                        request.Travelers.First().FamilyName,
                        request.Travelers.First().PhoneNumber,
                        request.MaleCount,
                        request.FemaleCount,
                        DateOnly.FromDateTime(request.EnterTime),
                        DateOnly.FromDateTime(request.ExitTime),
                        request.Id,
                        request.State
                    ));
            }
            return result;
        }
        public static List<RequestDto> ToRequestDto(this IEnumerable<Request> requests)
        {
            var requestsDto = new List<RequestDto>();
            foreach (var request in requests)
            {
                var newRequest = new RequestDto(
                    request.Id,
                    DateOnly.FromDateTime(request.EnterTime),
                    DateOnly.FromDateTime(request.ExitTime),
                    request.Travelers.Count(),
                    (int)request.MaleCount,
                    (int)request.FemaleCount,
                    request.State,
                    request.Travelers);
                requestsDto.Add(newRequest);
            }
            return requestsDto;
        }
        public static List<AcceptedRequestDto> ToAcceptedRequestDto(this List<Request> requests)
        {
            var requestsDto = new List<AcceptedRequestDto>();
            foreach (var request in requests)
            {
                var newRequest = new AcceptedRequestDto(request.Id, DateOnly.FromDateTime(request.EnterTime), DateOnly.FromDateTime(request.ExitTime), request.State);
                requestsDto.Add(newRequest);
            }
            return requestsDto;
        }
    }
}
