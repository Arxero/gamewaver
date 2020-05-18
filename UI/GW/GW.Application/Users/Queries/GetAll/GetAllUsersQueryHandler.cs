using AutoMapper;
using GW.Application.Interfaces;
using GW.Application.Users.Models;
using GW.Domain.Entities;
using GW.Domain.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GW.Application.Users.Queries
{
    public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, PagedResult<UserDto>>
    {
        private readonly IMapper Mapper;
        private readonly IGWContext Context;

        public GetAllUsersQueryHandler(IGWContext context, IMapper mapper)
        {
            Context = context;
            Mapper = mapper;
        }

        public async Task<PagedResult<UserDto>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
        {

            if (request.Paging == null || !request.Paging.IsValid())
            {
                request.Paging = Defaults.Paging;
            }

            var totalCount = await Context.ApplicationUsers.CountAsync();
            var users = await Context.ApplicationUsers.Skip(request.Paging.Skip).Take(request.Paging.Take).ToListAsync(cancellationToken);
            var mappedUsers = users.Select(x => Mapper.Map<UserDto>(x)).ToList();

            return new PagedResult<UserDto>
            {
                Items = mappedUsers,
                Total = totalCount,
            };
        }
    }
}
