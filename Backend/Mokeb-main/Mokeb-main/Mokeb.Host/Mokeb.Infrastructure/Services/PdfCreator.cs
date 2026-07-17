using Microsoft.AspNetCore.Hosting;
using Mokeb.Application.Contracts;
using Mokeb.Domain.Model.Entities;
using Mokeb.Domain.Model.Enums;
using Mokeb.Domain.Model.ValueObjects;
using Stimulsoft.Report;

namespace Mokeb.Application.Services
{
    public class PdfCreator : IPdfCreator
    {
        private readonly IWebHostEnvironment _env;

        public PdfCreator(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<byte[]> CreateIndividualReport(Request request, CancellationToken ct)
        {
            var report2 = new StiReport();
            string reportPath = Path.Combine(_env.ContentRootPath, "ReportTemplate", "MokebIndividualReport2.mrt");
            report2.Load(reportPath);
            var references = report2.ReferencedAssemblies.ToList();
            string appAssemblyPath = typeof(RequestPdfDto).Assembly.Location;
            references.Add(appAssemblyPath);
            report2.ReferencedAssemblies = references.ToArray();
            var requestDto = request.ToRequestPdfDto();
            await report2.RegDataAsync("RequestInfo", new List<RequestPdfDto>() { requestDto });
            await report2.Dictionary.SynchronizeAsync();
            //report2.Save("D:\\MokebIndividualReport2.mrt");
            await report2.RenderAsync();
            using (var stream = new MemoryStream())
            {
                await report2.ExportDocumentAsync(StiExportFormat.Pdf, stream);
                return stream.ToArray();
            }
        }
    }
    public record TravelerPdfDto(string Name, string FamilyName, string PassportNumber, DateOnly DateOfBirth, string Gender);
    public record RequestRoomPdfDto(Guid Id, string Name);
    public record RequestPdfDto(DateTime EnterTime, DateTime ExitTime, IEnumerable<TravelerPdfDto> travelers, IEnumerable<RequestRoomPdfDto> requestRooms);

    public static class IEnumerableMapper
    {
        public static IEnumerable<TravelerPdfDto> ToTravelerPdfDto(this IEnumerable<Travelers> travelers)
        {
            var travelerDto = new List<TravelerPdfDto>();
            foreach (var traveler in travelers)
            {
                var newTravelerDto = new TravelerPdfDto(traveler.Name, traveler.FamilyName, traveler.PassportNumber, traveler.DateOfBirth, traveler.Gender == Gender.Male ? "آقا" : "خانوم");
                travelerDto.Add(newTravelerDto);
            }
            return travelerDto;
        }
        public static IEnumerable<RequestRoomPdfDto> ToRequestRoomDto(this IEnumerable<RequestRoom> requestRooms)
        {
            var requestRoomsDto = new List<RequestRoomPdfDto>();
            foreach (var room in requestRooms)
            {
                var newRequestRoom = new RequestRoomPdfDto(room.Id, room.Name);
                requestRoomsDto.Add(newRequestRoom);
            }
            return requestRoomsDto;
        }
        public static RequestPdfDto ToRequestPdfDto(this Request request)
        {
            return new RequestPdfDto(request.EnterTime, request.ExitTime, request.Travelers.ToTravelerPdfDto(), request.Rooms.ToRequestRoomDto());
        }
    }
}
