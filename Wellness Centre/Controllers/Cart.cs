using Microsoft.AspNetCore.Mvc;

namespace Wellness_Centre.Controllers
{
    public class Cart : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
