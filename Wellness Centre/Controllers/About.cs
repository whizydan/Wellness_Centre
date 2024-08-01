using Microsoft.AspNetCore.Mvc;

namespace Wellness_Centre.Controllers
{
    public class About : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
