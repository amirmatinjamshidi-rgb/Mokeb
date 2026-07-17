using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.IndividualQueries.CreateRequestPdf
{
    public class CreateRequestPdfQuery : QueryBase, IRequest<CreateRequestPdfQueryResponse>
    {
        public Guid RequestId { get; set; }
        public override void Validate()
        {
            new CreateRequestPdfQueryValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
