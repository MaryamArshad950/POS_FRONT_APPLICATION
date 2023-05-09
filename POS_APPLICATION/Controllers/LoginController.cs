using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using POS_APPLICATION.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace POS_APPLICATION.Controllers
{
    public class LoginController : Controller
    {
        static string LASTLOGIN;
        IConfiguration Configuration;
        public LoginController(IConfiguration _configuration)
        {
            Configuration = _configuration;
            GetIPHostAPI();
        }

        static string Result_API = "", IP_Address = "", Port_No = "", DE_ACTIVEJWTTOKEN, checkUserValidate;
        StringContent SendRequest;
        public string GetIPHostAPI()
        {
            IP_Address = Configuration.GetSection("Endpoint").GetSection("POS_API_IP").Value;
            Port_No = Configuration.GetSection("Endpoint").GetSection("POS_API_PNO").Value;
            Result_API = IP_Address + ":" + Port_No;
            ViewData["GetIPHostAPI"] = Result_API;
            checkUserValidate = "https://" + Result_API + "/API/AUTH_CONTROLLER/AUTHENTICATE";
            DE_ACTIVEJWTTOKEN = "https://" + Result_API + "/API/AUTH_CONTROLLER/DE_ACTIVEJWTTOKEN";
            return Result_API;
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<ActionResult> POS_USER_LOGIN(string participant_name)
        {
            userMaster user_master = new userMaster();
            string JWTToken = null;
            ViewBag.TOKEN = null;
            LASTLOGIN = participant_name;
            user_master.UserName = participant_name;
            user_master.Password = participant_name;

            using (var client = new HttpClient())
            {
                try
                {
                    SendRequest = new StringContent(JsonConvert.SerializeObject(user_master), Encoding.UTF8, "application/json");
                    using (var response = await client.PostAsync(checkUserValidate, SendRequest))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        if (apiResponse == "\"Invalid user\"" ||
                            apiResponse == "\"Database Connection fail\"" ||
                            apiResponse == "\"Token Exception!" ||
                            apiResponse == "\"You have entered an Invalid credentials. Please try again!\"" ||
                            apiResponse == "\"User account Locked, Please contact System Administrator!\"" ||
                            apiResponse == "\"You have entered an Invalid credentials 3 times User has been Locked\"")
                        {
                            TempData["WrongStatus"] = apiResponse.ToString();
                            //return RedirectToAction("Index");
                        }
                        else
                        {
                            var reg = new Regex("\".*?\"");
                            var matches = reg.Matches((string)apiResponse);
                            for (int i = 1; i < 3; i++)
                            {
                                if (i == 2)
                                {
                                    JWTToken = (string)matches[1].ToString().Trim('"');
                                    HttpContext.Session.SetString("JwToken", JWTToken);
                                    //HttpContext.Session.SetString("UserName", UserName);
                                    ViewBag.TOKEN = JWTToken.ToString();
                                    TempData["Token"] = JWTToken.ToString();
                                }
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    TempData["successUSER"] = ex.ToString();
                }
                return RedirectToAction("Basic_information");
            }
        }
    }
}
