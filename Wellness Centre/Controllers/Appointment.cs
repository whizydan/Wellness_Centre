using Microsoft.AspNetCore.Mvc;

namespace Wellness_Centre.Controllers
{
    public class Appointment : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
