using AutoMapper;
using GW.Application.Users.Models;
using GW.Persistence;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace GW.Application.Users.Commands.UpdateUser
{
    public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, UserDto>
    {
        private readonly IGamewaverContext Context;
        private readonly IMapper Mapper;

        public UpdateUserCommandHandler(IGamewaverContext context, IMapper mapper)
        {
            Context = context;
            Mapper = mapper;
        }

        public async Task<UserDto> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            if (request.Model == null)
            {
                throw new ArgumentNullException(nameof(request.Model));
            }

            var entity = await Context.Users.FindAsync(request.Id);

            entity.Username = request.Model.Username;
            entity.FirstName = request.Model.FirstName;
            entity.LastName = request.Model.LastName;
            entity.Email = request.Model.Email;
            entity.Gender = request.Model.Gender;
            entity.UpdatedAt = DateTime.Now;

            Context.Users.Update(entity);
            await Context.SaveChangesAsync(cancellationToken);
            return Mapper.Map<UserDto>(entity);
        }
    }
}
