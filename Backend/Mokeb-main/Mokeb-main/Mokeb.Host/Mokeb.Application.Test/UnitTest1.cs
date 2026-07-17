using Mokeb.Application.Test.Constants;
using Mokeb.Domain.Model.Entities;

namespace Mokeb.Application.Test
{
    public class UnitTest1
    {
        [Fact]
        [InlineData(10, 0, 30)]
        public void Decrease_Capacity_Of_One_Room()
        {
            // Arrange
            var roomAvailabilities = new List<RoomAvailability>
            {
                new RoomAvailability(DateTimeConstants.Today, 30),
                new RoomAvailability(DateTimeConstants.Tommorow, 30),
                new RoomAvailability(DateTimeConstants.NDaysAfter(2), 30),
            };

            var maleCount = 10;
            var femaleCount = 10;

            // Act

            // Assert
        }
    }
}
