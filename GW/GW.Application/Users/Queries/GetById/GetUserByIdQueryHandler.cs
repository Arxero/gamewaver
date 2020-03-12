using AutoMapper;
using GW.Application.Interfaces;
using GW.Application.Users.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GW.Application.Users.Queries
{
    public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UserDto>
    {
        private readonly IMapper Mapper;
        private readonly IGWContext Context;

        public GetUserByIdQueryHandler(IGWContext context, IMapper mapper)
        {
            Context = context;
            Mapper = mapper;
        }

        public async Task<UserDto> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            var user = await Context.ApplicationUsers.Where(x => x.Id.Equals(request.Id)).FirstOrDefaultAsync();
            return Mapper.Map<UserDto>(user);
        }
    }
}
