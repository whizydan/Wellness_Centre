using Microsoft.AspNetCore.Mvc;

namespace Wellness_Centre.Controllers
{
    public class Contact : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
