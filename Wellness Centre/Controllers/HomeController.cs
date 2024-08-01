using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Wellness_Centre.Models;

namespace Wellness_Centre.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            string cookieValue = HttpContext.Request.Cookies["user"];

            if (cookieValue == null)
            {
                // Cookie exists, handle the value
                //return RedirectToAction("", "Login");
                return View();
            }
            else
            {
                return View();
            }
            
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
