using Bislerium.Application.Common.Interfaces;
using Bislerium.Application.DTOs.BlogDTOs;
using Bislerium.Domain.Entities;
using Bislerium.Presentation.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using X.PagedList;

namespace Bislerium.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly IFileService _fileService;
        private readonly IBlogService _blogService;
        private readonly IAccountService _accountService;
        private readonly IResponseService _responseService;
        private readonly IHubContext<NotificationHub> _hubContext;

        public BlogController(IHubContext<NotificationHub> hubContext, IResponseService responseService, IBlogService blogService, IFileService fileService, IAccountService accountService)
        {
            _blogService = blogService;
            _fileService = fileService;
            _accountService = accountService;
            _responseService = responseService;
            _hubContext = hubContext;

        }

        private IQueryable<Blog> SortBlogs(string sortBy)
        {
            switch (sortBy)
            {
                case "random":
                    return _blogService.GetQueryableRandomBlogAsync();
                case "popularity":
                    return _blogService.GetQueryablePopularBlogAsync();
                case "recency":
                    return _blogService.GetQueryableRecentBlogAsync();
                default:
                    return _blogService.GetQueryableRecentBlogAsync();
            }
        }
   
        [HttpGet]
        [Route("List")]
        public async Task<IActionResult> List([FromQuery] string sortBy = "recency", [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            int currentPage = pageNumber;
            // Sort the blogs
            var blogs = SortBlogs(sortBy);

            // Using X.PagedList to paginate the sorted blogs
            var pagedBlogs = await blogs.ToPagedListAsync(currentPage, pageSize);

            // Creating a response object that includes pagination metadata
            var response = new
            {
                PaginationMetaData = new
                {
                    SortBy = sortBy,
                    PageNumber = pagedBlogs.PageNumber,
                    PageSize = pagedBlogs.PageSize,
                    TotalPages = pagedBlogs.PageCount,
                    TotalItems = pagedBlogs.TotalItemCount,
                    HasPreviousPage = pagedBlogs.HasPreviousPage,
                    HasNextPage = pagedBlogs.HasNextPage
                },
                Blogs = pagedBlogs // The paged list of blogs
            };

            return Ok(_responseService.SuccessResponse(response));
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> UserBlogs(int pageNumber = 1, int pageSize = 10)
        {
            var user = await _accountService.GetUserByClaimsAsync(User);
            var queryableBlogs = _blogService.GetQueryableAuthorBlogsAsync(user);

            // Using X.PagedList to paginate the queryable blogs
            var pagedBlogs = await queryableBlogs.ToPagedListAsync(pageNumber, pageSize);

            // Creating a response object that includes pagination metadata
            var response = new
            {
                // The paged list of blogs
                PaginationMetaData = new
                {
                    TotalItems = pagedBlogs.TotalItemCount,
                    PageNumber = pagedBlogs.PageNumber,
                    PageSize = pagedBlogs.PageSize,
                    TotalPages = pagedBlogs.PageCount,
                    HasPreviousPage = pagedBlogs.HasPreviousPage,
                    HasNextPage = pagedBlogs.HasNextPage
                },
                Blogs = pagedBlogs,
            };
            return Ok(_responseService.SuccessResponse(response));
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> Details(int id)
        {
            var blog = await _blogService.FindByIdAsync(id);
            return blog != null ? Ok(_responseService.SuccessResponse(blog)) : NotFound(_responseService.CustomErrorResponse("Blog", "Blog not found"));
        }

        [Authorize]
        [RequireConfirmedEmail]
        [HttpGet]
        [Route("Categories")]
        public async Task<IActionResult> GetCategories()
        {
            var blogCategories = await _blogService.GetBlogCategoriesAsync();
            return blogCategories != null ? Ok(_responseService.SuccessResponse(blogCategories)) : NotFound(_responseService.CustomErrorResponse("Category", "Categories not found"));
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
                blogImages.Add(new BlogImage
                {
                    Path = imagePath,
                    ImageType = BlogImageType.Banner
                });
            }
            if (newblog.Other != null)
            {

                var (imagePath, error) = _fileService.UploadFile(newblog.Other);
                if (error != string.Empty)
                    return BadRequest(_responseService.CustomErrorResponse("Other", error));
                blogImages.Add(new BlogImage
                {
                    Path = imagePath,
                    ImageType = BlogImageType.Body
                });
            }
            var user = await _accountService.GetUserByClaimsAsync(User);
            var blog = await _blogService.CreateAsync(newblog, user, blogImages);
            return Ok(_responseService.SuccessResponse("Blog Created Successfully."));
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize(Roles = "Blogger")]
        [RequireConfirmedEmail]
        public async Task<IActionResult> Update([FromRoute] int id, [FromForm] BlogDTO blogUpdate)
        {
            var blog = await _blogService.FindByIdAsync(id);
            if (blog == null || blog.AuthorId != User.FindFirstValue(ClaimTypes.NameIdentifier))
                return NotFound(_responseService.CustomErrorResponse("Blog", "Blog not found"));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var blogImages = new List<BlogImage>();
            if (blogUpdate.Banner != null)
            {

                var (imagePath, error) = _fileService.UploadFile(blogUpdate.Banner);
                if (error != string.Empty)
                    return BadRequest(_responseService.CustomErrorResponse("Banner", error));
                blogImages.Add(new BlogImage
                {
                    Path = imagePath,
                    ImageType = BlogImageType.Banner
                });
            }
            if (blogUpdate.Other != null)
            {

                var (imagePath, error) = _fileService.UploadFile(blogUpdate.Other);
                if (error != string.Empty)
                    return BadRequest(_responseService.CustomErrorResponse("Other", error));
                blogImages.Add(new BlogImage
                {
                    Path = imagePath,
                    ImageType = BlogImageType.Body
                });
            }
            var updatedBlog = await _blogService.UpdateAsync(blogUpdate, blog, blogImages);
            return Accepted(_responseService.SuccessResponse("Blog updated Successfully."));
        }

        [HttpDelete]
        [Route("{id}")]
        [RequireConfirmedEmail]
        public async Task<IActionResult> Delete(int id)
        {
            var blog = await _blogService.FindByIdAsync(id);
            if (blog == null || blog.AuthorId != User.FindFirstValue(ClaimTypes.NameIdentifier))
                return NotFound(_responseService.CustomErrorResponse("Blog", "Blog not found"));
            await _blogService.DeleteBlogAsync(blog);
            return Ok(_responseService.SuccessResponse("Blog deleted successfully"));
        }

        [HttpPost]
        [Route("{id}/Reaction")]
        public async Task<IActionResult> AddReaction(int id, [FromBody] ReactionTypeDTO reactionTypeDTO)
        {
            var blog = await _blogService.FindByIdAsync(id);
            if (blog == null)
                return NotFound(_responseService.CustomErrorResponse("Blog", "Blog not found"));
            var user = await _accountService.GetUserByClaimsAsync(User);
            await _blogService.ReactAsync(blog, null,user.Id, reactionTypeDTO.ReactionType);
            if(user.Id != blog.Author.Id)
            {
                string notificationMessage = $"{user.FirstName} {user.LastName} {reactionTypeDTO.ReactionType.ToString().ToLower()}d on your blog: {blog.Title}.";
                await _hubContext.Clients.User(blog.AuthorId).SendAsync("notification", new { Title = reactionTypeDTO.ReactionType.ToString(), Body = notificationMessage, CreatedAt = DateTime.UtcNow });
            }
            return Ok(_responseService.SuccessResponse("Reacted successfully"));
        }

        [HttpPost]
        [Route("{blogId}/Comment")]
        public async Task<IActionResult> AddComment(int blogId, [FromBody] CommentDTO commentDto)
        {
            var blog = await _blogService.FindByIdAsync(blogId);
            if (blog == null)
                return NotFound(_responseService.CustomErrorResponse("Not found", "Blog not found"));

            var user = await _accountService.GetUserByClaimsAsync(User);
            await _blogService.AddCommentAsync(commentDto, blog.Id, user.Id);
            if (user.Id != blog.Author.Id)
            {
                string notificationMessage = $"{user.FirstName} {user.LastName} commented on your blog - {blog.Title}: {commentDto.Text}";
                await _hubContext.Clients.User(blog.AuthorId).SendAsync("notification", new { Title = "Comment", Body = notificationMessage, CreatedAt = DateTime.UtcNow });
            }
            return Ok(_responseService.SuccessResponse("Comment added successfully"));
        }

        [HttpPut]
        [RequireConfirmedEmail]
        [Route("{blogId}/Comment/{commentId}")]
        public async Task<IActionResult> UpdateComment(int blogId, int commentId, [FromBody] CommentDTO commentDto)
        {
            var blog = await _blogService.FindByIdAsync(blogId);
            if (blog == null)
                return NotFound(_responseService.CustomErrorResponse("Not found", "Blog not found"));

            var comment = blog.Comments.FirstOrDefault(c => c.Id == commentId);
            if (comment == null)
                return NotFound(_responseService.CustomErrorResponse("Not found", "Comment not found"));

            await _blogService.UpdateCommentAsync(comment, commentDto);

            return Ok(_responseService.SuccessResponse("Comment updated successfully"));
        }

        [HttpDelete]
        [RequireConfirmedEmail]
        [Route("{blogId}/Comment/{commentId}")]
        public async Task<IActionResult> DeleteComment(int blogId, int commentId)
        {
            var blog = await _blogService.FindByIdAsync(blogId);
            if (blog == null)
                return NotFound(_responseService.CustomErrorResponse("Not Found", "Blog not found"));

            var comment = blog.Comments.FirstOrDefault(c => c.Id == commentId);
            //var comment = await _blogService.GetCommentByIdAsync(commentId);
            if (comment == null)
                return NotFound(_responseService.CustomErrorResponse("Not found", "Comment not found"));
            await _blogService.DeleteCommentAsync(comment);
            return Ok(_responseService.SuccessResponse("Comment deleted successfully"));
        }

        [HttpPost]
        [RequireConfirmedEmail]
        [Route("{blogId}/Comment/{commentId}/Reaction")]
        public async Task<IActionResult> AddReaction(int blogId, int commentId, [FromBody] ReactionTypeDTO reactionTypeDTO)
        {
            var blog = await _blogService.FindByIdAsync(blogId);
            if (blog == null)
                return NotFound(_responseService.CustomErrorResponse("Not found", "Blog not found"));

            var comment = blog.Comments.FirstOrDefault(c => c.Id == commentId);
            //var comment = await _blogService.GetCommentByIdAsync(commentId);
            if (comment == null)
                return NotFound(_responseService.CustomErrorResponse("Not found", "Comment not found"));

            var user = await _accountService.GetUserByClaimsAsync(User);
            await _blogService.ReactAsync(null, comment, user.Id, reactionTypeDTO.ReactionType);
            if (user.Id != comment.User.Id)
            {
                string notificationMessage = $"{user.FirstName} {user.LastName} {reactionTypeDTO.ReactionType.ToString().ToLower()}d on your comment: {comment.Text}.";
                await _hubContext.Clients.User(blog.AuthorId).SendAsync("notification", new { Title = reactionTypeDTO.ReactionType.ToString(), Body = notificationMessage, CreatedAt = DateTime.UtcNow });
            }
            return Ok(_responseService.SuccessResponse("Reacted successfully"));
        }
    }
}
