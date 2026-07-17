using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingFAQs.GetAllFAQs
{
    public class GetAllFAQsQueryResponse
    {
        public static GetAllFAQsQueryResponse Response() => new();
        public GetAllFAQsQueryResponse WithFaqs(List<FAQDto> faqs)
        {
            Faqs = faqs;
            return this;
        }
        public List<FAQDto> Faqs { get; set; }
    }
}
