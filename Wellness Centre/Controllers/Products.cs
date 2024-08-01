using Microsoft.AspNetCore.Mvc;

namespace Wellness_Centre.Controllers
{
    public class Products : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
