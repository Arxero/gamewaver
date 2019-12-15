using AutoMapper;
using GW.Application.Interfaces;
using MediatR;
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

        public DeleteUserCommandHandler(IGWContext context, IMapper mapper)
        {
            Context = context;
            Mapper = mapper;
        }

        public async Task<Unit> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
        {
            var entity = await Context.Users.FindAsync(request.Id);

            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            Context.Users.Remove(entity);
            await Context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
