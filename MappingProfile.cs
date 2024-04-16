using AutoMapper;
using BlogApplication.DTOs;
using BlogApplication.Models;

namespace BlogApplication
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UserRegistration, User>()
                .ForMember(u => u.UserName, opt => opt.MapFrom(x => x.Email));
        }
    }
}
