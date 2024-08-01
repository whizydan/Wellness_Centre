using Microsoft.AspNetCore.Mvc;

namespace Wellness_Centre.Controllers
{
    public class M_services : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
