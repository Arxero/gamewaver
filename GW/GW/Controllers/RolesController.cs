using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GW.Application.Roles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GW.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : BaseController
    {
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateRoleAsync([FromBody] CreateRoleCommand command)
        {
            var result = await Mediator.Send(command);
            return Ok(result);
        }
    }
}