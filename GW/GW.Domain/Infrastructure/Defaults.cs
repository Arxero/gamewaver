using System;
using System.Collections.Generic;
using System.Text;

namespace GW.Domain.Infrastructure
{
    public static class Defaults
    {
        public static readonly Paging Paging = new Paging { Skip = 0, Take = 10 };
    }
}
