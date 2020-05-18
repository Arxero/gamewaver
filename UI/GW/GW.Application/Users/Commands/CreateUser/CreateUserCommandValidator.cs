using FluentValidation;
using GW.Application.Users.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace GW.Application.Users.Commands.CreateUser
{
    public class CreateUserCommandValidator : AbstractValidator<UserDto>
    {
        public CreateUserCommandValidator()
        {
            RuleFor(x => x.Username)
               .Cascade(CascadeMode.StopOnFirstFailure)
               .NotEmpty().WithMessage("{PropertyName} is Empty")
               .Length(3, 30).WithMessage("Length of {PropertyName} is Invalid");

           
            RuleFor(x => x.Email)
               .Cascade(CascadeMode.StopOnFirstFailure)
               .NotEmpty().WithMessage("{PropertyName} is Empty")
               .Length(6, 30).WithMessage("Length of {PropertyName} is Invalid")
               .EmailAddress().WithMessage("{PropertyName} is Invalid");

        }

        protected bool BeAValidName(string name)
        {
            name = name.Replace(" ", "");
            name = name.Replace("-", "");
            return name.All(Char.IsLetter);
        }

        protected bool BeAValidGender(string gender)
        {
            if (gender.ToLower() == "male" || gender.ToLower() == "female")
            {
                return true;
            }
            return false;
        }

    }
}
