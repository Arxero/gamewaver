using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GW.Application.Users.Models;
using GW.Application.Users.Queries;
using GW.Application.Users.Commands;
using GW.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using GW.Application.Users.Commands.UpdateUser;
using GW.Application.Users.Commands.DeleteUser;
using GW.Domain.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using GW.Application.Roles.Queries;

namespace GW.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : BaseController
    {
      
        [HttpGet]
        public async Task<IActionResult> GetAllUsers([FromQuery] Paging paging = null)
        {
            var query = new GetAllUsersQuery
            {
                Paging = paging
            };

            return Ok(await Mediator.Send(query));
        }


        [HttpGet("{id}", Name = "Get")]
        public async Task<IActionResult> Get(string id)
        {
            var query = new GetUserByIdQuery
            {
                Id = id
            };
            return Ok(await Mediator.Send(query));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> Put(string id, [FromBody] UserDto model)
        {
            var command = new UpdateUserCommand
            {
                Model = model,
                Id = id
            };

            var theUser = await Mediator.Send(command);
            return theUser;
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await Mediator.Send(new DeleteUserCommand { Id = id });
            return Ok(new { success = true });
        }

        [HttpGet("by/{roleId}"), AllowAnonymous]
        public async Task<IActionResult> GetAllRolesByUserIdAsync(string roleId, [FromQuery] Paging paging)
        {
            var query = new GetUsersByRoleQuery
            {
                Paging = paging,
                RoleId = roleId
            };
            return Ok(await Mediator.Send(query));
        }
    }

}