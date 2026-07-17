namespace Mokeb.Application.Dtos
{
    public class OfficialsDto
    {
        public OfficialsDto(string name, string lastName, string phoneNumber, Guid id)
        {
            Name = name;
            LastName = lastName;
            PhoneNumber = phoneNumber;
            Id = id;
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
    }
}
