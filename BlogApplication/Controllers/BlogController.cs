﻿using Bislerium.Application.Common.Interfaces;
using Bislerium.Application.DTOs.BlogDTOs;
using Bislerium.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        public BlogController(IResponseService responseService ,IBlogService blogService, IFileService fileService, IAccountService accountService)
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

            // Get the total count before pagination
            var totalCount = blogs.Count();

            var paginatedBlogs = blogs.Skip((currentPage - 1) * pageSize).Take(pageSize);

            var paginatedBlogsDTO = new PaginatedBlogsDTO
            {
                PaginationMetaData = new PaginationMetaData
                {
                    SortBy = sortBy,
                    CurrentPage = currentPage,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                },
                Blogs = paginatedBlogs.ToList()
            };
            return Ok(_responseService.SuccessResponse(paginatedBlogsDTO));
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
        public async Task<IActionResult> Create(BlogCreateDTO newblog)
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

        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public async Task<IActionResult> Edit(int id, [Bind("Id,Title,Body,CategoryId")] Blog blog)
        //{
        //    if (id != blog.Id)
        //    {
        //        return NotFound();
        //    }

        //    if (ModelState.IsValid)
        //    {
        //        try
        //        {
        //            blog.UpdatedAt = DateTime.UtcNow;
        //            _context.Update(blog);
        //            await _context.SaveChangesAsync();
        //        }
        //        catch (DbUpdateConcurrencyException)
        //        {
        //            if (!_context.Blog.Any(e => e.Id == blog.Id))
        //            {
        //                return NotFound();
        //            }
        //            else
        //            {
        //                throw;
        //            }
        //        }
        //        return RedirectToAction(nameof(Index));
        //    }
        //    ViewData["CategoryId"] = new SelectList(_context.Category, "Id", "Name", blog.CategoryId);
        //    return View(blog);
        //}
        

        [HttpDelete]
        [Route("{id}/Delete")]
        [RequireConfirmedEmail]
        public async Task<IActionResult> Delete(int id)
        {
            var blog = await _blogService.FindByIdAsync(id);
            if (blog == null)
                return NotFound(_responseService.CustomErrorResponse("Blog", "Blog not found"));
            await _blogService.DeleteBlogAsync(blog);
            return Ok();
        }

    }
}
