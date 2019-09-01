namespace GW.Domain.Entities
{
    public class Paging
    {
        public int Skip { get; set; }

        public int Take { get; set; }

        public bool IsValid()
        {
            return Take > 0 && Skip > -1;
        }
    }
}
