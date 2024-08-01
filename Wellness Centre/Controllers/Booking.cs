using Microsoft.AspNetCore.Mvc;

namespace Wellness_Centre.Controllers
{
    public class Booking : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
