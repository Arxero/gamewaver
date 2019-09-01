using AutoMapper;
using GW.Application.Users.Models;
using GW.Domain.Entities;

namespace GW.Extensions
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDto>();

            CreateMap<UserDto, User>();
        }
    }
}