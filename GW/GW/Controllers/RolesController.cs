using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GW.Application.Roles;
using GW.Application.Roles.Commands.AddOrRemoveUsers;
using GW.Application.Roles.Commands.DeleteRole;
using GW.Application.Roles.Queries;
using GW.Domain.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GW.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : BaseController
    {
        [HttpGet, Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllRolesAsync([FromQuery] Paging paging = null)
        {
            var query = new GetAllRolesQuery
            {
                Paging = paging
            };

            return Ok(await Mediator.Send(query));
        }

        [HttpGet("{id}"), AllowAnonymous]
        public async Task<IActionResult> GetAllRolesByIdAsync(string id)
        {
            var query = new GetRoleByIdQuery { Id = id };
            return Ok(await Mediator.Send(query));
        }

        [HttpPost, AllowAnonymous]
        public async Task<IActionResult> CreateRoleAsync([FromBody] CreateRoleCommand command)
        {
            var result = await Mediator.Send(command);
            return Ok(result);
        }

        [HttpPut("{id}"), AllowAnonymous]
        public async Task<IActionResult> UpdateRoleAsync(string id, [FromBody] UpdateRoleCommand command)
        {
            command.Id = id;
            var result = await Mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("{id}"), AllowAnonymous]
        public async Task<IActionResult> DeleteRoleAsync(string id)
        {
            await Mediator.Send(new DeleteRoleCommand { Id = id });
            return Ok(new { success = true });
        }

        [HttpPost("update-users"), AllowAnonymous]
        public async Task<IActionResult> AddOrRemoveUsersAsync([FromBody] AddOrRemoveUsersCommand command)
        {
            var result = await Mediator.Send(command);
            return Ok(new { success = true });
        }

        [HttpGet("by/{userId}"), AllowAnonymous]
        public async Task<IActionResult> GetAllRolesByUserIdAsync(string userId, [FromQuery] Paging paging = null)
        {
            var query = new GetRolesByUserIdQuery 
            {
                Paging = paging,
                UserId = userId
            };
            return Ok(await Mediator.Send(query));
        }
    }
}