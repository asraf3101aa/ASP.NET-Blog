using AutoMapper;
using Bislerium.Application.Interfaces;
using Bislerium.Application.DTOs.AccountDTOs;
using Bislerium.Application.DTOs.BlogDTOs;
using Bislerium.Domain.Entities;
using Bislerium.Domain.Enums;

namespace Bislerium.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Blog, BlogResponseDTO>()
                .ForMember(dest => dest.AuthorName, opt => opt.MapFrom(src => $"{src.Author.FirstName} {src.Author.LastName}"))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.Upvotes, opt => opt.MapFrom(src => src.Reactions.Count(r => r.Type == ReactionType.Upvote)))
                .ForMember(dest => dest.Downvotes, opt => opt.MapFrom(src => src.Reactions.Count(r => r.Type == ReactionType.Downvote)))
                .ForMember(dest => dest.CommentCount, opt => opt.MapFrom(src => src.Comments.Count));

            CreateMap<BlogImage, BlogImageResponseDTO>()
                .ForMember(dest => dest.Url, opt => opt.MapFrom<BlogImageUrlResolver>());

            CreateMap<Comment, CommentResponseDTO>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"));

            CreateMap<User, UserResponseDTO>()
                .ForMember(dest => dest.Avatar, opt => opt.MapFrom<UserAvatarUrlResolver>());
        }
    }

    public class UserAvatarUrlResolver : IValueResolver<User, UserResponseDTO, string>
    {
        private readonly IFileService _fileService;
        public UserAvatarUrlResolver(IFileService fileService)
        {
            _fileService = fileService;
        }

        public string Resolve(User source, UserResponseDTO destination, string destMember, ResolutionContext context)
        {
            return _fileService.GetFullUrl(source.AvatarPath);
        }
    }

    public class BlogImageUrlResolver : IValueResolver<BlogImage, BlogImageResponseDTO, string>
    {
        private readonly IFileService _fileService;
        public BlogImageUrlResolver(IFileService fileService)
        {
            _fileService = fileService;
        }

        public string Resolve(BlogImage source, BlogImageResponseDTO destination, string destMember, ResolutionContext context)
        {
            return _fileService.GetFullUrl(source.Path);
        }
    }
}
