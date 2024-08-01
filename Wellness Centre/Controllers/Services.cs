using Microsoft.AspNetCore.Mvc;

namespace Wellness_Centre.Controllers
{
    public class Services : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
