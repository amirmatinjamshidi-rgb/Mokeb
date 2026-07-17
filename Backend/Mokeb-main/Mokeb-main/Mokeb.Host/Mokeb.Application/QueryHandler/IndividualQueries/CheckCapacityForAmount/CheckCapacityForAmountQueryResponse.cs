namespace Mokeb.Application.QueryHandler.IndividualQueries.CheckCapacityForAmount
{
    public class CheckCapacityForAmountQueryResponse
    {
        public static CheckCapacityForAmountQueryResponse Response() => new();
        public CheckCapacityForAmountQueryResponse WithResult(bool result)
        {
            Result = result;
            return this;
        }
        public bool Result { get; set; }
    }
}
