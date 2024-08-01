using Microsoft.AspNetCore.Mvc;

namespace Wellness_Centre.Controllers
{
    public class Checkout : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
