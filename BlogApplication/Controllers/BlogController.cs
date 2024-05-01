using Bislerium.Application.Common.Interfaces;
using Bislerium.Application.DTOs.BlogDTOs;
using Bislerium.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        public BlogController(IResponseService responseService, IBlogService blogService, IFileService fileService, IAccountService accountService)
        {
            _blogService = blogService;
            _fileService = fileService;
            _accountService = accountService;
            _responseService = responseService;
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
        public async Task<IActionResult> Index([FromQuery] string sortBy = "recency", [FromQuery] int page = 1, [FromQuery] int pageSize = 9)
        {
            int currentPage = page;
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
        [Authorize]
        [RequireConfirmedEmail]
        public async Task<IActionResult> Create(BlogDTO newblog)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var blogImages = new List<BlogImage>();
            if (newblog.Images.Any())
            {
                foreach (var image in newblog.Images)
                {
                    var (imagePath, error) = _fileService.UploadFile(image.File);
                    if (error != string.Empty)
                        return BadRequest(_responseService.CustomErrorResponse(image.ImageType.ToString(), error));
                    blogImages.Add(new BlogImage
                    {
                        Path = imagePath,
                        ImageType = image.ImageType
                    });
                }
            }
            var user = await _accountService.GetUserByClaimsAsync(User);
            var blog = await _blogService.CreateAsync(newblog, user, blogImages);
            return Ok(_responseService.SuccessResponse(blog));
        }

        [HttpPut]
        [Route("{id}/update")]
        public async Task<IActionResult> Update([FromQuery] int id, BlogDTO blogUpdate)
        {
            var blog = await _blogService.FindByIdAsync(id);
            if (blog == null || blog.AuthorId != User.FindFirstValue(ClaimTypes.NameIdentifier))
                return NotFound(_responseService.CustomErrorResponse("Blog", "Blog not found"));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var blogImages = new List<BlogImage>();
            if (blogUpdate.Images.Any())
            {
                foreach (var image in blogUpdate.Images)
                {
                    var (imagePath, error) = _fileService.UploadFile(image.File);
                    if (error != string.Empty)
                        return BadRequest(_responseService.CustomErrorResponse(image.ImageType.ToString(), error));
                    blogImages.Add(new BlogImage
                    {
                        Path = imagePath,
                        ImageType = image.ImageType
                    });
                }
            }
            var updatedBlog = await _blogService.UpdateAsync(blogUpdate, blog, blogImages);
            return Accepted();
        }


        [HttpDelete]
        [Route("{id}/Delete")]
        [RequireConfirmedEmail]
        public async Task<IActionResult> Delete(int id)
        {
            var blog = await _blogService.FindByIdAsync(id);
            if (blog == null || blog.AuthorId != User.FindFirstValue(ClaimTypes.NameIdentifier))
                return NotFound(_responseService.CustomErrorResponse("Blog", "Blog not found"));
            await _blogService.DeleteBlogAsync(blog);
            return Ok();
        }

        [HttpPost]
        [Route("{id}/Reaction")]
        public async Task<IActionResult> AddReaction(int id, [FromBody] ReactionType reactionType)
        {
            var blog = await _blogService.FindByIdAsync(id);
            if (blog == null)
                return NotFound(_responseService.CustomErrorResponse("Blog", "Blog not found"));
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            await _blogService.ReactOnBlogAsync(blog, userId, reactionType);
            return Ok();

        }

        [HttpPost]
        [Route("{blogId}/Comment")]
        public async Task<IActionResult> AddComment(int blogId, [FromBody] CommentDTO commentDto)
        {
            var blog = await _blogService.FindByIdAsync(blogId);
            if (blog == null)
                return NotFound(_responseService.CustomErrorResponse("Blog", "Blog not found"));

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            await _blogService.AddCommentAsync(commentDto, blog.Id, userId);
            return Ok();
        }

        [HttpPut]
        [Route("{blogId}/Comment/{commentId}")]
        public async Task<IActionResult> UpdateComment(int blogId, int commentId, [FromBody] CommentDTO commentDto)
        {
            var blog = await _blogService.FindByIdAsync(blogId);
            if (blog == null)
                return NotFound(_responseService.CustomErrorResponse("Blog", "Blog not found"));

            var comment = blog.Comments.FirstOrDefault(c => c.Id == commentId);
            if (comment == null)
                return NotFound(_responseService.CustomErrorResponse("Comment", "Comment not found"));

            await _blogService.UpdateCommentAsync(comment, commentDto);

            return Ok();
        }

        [HttpDelete]
        [Route("{blogId}/Comment/{commentId}")]
        public async Task<IActionResult> DeleteComment(int blogId, int commentId)
        {
            var blog = await _blogService.FindByIdAsync(blogId);
            if (blog == null)
                return NotFound(_responseService.CustomErrorResponse("Blog", "Blog not found"));

            var comment = blog.Comments.FirstOrDefault(c => c.Id == commentId);
            //var comment = await _blogService.GetCommentByIdAsync(commentId);
            if (comment == null)
                return NotFound(_responseService.CustomErrorResponse("Comment", "Comment not found"));
            await _blogService.DeleteCommentAsync(comment);
            return Ok();
        }
    }
}
