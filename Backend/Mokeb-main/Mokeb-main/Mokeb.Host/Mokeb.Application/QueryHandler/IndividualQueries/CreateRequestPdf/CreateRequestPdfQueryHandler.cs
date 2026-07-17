using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Domain.Model.Entities;
using ResponseModel = Mokeb.Application.QueryHandler.IndividualQueries.CreateRequestPdf.CreateRequestPdfQueryResponse;
namespace Mokeb.Application.QueryHandler.IndividualQueries.CreateRequestPdf
{
    public class CreateRequestPdfQueryHandler : IRequestHandler<CreateRequestPdfQuery, CreateRequestPdfQueryResponse>
    {
        private readonly IIndividualRepository _individualRepository;
        private readonly IPdfCreator _pdfCreator;

        public CreateRequestPdfQueryHandler(IIndividualRepository individualRepository, IPdfCreator pdfCreator)
        {
            _individualRepository = individualRepository;
            _pdfCreator = pdfCreator;
        }

        public async Task<CreateRequestPdfQueryResponse> Handle(CreateRequestPdfQuery query, CancellationToken ct)
        {
            var request = await GetRequest(query.RequestId, ct);
            var pdfStream = await _pdfCreator.CreateIndividualReport(request, ct);
            return ResponseModel
                .Response()
                .WithStream(pdfStream);
        }
        #region Private Methods
        private async Task<Request> GetRequest(Guid requestId, CancellationToken ct)
        {
            var request = await _individualRepository.GetRequestByIdAsync(requestId, ct);
            if (request is null)
                throw new RequestNotFoundException();
            return request;
        }
        #endregion
    }
}
