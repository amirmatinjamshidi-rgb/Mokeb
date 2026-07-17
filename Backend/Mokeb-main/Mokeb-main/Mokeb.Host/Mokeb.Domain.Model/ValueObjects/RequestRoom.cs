namespace Mokeb.Domain.Model.ValueObjects
{
    public class RequestRoom
    {
        public RequestRoom(Guid id, string name)
        {
            Id = id;
            Name = name;
        }

        public Guid Id { get; private set; }
        public string Name { get; private set; }
    }
}
