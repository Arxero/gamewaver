using GW.Application.Users.Models;
using MediatR;

namespace GW.Application.Users.Queries
{
    public class GetUserByIdQuery : IRequest<UserDto>
    {
        public string Id { get; set; }
    }
}
