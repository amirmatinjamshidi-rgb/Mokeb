using ClosedXML.Excel;
using Microsoft.AspNetCore.Http;

namespace Mokeb.Application.Services
{
    public class ExcelService
    {
        public static async Task<List<TOut>> GenereateObjectFromExcelAsync<TOut, TField>(IFormFile file, Func<TField, TOut> mapper, CancellationToken ct)
            where TOut : class
            where TField : class, new()
        {
            var result = new List<TOut>();
            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                stream.Position = 0;

                var fieldObjectType = typeof(TField);
                var properties = fieldObjectType.GetProperties();

                using (var wb = new XLWorkbook(stream))
                {
                    var workSheet = wb.Worksheet(1);
                    //var workSheetColumns = workSheet.ColumnCount();
                    var rows = workSheet.RowsUsed();
                    foreach (var row in rows)
                    {
                        var fieldInstance = new TField();
                        for (int i = 0; i < properties.Length; i++)
                        {
                            var property = properties[i];
                            var cell = row.Cell(i + 1);
                            var value = GetCellValueOfType(cell, property.PropertyType);
                            property.SetValue(fieldInstance, value);
                        }

                        result.Add(mapper(fieldInstance));
                    }
                }
            }
            return result;
        }
        private static object? GetCellValueOfType(IXLCell cell, Type type)
        {
            if (cell.IsEmpty())
                return null;
            var underlyingType = Nullable.GetUnderlyingType(type) ?? type;
            //if (underlyingType == typeof(DateOnly))
            //    return DateOnly.FromDateTime(cell.GetDateTime());
            if (underlyingType == typeof(bool))
                return cell.GetBoolean();
            var stringValue = cell.GetValue<string>();
            return Convert.ChangeType(stringValue, underlyingType);
        }
    }
}
