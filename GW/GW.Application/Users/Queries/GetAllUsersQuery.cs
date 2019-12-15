using GW.Application.Users.Models;
using GW.Domain.Entities;
using GW.Domain.Infrastructure;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace GW.Application.Users.Queries
{
    public class GetAllUsersQuery : IRequest<PagedResult<UserDto>>
    {
        public Paging Paging { get; set; }
    }
}
