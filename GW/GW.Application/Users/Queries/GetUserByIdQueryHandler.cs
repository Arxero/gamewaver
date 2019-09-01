using AutoMapper;
using GW.Application.Users.Models;
using GW.Persistence;
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
        private readonly IGamewaverContext Context;

        public GetUserByIdQueryHandler(IGamewaverContext context, IMapper mapper)
        {
            Context = context;
            Mapper = mapper;
        }

        public async Task<UserDto> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            var user = await Context.Users.Where(x => x.Id.Equals(request.Id)).FirstOrDefaultAsync();
            return Mapper.Map<UserDto>(user);
        }
    }
}
