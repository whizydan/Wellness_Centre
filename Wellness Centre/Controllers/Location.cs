using Microsoft.AspNetCore.Mvc;

namespace Wellness_Centre.Controllers
{
    public class Location : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
