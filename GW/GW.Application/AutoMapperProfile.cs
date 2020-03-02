using AutoMapper;
using GW.Application.Users.Models;
using GW.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GW.Application
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();

            CreateMap<Role, RoleDto>();
            CreateMap<RoleDto, Role>();
        }
    }
}
