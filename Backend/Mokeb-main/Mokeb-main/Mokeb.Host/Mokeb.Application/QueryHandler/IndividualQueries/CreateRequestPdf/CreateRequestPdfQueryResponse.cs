namespace Mokeb.Application.QueryHandler.IndividualQueries.CreateRequestPdf
{
    public class CreateRequestPdfQueryResponse
    {
        public static CreateRequestPdfQueryResponse Response() => new();
        public CreateRequestPdfQueryResponse WithStream(Byte[] array)
        {
            StreamArray = array;
            return this;
        }
        public byte[] StreamArray { get; set; }
    }
}
