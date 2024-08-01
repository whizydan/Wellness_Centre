using Microsoft.AspNetCore.Mvc;

namespace Wellness_Centre.Controllers
{
    public class LogoutController : Controller
    {
        public IActionResult Index()
        {
            // Clear all cookies
            foreach (var cookie in Request.Cookies.Keys)
            {
                Response.Cookies.Delete(cookie);
            }

            // Redirect to the login page
            return RedirectToAction("Index", "Login");
        }
    }
}
