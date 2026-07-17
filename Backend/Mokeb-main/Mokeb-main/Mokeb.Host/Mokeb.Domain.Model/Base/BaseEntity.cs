namespace Mokeb.Domain.Model.Base
{
    public abstract class BaseEntity<TId>
    {
        public TId Id { get; protected set; }
    }
}
