using Bislerium.Application.Interfaces;
using Bislerium.Application.DTOs.BlogDTOs;
using Bislerium.Application.Features.Blogs.Queries.GetBlogs;
using Bislerium.Application.Features.Blogs.Queries.GetBlogById;
using Bislerium.Application.Features.Blogs.Queries.GetAuthorBlogs;
using Bislerium.Application.Features.Blogs.Queries.GetCategories;
using Bislerium.Application.Features.Blogs.Commands.CreateBlog;
using Bislerium.Application.Features.Blogs.Commands.UpdateBlog;
using Bislerium.Application.Features.Blogs.Commands.DeleteBlog;
using Bislerium.Application.Features.Blogs.Commands.ReactToBlog;
using Bislerium.Application.Features.Blogs.Commands.ReactToComment;
using Bislerium.Application.Features.Blogs.Commands.AddComment;
using Bislerium.Application.Features.Blogs.Commands.UpdateComment;
using Bislerium.Application.Features.Blogs.Commands.DeleteComment;
using Bislerium.Domain.Entities;
using Bislerium.Domain.Enums;
using Bislerium.Presentation.Helper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Bislerium.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly IFileService _fileService;
        private readonly IAccountService _accountService;
        private readonly IResponseService _responseService;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly IMediator _mediator;

        public BlogController(
            IMediator mediator,
            IHubContext<NotificationHub> hubContext,
            IResponseService responseService,
            IFileService fileService,
            IAccountService accountService)
        {
            _fileService = fileService;
            _accountService = accountService;
            _responseService = responseService;
            _hubContext = hubContext;
            _mediator = mediator;
        }

        [HttpGet]
        [Route("List")]
        public async Task<IActionResult> List([FromQuery] string sortBy = "recency", [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _mediator.Send(new GetBlogsQuery(sortBy, pageNumber, pageSize));
            return Ok(_responseService.SuccessResponse(result));
        }

        [HttpGet]
        [Authorize]
        [Route("UserBlogs")]
        public async Task<IActionResult> UserBlogs(int pageNumber = 1, int pageSize = 10)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var result = await _mediator.Send(new GetAuthorBlogsQuery(userId, pageNumber, pageSize));
            return Ok(_responseService.SuccessResponse(result));
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> Details(int id)
        {
            var blog = await _mediator.Send(new GetBlogByIdQuery(id));
            return blog != null
                ? Ok(_responseService.SuccessResponse(blog))
                : NotFound(_responseService.CustomErrorResponse("Blog", "Blog not found"));
        }

        [Authorize]
        [RequireConfirmedEmail]
        [HttpGet]
        [Route("Categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _mediator.Send(new GetCategoriesQuery());
            return categories.Any()
                ? Ok(_responseService.SuccessResponse(categories))
                : NotFound(_responseService.CustomErrorResponse("Category", "Categories not found"));
        }

        [HttpPost]
        [Authorize(Roles = "Blogger")]
        [RequireConfirmedEmail]
        public async Task<IActionResult> Create([FromForm] BlogDTO newblog)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var blogImages = new List<BlogImage>();
            if (newblog.Banner != null)
            {
                var (imagePath, error) = _fileService.UploadFile(newblog.Banner);
                if (error != string.Empty)
                    return BadRequest(_responseService.CustomErrorResponse("Banner", error));
                blogImages.Add(new BlogImage { Path = imagePath, ImageType = BlogImageType.Banner });
            }
            if (newblog.Other != null)
            {
                var (imagePath, error) = _fileService.UploadFile(newblog.Other);
                if (error != string.Empty)
                    return BadRequest(_responseService.CustomErrorResponse("Other", error));
                blogImages.Add(new BlogImage { Path = imagePath, ImageType = BlogImageType.Body });
            }

            var user = await _accountService.GetUserByClaimsAsync(User);
            await _mediator.Send(new CreateBlogCommand(newblog, user, blogImages));
            return Ok(_responseService.SuccessResponse<object>(null, "Blog Created Successfully."));
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize(Roles = "Blogger")]
        [RequireConfirmedEmail]
        public async Task<IActionResult> Update([FromRoute] int id, [FromForm] BlogDTO blogUpdate)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var blogImages = new List<BlogImage>();
            if (blogUpdate.Banner != null)
            {
                var (imagePath, error) = _fileService.UploadFile(blogUpdate.Banner);
                if (error != string.Empty)
                    return BadRequest(_responseService.CustomErrorResponse("Banner", error));
                blogImages.Add(new BlogImage { Path = imagePath, ImageType = BlogImageType.Banner });
            }
            if (blogUpdate.Other != null)
            {
                var (imagePath, error) = _fileService.UploadFile(blogUpdate.Other);
                if (error != string.Empty)
                    return BadRequest(_responseService.CustomErrorResponse("Other", error));
                blogImages.Add(new BlogImage { Path = imagePath, ImageType = BlogImageType.Body });
            }

            var user = await _accountService.GetUserByClaimsAsync(User);
            var updatedBlog = await _mediator.Send(new UpdateBlogCommand(id, blogUpdate, user, blogImages));

            if (updatedBlog == null)
                return NotFound(_responseService.CustomErrorResponse("Blog", "Blog not found or unauthorized"));

            return Accepted(_responseService.SuccessResponse<object>(null, "Blog updated Successfully."));
        }

        [HttpDelete]
        [Route("{id}")]
        [RequireConfirmedEmail]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _accountService.GetUserByClaimsAsync(User);
            var deleted = await _mediator.Send(new DeleteBlogCommand(id, user));

            if (!deleted)
                return NotFound(_responseService.CustomErrorResponse("Blog", "Blog not found or unauthorized"));

            return Ok(_responseService.SuccessResponse<object>(null, "Blog deleted successfully"));
        }

        [HttpPost]
        [Route("{id}/Reaction")]
        public async Task<IActionResult> AddReaction(int id, [FromBody] ReactionTypeDTO reactionTypeDTO)
        {
            var blog = await _mediator.Send(new GetBlogByIdQuery(id));
            if (blog == null)
                return NotFound(_responseService.CustomErrorResponse("Blog", "Blog not found"));

            var user = await _accountService.GetUserByClaimsAsync(User);
            await _mediator.Send(new ReactToBlogCommand(id, user.Id, reactionTypeDTO.ReactionType));

            string notificationMessage = $"{user.FirstName} {user.LastName} {reactionTypeDTO.ReactionType.ToString().ToLower()}d on your blog: {blog.Title}.";
            await _hubContext.Clients.User(blog.AuthorId).SendAsync("notification", new { Title = reactionTypeDTO.ReactionType.ToString(), Body = notificationMessage, CreatedAt = DateTime.UtcNow });

            return Ok(_responseService.SuccessResponse<object>(null, "Reacted successfully"));
        }

        [HttpPost]
        [Route("{blogId}/Comment")]
        public async Task<IActionResult> AddComment(int blogId, [FromBody] CommentDTO commentDto)
        {
            var blog = await _mediator.Send(new GetBlogByIdQuery(blogId));
            if (blog == null)
                return NotFound(_responseService.CustomErrorResponse("Not found", "Blog not found"));

            var user = await _accountService.GetUserByClaimsAsync(User);
            await _mediator.Send(new AddCommentCommand(blogId, user.Id, commentDto));

            string notificationMessage = $"{user.FirstName} {user.LastName} commented on your blog - {blog.Title}: {commentDto.Text}";
            await _hubContext.Clients.User(blog.AuthorId).SendAsync("notification", new { Title = "Comment", Body = notificationMessage, CreatedAt = DateTime.UtcNow });

            return Ok(_responseService.SuccessResponse<object>(null, "Comment added successfully"));
        }

        [HttpPut]
        [RequireConfirmedEmail]
        [Route("{blogId}/Comment/{commentId}")]
        public async Task<IActionResult> UpdateComment(int blogId, int commentId, [FromBody] CommentDTO commentDto)
        {
            var user = await _accountService.GetUserByClaimsAsync(User);
            var updated = await _mediator.Send(new UpdateCommentCommand(commentId, user.Id, commentDto));

            if (!updated)
                return NotFound(_responseService.CustomErrorResponse("Comment", "Comment not found or unauthorized"));

            return Ok(_responseService.SuccessResponse<object>(null, "Comment updated successfully"));
        }

        [HttpDelete]
        [RequireConfirmedEmail]
        [Route("{blogId}/Comment/{commentId}")]
        public async Task<IActionResult> DeleteComment(int blogId, int commentId)
        {
            var user = await _accountService.GetUserByClaimsAsync(User);
            var deleted = await _mediator.Send(new DeleteCommentCommand(commentId, user.Id));

            if (!deleted)
                return NotFound(_responseService.CustomErrorResponse("Comment", "Comment not found or unauthorized"));

            return Ok(_responseService.SuccessResponse<object>(null, "Comment deleted successfully"));
        }

        [HttpPost]
        [RequireConfirmedEmail]
        [Route("{blogId}/Comment/{commentId}/Reaction")]
        public async Task<IActionResult> AddCommentReaction(int blogId, int commentId, [FromBody] ReactionTypeDTO reactionTypeDTO)
        {
            var blog = await _mediator.Send(new GetBlogByIdQuery(blogId));
            if (blog == null)
                return NotFound(_responseService.CustomErrorResponse("Not found", "Blog not found"));

            var user = await _accountService.GetUserByClaimsAsync(User);
            await _mediator.Send(new ReactToCommentCommand(commentId, user.Id, reactionTypeDTO.ReactionType));

            string notificationMessage = $"{user.FirstName} {user.LastName} {reactionTypeDTO.ReactionType.ToString().ToLower()}d on a comment.";
            await _hubContext.Clients.User(blog.AuthorId).SendAsync("notification", new { Title = reactionTypeDTO.ReactionType.ToString(), Body = notificationMessage, CreatedAt = DateTime.UtcNow });

            return Ok(_responseService.SuccessResponse<object>(null, "Reacted successfully"));
        }
    }
}
