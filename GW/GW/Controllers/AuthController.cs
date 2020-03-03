using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using GW.Application.Users.Commands;
using GW.Application.Users.Commands.LoginUser;
using GW.Application.Users.Commands.LogoutUser;
using GW.Application.Users.Models;
using GW.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace GW.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : BaseController
    {
        public AuthController(IOptions<AppSettings> config, ILogger<AuthController> logger)
        {
            this.config = config;
            this.logger = logger;
        }

        private readonly IOptions<AppSettings> config;
        private readonly ILogger<AuthController> logger;


        [HttpPost]
        [Route("register"), AllowAnonymous]
        public async Task<IActionResult> RegisterUser([FromBody] CreateUserCommand command)
        {
            var result = await Mediator.Send(command);
            return Ok(result);           
        }


        [HttpPost, Route("login"), AllowAnonymous]
        public async Task<IActionResult> LoginAsync([FromBody] LoginUserCommand command)
        {
            var result = await Mediator.Send(command);
            return Ok(result);           
        }

        [HttpPost, Route("logout")]
        public async Task<IActionResult> LogoutAsync([FromBody] LogoutUserCommand command)
        {
            var result = await Mediator.Send(command);
            return Ok(result);
        }
    }
}