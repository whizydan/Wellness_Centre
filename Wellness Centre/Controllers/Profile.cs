using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json; // Ensure you have Newtonsoft.Json package installed

namespace Wellness_Centre.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Newtonsoft.Json;

    namespace Wellness_Centre.Controllers
    {
        public class Profile : Controller
        {
            public IActionResult Index()
            {
                string userCookieValue = Request.Cookies["user"];

                if (!string.IsNullOrEmpty(userCookieValue))
                {
                    try
                    {
                        var userModel = JsonConvert.DeserializeObject<UserModel>(userCookieValue);
                        ViewBag.UserCookie = userModel;
                    }
                    catch (JsonReaderException ex)
                    {
                        // Log or handle the exception (e.g., invalid JSON format)
                        ViewBag.UserCookie = null; // Set ViewBag.UserCookie to null to handle the error in the view
                    }
                }
                else
                {
                    ViewBag.UserCookie = null; // Handle case where cookie is missing or empty
                }

                return View();
            }
        }
    }


    public class UserModel
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Dob { get; set; }
        public string Gender { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string Photo { get; set; }
        public int Role { get; set; }
        public string EmpId { get; set; }
    }
}
