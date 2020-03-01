using AutoMapper;
using GW.Application.Interfaces;
using GW.Application.Users.Models;
using GW.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace GW.Application.Users.Commands.UpdateUser
{
    public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, UserDto>
    {
        private readonly IGWContext Context;
        private readonly IMapper Mapper;
        private UserManager<User> UserManager;

        public UpdateUserCommandHandler(
            IGWContext context,
            IMapper mapper,
            UserManager<User> userManager)
        {
            Context = context;
            Mapper = mapper;
            UserManager = userManager;
        }

        public async Task<UserDto> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            if (request.Model == null)
            {
                throw new ArgumentNullException(nameof(request.Model));
            }

            var entity = await UserManager.FindByIdAsync(request.Id);

            entity.UserName = request.Model.Username;
            //entity.Email = request.Model.Email;
            //entity.UpdatedAt = DateTime.Now;

            //Context.ApplicationUsers.Update(entity);
            //await Context.SaveChangesAsync(cancellationToken);
            await UserManager.UpdateAsync(entity);
            return Mapper.Map<UserDto>(entity);
        }
    }
}
