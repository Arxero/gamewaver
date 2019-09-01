using System.Collections.Generic;

namespace GW.Domain.Entities
{
    public class PagedResult<TDto> where TDto : class
    {
        public long Total { get; set; }
        public List<TDto> Items { get; set; }
    }
}
