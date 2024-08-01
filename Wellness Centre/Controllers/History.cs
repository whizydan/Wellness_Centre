using Microsoft.AspNetCore.Mvc;

namespace Wellness_Centre.Controllers
{
    public class History : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
