using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GW.Application.Roles;
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
        [HttpGet, AllowAnonymous]
        public async Task<IActionResult> GetAllRolesAsync([FromQuery] Paging paging = null)
        {
            var query = new GetAllRolesQuery
            {
                Paging = paging
            };

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
            var result = await Mediator.Send(new DeleteRoleCommand { Id = id });
            return Ok(result);
        }
    }
}