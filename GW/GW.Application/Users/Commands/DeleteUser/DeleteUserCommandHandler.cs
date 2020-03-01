using AutoMapper;
using GW.Application.Interfaces;
using GW.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace GW.Application.Users.Commands.DeleteUser
{
    public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand>
    {
        private readonly IMapper Mapper;
        private readonly IGWContext Context;
        private UserManager<User> UserManager;

        public DeleteUserCommandHandler(
            IGWContext context,
            IMapper mapper,
            UserManager<User> userManager)
        {
            Context = context;
            Mapper = mapper;
            UserManager = userManager;
        }

        public async Task<Unit> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
        {
            var user = await UserManager.FindByIdAsync(request.Id);

            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            await UserManager.DeleteAsync(user);

            return Unit.Value;
        }
    }
}
