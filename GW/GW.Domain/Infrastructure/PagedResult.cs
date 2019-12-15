using System;
using System.Collections.Generic;
using System.Text;

namespace GW.Domain.Infrastructure
{
    public class PagedResult<TDto> where TDto : class
    {
        public long Total { get; set; }
        public List<TDto> Items { get; set; }
    }
}
