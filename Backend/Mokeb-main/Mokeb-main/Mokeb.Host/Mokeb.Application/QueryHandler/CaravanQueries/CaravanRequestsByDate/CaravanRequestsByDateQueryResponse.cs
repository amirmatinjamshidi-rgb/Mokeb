using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.CaravanQueries.CaravanRequestsByDate
{
    public class CaravanRequestsByDateQueryResponse
    {
        public static CaravanRequestsByDateQueryResponse Response() => new();
        public CaravanRequestsByDateQueryResponse WithRequests(List<RequestDto> requests)
        {
            Requests = requests;
            return this;
        }
        public List<RequestDto> Requests { get; set; }
    }
}
