using Microsoft.AspNetCore.Mvc;

namespace BlogApplication.Controllers
{
    public class BlogController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
