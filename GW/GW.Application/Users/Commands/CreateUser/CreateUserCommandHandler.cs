using AutoMapper;
using GW.Application.Users.Commands.CreateUser;
using GW.Application.Users.Models;
using GW.Domain.Entities;
using GW.Persistence;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace GW.Application.Users.Commands
{
    public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, UserDto>
    {
        private readonly IMapper Mapper;
        private readonly IGamewaverContext Context;

        public CreateUserCommandHandler(IGamewaverContext context, IMapper mapper)
        {
            Context = context;
            Mapper = mapper;
        }

        public async Task<UserDto> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
  
            if (request.Model == null)
            {
                throw new ArgumentNullException(nameof(request.Model));
            }

            var incomingUser = Mapper.Map<User>(request.Model);
            incomingUser.CreatedAt = DateTime.Now;
            incomingUser.UpdatedAt = DateTime.Now;

            var theUser = await Context.Users.AddAsync(incomingUser);
            await Context.SaveChangesAsync(cancellationToken);

            var userToReturn = Mapper.Map<UserDto>(theUser.Entity);
            return userToReturn;
        }
    }
}
