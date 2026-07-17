namespace Mokeb.Application.QueryHandler.AdminQueries.RequestedRequestsAtADayAmount
{
    public class RequestedRequestsAtADayAmountQueryResponse
    {
        public static RequestedRequestsAtADayAmountQueryResponse Response() => new();
        public RequestedRequestsAtADayAmountQueryResponse WithAmount(int amount)
        {
            Amount = amount;
            return this;
        }
        public int Amount { get; set; }
    }
}
