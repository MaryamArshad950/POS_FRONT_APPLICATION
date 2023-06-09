using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using POS_APPLICATION.Models.CLAIMS;
using POS_APPLICATION.Models.CUSTOMER;
using POS_APPLICATION.Models.POS_USER_MASTER;
using RDL_TestProject.RS_Services.RS_Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace POS_APPLICATION.Controllers
{
    public class ServicesController : Controller
    {
        IConfiguration Configuration;
        private readonly IRS rS;
        public ServicesController(IConfiguration _configuration, IRS _rS)
        {
            Configuration = _configuration;
            rS = _rS;
            GetIPHostAPI();
        }

        static string Result_API = "", IP_Address = "", Port_No = "", checkUserValidate;
        StringContent SendRequest;
        private readonly string Update_UserContact = "" + Result_API + "/API/NON_FINANCIAL/UPDATE_USER_CELLNO";
        private readonly string Update_HomeAddr = "" + Result_API + "/API/NON_FINANCIAL/UPDATE_CUST_ADDRESS";
        private readonly string Update_EmailAddr = "" + Result_API + "/API/NON_FINANCIAL/UPDATE_USER_EMAIL";
        private readonly string Request_PartialWthdrw = "" + Result_API + "/API/NON_FINANCIAL/REQUEST_PARTIAL_WITHDRWL";
        private readonly string Intimate_claim = "" + Result_API + "/API/CLAIM_INTIMATION/POST_CLAIM_INTIMATION";
        private readonly string Request_Freelook = "" + Result_API + "/API/NON_FINANCIAL/REQUEST_FREELOOK";
        public string GetIPHostAPI()
        {
            //POS IP
            IP_Address = Configuration.GetSection("Endpoint").GetSection("POS_API_IP").Value;
            Port_No = Configuration.GetSection("Endpoint").GetSection("POS_API_PNO").Value;
            Result_API = IP_Address + ":" + Port_No;
            ViewData["GetIPHostAPI"] = Result_API;
            checkUserValidate = "" + Result_API + "/API/AUTH_CONTROLLER/AUTHENTICATE";
            return Result_API;
        }

        public IActionResult MyProfile()
        {
            return View();
        }
        public IActionResult Funds()
        {
            return View();
        }
        public IActionResult AlterAddress()
        {
            return View();
        }
        public IActionResult AlterContact()
        {
            return View();
        }
        public IActionResult AlterEmail()
        {
            return View();
        }
        public IActionResult PartialWithdrawal()
        {
            return View();
        }
        public IActionResult ClaimIntimation()
        {
            return View();
        }
        public IActionResult Documents()
        {
            return View();
        }
        public IActionResult FreeLook()
        {
            return View();
        }
        public IActionResult PolicySurrender()
        {
            return View();
        }
        public IActionResult ContributionPayment()
        {
            return View();
        }
        ///general email sending
        public async Task<ActionResult> SendEmail(string username, string messageEmail, string emailAddress, string subject)
        {
            await rS.SendEmailMesg(username, messageEmail, emailAddress, subject);
            return Ok("Email Has Been Sent Successfully");
        }

        [HttpPost]
        public async Task<ActionResult> UPDATE_CONTACTNO(string SUM_FULL_NAME, int SUM_SYS_USER_ID, 
                                                         string SUM_CUST_CONTPHONE, string emailAddress)
        {
            POS_USER pos_user = new POS_USER();
            pos_user.SUM_SYS_USER_ID = SUM_SYS_USER_ID;
            pos_user.SUM_CUST_CONTPHONE = SUM_CUST_CONTPHONE;
            var strToken = HttpContext.Session.GetString("JwTokenPos");

            using (var handler = new HttpClientHandler())
            {
                // allow the bad certificate
                handler.ServerCertificateCustomValidationCallback = (request, cert, chain, errors) => true;

                using (var client = new HttpClient(handler))
                {
                    SendRequest = null;
                    try
                    {
                        var Token = strToken.Replace("{", "}");
                        client.BaseAddress = new Uri(Update_UserContact);
                        var contentType = new MediaTypeWithQualityHeaderValue("application/json");
                        client.DefaultRequestHeaders.Accept.Add(contentType);
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Token);
                        SendRequest = new StringContent(JsonConvert.SerializeObject(pos_user), Encoding.UTF8, "application/json");
                        using (var response = await client.PostAsync(Update_UserContact, SendRequest))
                        {
                            Random random = new Random();
                            string randomDigits = "";
                            for (int i = 0; i < 8; i++)
                            {
                                randomDigits += random.Next(0, 10).ToString();
                            }
                            int randomNumber = int.Parse(randomDigits);
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            var dict2 = JArray.Parse(apiResponse);
                            foreach (JObject ReqArr in dict2.Children<JObject>())
                            {
                                string ReqNo = ReqArr["REQ_CODE"].ToString();
                                string msgText = "<p>Your Contact Number has been changed successfully on your request under the request number " + ReqNo + "</p><p>Thank You for using our services</p><p>For any further assistance, please contact CS@salaamtakaful.com via WhatsApp/UAN on 021-111-875-111.</p>";
                                await this.SendEmail(SUM_FULL_NAME, msgText, emailAddress, "Contact Updation");
                                var smsURL = "https://api.itelservices.net/send.php?transaction_id=" + randomNumber + "&user=salaamtakaf&pass=kdPre&number=" + (SUM_CUST_CONTPHONE).Substring(1) + "&text=Dear " + SUM_FULL_NAME + ", Your Contact Number has been changed successfully on your request under the request number " + ReqNo + ". Thank You for using our services. For any further assistance, please contact CS@salaamtakaful.com via WhatsApp/UAN on 021-111-875-111." + "&from=44731&type=sms";
                                await client.PostAsync(smsURL, SendRequest);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        TempData["successUSER"] = ex.ToString();
                    }
                    return RedirectToAction("AlterContact");
                }
            }
        }

        [HttpPost]
        public async Task<ActionResult> UPDATE_EMAILADDR(string SUM_FULL_NAME, int SUM_SYS_USER_ID,
                                                         string SUM_USER_EMAIL_ADDR, string SUM_CUST_CONTPHONE)
        {
            POS_USER pos_user = new POS_USER();
            pos_user.SUM_SYS_USER_ID = SUM_SYS_USER_ID;
            pos_user.SUM_USER_EMAIL_ADDR = SUM_USER_EMAIL_ADDR;
            var strToken = HttpContext.Session.GetString("JwTokenPos");

            using (var handler = new HttpClientHandler())
            {
                // allow the bad certificate
                handler.ServerCertificateCustomValidationCallback = (request, cert, chain, errors) => true;

                using (var client = new HttpClient(handler))
                {
                    SendRequest = null;
                    try
                    {
                        var Token = strToken.Replace("{", "}");
                        client.BaseAddress = new Uri(Update_EmailAddr);
                        var contentType = new MediaTypeWithQualityHeaderValue("application/json");
                        client.DefaultRequestHeaders.Accept.Add(contentType);
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Token);
                        SendRequest = new StringContent(JsonConvert.SerializeObject(pos_user), Encoding.UTF8, "application/json");
                        using (var response = await client.PostAsync(Update_EmailAddr, SendRequest))
                        {
                            Random random = new Random();
                            string randomDigits = "";
                            for (int i = 0; i < 8; i++)
                            {
                                randomDigits += random.Next(0, 10).ToString();
                            }
                            int randomNumber = int.Parse(randomDigits);
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            var dict2 = JArray.Parse(apiResponse);
                            foreach (JObject ReqArr in dict2.Children<JObject>())
                            {
                                string ReqNo = ReqArr["REQ_CODE"].ToString();
                                string msgText = "<p>Your Email Address has been added successfully on your request under the request number " + ReqNo + "</p><p>Thank You for using our services</p><p>For any further assistance, please contact CS@salaamtakaful.com via WhatsApp/UAN on 021-111-875-111.</p>";
                                await this.SendEmail(SUM_FULL_NAME, msgText, SUM_USER_EMAIL_ADDR, "Email Address Addition");
                                var smsURL = "https://api.itelservices.net/send.php?transaction_id=" + randomNumber + "&user=salaamtakaf&pass=kdPre&number=" + (SUM_CUST_CONTPHONE).Substring(1) + "&text=Dear " + SUM_FULL_NAME + ", Your New Email Address has been added successfully on your request under the request number " + ReqNo + ". Thank You for using our services. For any further assistance, please contact CS@salaamtakaful.com via WhatsApp/UAN on 021-111-875-111." + "&from=44731&type=sms";
                                await client.PostAsync(smsURL, SendRequest);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        TempData["successUSER"] = ex.ToString();
                    }
                    return RedirectToAction("AlterEmail");
                }
            }
        }

        [HttpPost]
        public async Task<ActionResult> UPDATE_HOMEADDRESS(string SUM_FULL_NAME, int FSCU_CUSTOMER_CODE, string FSCA_ADDRESS1,
                                                           string FSCA_ADDRESS_TYPE, int FSCT_CITY_ID, int FSSP_PROVINCE_ID,
                                                           string emailAddress, string SUM_CUST_CONTPHONE)
        {
            CUSTOMER_ADDRESS cust_adr= new CUSTOMER_ADDRESS();
            cust_adr.FSCU_CUSTOMER_CODE = FSCU_CUSTOMER_CODE;
            cust_adr.FSCA_ADDRESS1 = FSCA_ADDRESS1;
            cust_adr.FSCA_ADDRESS_TYPE = FSCA_ADDRESS_TYPE;
            cust_adr.FSCT_CITY_ID = FSCT_CITY_ID;
            cust_adr.FSSP_PROVINCE_ID = FSSP_PROVINCE_ID;
            var strToken = HttpContext.Session.GetString("JwTokenPos");

            using (var handler = new HttpClientHandler())
            {
                // allow the bad certificate
                handler.ServerCertificateCustomValidationCallback = (request, cert, chain, errors) => true;

                using (var client = new HttpClient(handler))
                {
                    SendRequest = null;
                    try
                    {
                        var Token = strToken.Replace("{", "}");
                        client.BaseAddress = new Uri(Update_HomeAddr);
                        var contentType = new MediaTypeWithQualityHeaderValue("application/json");
                        client.DefaultRequestHeaders.Accept.Add(contentType);
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Token);
                        SendRequest = new StringContent(JsonConvert.SerializeObject(cust_adr), Encoding.UTF8, "application/json");
                        using (var response = await client.PostAsync(Update_HomeAddr, SendRequest))
                        {
                            Random random = new Random();
                            string randomDigits = "";
                            for (int i = 0; i < 8; i++)
                            {
                                randomDigits += random.Next(0, 10).ToString();
                            }
                            int randomNumber = int.Parse(randomDigits);
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            var dict2 = JArray.Parse(apiResponse);
                            foreach (JObject ReqArr in dict2.Children<JObject>())
                            {
                                string ReqNo = ReqArr["REQ_CODE"].ToString();
                                string msgText = "<p>Your Residential Address has been changed successfully on your request under the request number " + ReqNo + "</p><p>Thank You for using our services</p><p>For any further assistance, please contact CS@salaamtakaful.com via WhatsApp/UAN on 021-111-875-111.</p>";
                                await this.SendEmail(SUM_FULL_NAME, msgText, emailAddress, "Residential Address Updation");
                                var smsURL = "https://api.itelservices.net/send.php?transaction_id=" + randomNumber + "&user=salaamtakaf&pass=kdPre&number=" + (SUM_CUST_CONTPHONE).Substring(1) + "&text=Dear " + SUM_FULL_NAME + ", Your Residential Address has been changed successfully on your request under the request number " + ReqNo + ". Thank You for using our services. For any further assistance, please contact CS@salaamtakaful.com via WhatsApp/UAN on 021-111-875-111." + "&from=44731&type=sms";
                                await client.PostAsync(smsURL, SendRequest);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        TempData["successUSER"] = ex.ToString();
                    }
                    return RedirectToAction("AlterAddress");
                }
            }
        }

        [HttpPost]
        public async Task<ActionResult> REQUEST_PARTIAL_WITHDRW(int FSCU_CUSTOMER_CODE, string SUM_FULL_NAME, string SUM_USER_EMAIL_ADDR, string SUM_CUST_CONTPHONE, string FSBK_BANK_NAME, string FSCB_BRANCH_NAME, string FSCB_ACCOUNT_TITLE, string FSCB_ACCOUNT_NO, string FSSH_POL_CODE, int FSSH_PW_AMT)
        {
            CUSTOMER_BANK_DETL cust_bnk = new CUSTOMER_BANK_DETL();
            cust_bnk.FSCU_CUSTOMER_CODE = FSCU_CUSTOMER_CODE;
            cust_bnk.FSSH_POL_CODE = FSSH_POL_CODE;
            cust_bnk.FSSH_PW_AMT = FSSH_PW_AMT;
            cust_bnk.FSBK_BANK_NAME = FSBK_BANK_NAME;
            cust_bnk.FSCB_BRANCH_NAME = FSCB_BRANCH_NAME;
            cust_bnk.FSCB_ACCOUNT_NO = FSCB_ACCOUNT_NO;
            cust_bnk.FSCB_ACCOUNT_TITLE = FSCB_ACCOUNT_TITLE;
            cust_bnk.FSCB_STATUS = "Y";
            cust_bnk.FSCB_CRUSER = 1;
            cust_bnk.FSCB_CRDATE = DateTime.Today;
            var strToken = HttpContext.Session.GetString("JwTokenPos");

            using (var handler = new HttpClientHandler())
            {
                // allow the bad certificate
                handler.ServerCertificateCustomValidationCallback = (request, cert, chain, errors) => true;

                using (var client = new HttpClient(handler))
                {
                    SendRequest = null;
                    try
                    {
                        var Token = strToken.Replace("{", "}");
                        client.BaseAddress = new Uri(Request_PartialWthdrw);
                        var contentType = new MediaTypeWithQualityHeaderValue("application/json");
                        client.DefaultRequestHeaders.Accept.Add(contentType);
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Token);
                        SendRequest = new StringContent(JsonConvert.SerializeObject(cust_bnk), Encoding.UTF8, "application/json");
                        using (var response = await client.PostAsync(Request_PartialWthdrw, SendRequest))
                        {
                            Random random = new Random();
                            string randomDigits = "";
                            for (int i = 0; i < 8; i++)
                            {
                                randomDigits += random.Next(0, 10).ToString();
                            }
                            int randomNumber = int.Parse(randomDigits);
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            var dict2 = JArray.Parse(apiResponse);
                            foreach (JObject ReqArr in dict2.Children<JObject>())
                            {
                                string ReqNo = ReqArr["REQ_CODE"].ToString();
                                string msgText = "<p>Your Request for Partial cash withdraw has been received under the request number " + ReqNo + "</p><p>We will get back to you soon.</p><p>Thank You for using our services</p><p>For any further assistance, please contact CS@salaamtakaful.com via WhatsApp/UAN on 021-111-875-111.</p>";
                                await this.SendEmail(SUM_FULL_NAME, msgText, SUM_USER_EMAIL_ADDR, "Partial Withdrawal Request");
                                var smsURL = "https://api.itelservices.net/send.php?transaction_id=" + randomNumber + "&user=salaamtakaf&pass=kdPre&number=" + (SUM_CUST_CONTPHONE).Substring(1) + "&text=Dear " + SUM_FULL_NAME + ", Your Request for Partial cash withdraw has been received under the request number " + ReqNo + ". We will get back to you soon. Thank You for using our services. For any further assistance, please contact CS@salaamtakaful.com via WhatsApp/UAN on 021-111-875-111." + "&from=44731&type=sms";
                                await client.PostAsync(smsURL, SendRequest);
                                TempData["successMessage"] = "Request Processed Successfully";
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        TempData["successUSER"] = ex.ToString();
                    }
                    return RedirectToAction("PartialWithdrawal");
                }
            }
        }


        [HttpPost]
        public async Task<ActionResult> REQUEST_FREE_LOOK(int FSCU_CUSTOMER_CODE, string SUM_FULL_NAME, string SUM_USER_EMAIL_ADDR, string SUM_CUST_CONTPHONE, string FSBK_BANK_NAME, string FSCB_ACCOUNT_TITLE, string FSCB_ACCOUNT_NO)
        {
            CUSTOMER_BANK_DETL cust_bnk = new CUSTOMER_BANK_DETL();
            cust_bnk.FSCU_CUSTOMER_CODE = FSCU_CUSTOMER_CODE;
            cust_bnk.FSBK_BANK_NAME = FSBK_BANK_NAME;
            cust_bnk.FSCB_ACCOUNT_NO = FSCB_ACCOUNT_NO;
            cust_bnk.FSCB_ACCOUNT_TITLE = FSCB_ACCOUNT_TITLE;
            cust_bnk.FSCB_STATUS = "Y";
            cust_bnk.FSCB_CRUSER = 1;
            cust_bnk.FSCB_CRDATE = DateTime.Today;
            var strToken = HttpContext.Session.GetString("JwTokenPos");

            using (var handler = new HttpClientHandler())
            {
                // allow the bad certificate
                handler.ServerCertificateCustomValidationCallback = (request, cert, chain, errors) => true;

                using (var client = new HttpClient(handler))
                {
                    SendRequest = null;
                    try
                    {
                        var Token = strToken.Replace("{", "}");
                        client.BaseAddress = new Uri(Request_Freelook);
                        var contentType = new MediaTypeWithQualityHeaderValue("application/json");
                        client.DefaultRequestHeaders.Accept.Add(contentType);
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Token);
                        SendRequest = new StringContent(JsonConvert.SerializeObject(cust_bnk), Encoding.UTF8, "application/json");
                        using (var response = await client.PostAsync(Request_Freelook, SendRequest))
                        {
                            Random random = new Random();
                            string randomDigits = "";
                            for (int i = 0; i < 8; i++)
                            {
                                randomDigits += random.Next(0, 10).ToString();
                            }
                            int randomNumber = int.Parse(randomDigits);
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            var dict2 = JArray.Parse(apiResponse);
                            foreach (JObject ReqArr in dict2.Children<JObject>())
                            {
                                string ReqNo = ReqArr["REQ_CODE"].ToString();
                                string msgText = "<p>Your Request for Free Look has been received under the request number " + ReqNo + "</p><p>We will get back to you soon.</p><p>Thank You for using our services</p><p>For any further assistance, please contact CS@salaamtakaful.com via WhatsApp/UAN on 021-111-875-111.</p>";
                                await this.SendEmail(SUM_FULL_NAME, msgText, SUM_USER_EMAIL_ADDR, "Partial Withdrawal Request");
                                var smsURL = "https://api.itelservices.net/send.php?transaction_id=" + randomNumber + "&user=salaamtakaf&pass=kdPre&number=" + (SUM_CUST_CONTPHONE).Substring(1) + "&text=Dear " + SUM_FULL_NAME + ", Your Request for Free Look has been received under the request number " + ReqNo + ". We will get back to you soon. Thank You for using our services. For any further assistance, please contact CS@salaamtakaful.com via WhatsApp/UAN on 021-111-875-111." + "&from=44731&type=sms";
                                await client.PostAsync(smsURL, SendRequest);
                                TempData["successMessage"] = "Request Processed Successfully";
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        TempData["successUSER"] = ex.ToString();
                    }
                    return RedirectToAction("FreeLook");
                }
            }
        }

        [HttpPost]
        public async Task<ActionResult> INTIMATE_CLAIM(string FPDH_POLICY_NO, string SUM_FULL_NAME, string SUM_USER_EMAIL_ADDR, string SUM_CUST_CONTPHONE, int FPCL_CLMTP_FSCD_ID, string FCIH_PLACE_OF_EVNT, DateTime FCIH_DATE_EVNT, DateTime FPCL_DATE_TREATMNT, string FPCL_CLAIM_DESC, string FPCL_SIMLR_CNDITION, string FPCL_YES_DETAIL, string FPCL_TREATED, string FPCL_NAME, string FPCL_ADDRESS, DateTime FPCL_HOSPADMT_DATE, DateTime FPCL_HOSDIS_DATE, DateTime FPCL_ATTND_WORKPLACE, DateTime FPCL_REJOING_WORKPLACE, string FPCL_ACC_NAME, string FPCL_BANK_NAME, string FPCL_ACC_TYPE, string FPCL_ACCNO_IBFT)
        {
            CLAIM_INTIMATION claim = new CLAIM_INTIMATION();
            claim.FPDH_POLICY_NO = FPDH_POLICY_NO;
            claim.FPCL_CLMTP_FSCD_ID = FPCL_CLMTP_FSCD_ID;
            claim.FCIH_PLACE_OF_EVNT = FCIH_PLACE_OF_EVNT;
            claim.FCIH_DATE_EVNT = FCIH_DATE_EVNT;
            claim.FPCL_DATE_TREATMNT = FPCL_DATE_TREATMNT;
            claim.FPCL_CLAIM_DESC = FPCL_CLAIM_DESC;
            claim.FPCL_SIMLR_CNDITION = FPCL_SIMLR_CNDITION;
            claim.FPCL_YES_DETAIL = FPCL_YES_DETAIL;
            claim.FPCL_TREATED = FPCL_TREATED;
            claim.FPCL_NAME = FPCL_NAME;
            claim.FPCL_ADDRESS = FPCL_ADDRESS;
            claim.FPCL_HOSPADMT_DATE = FPCL_HOSPADMT_DATE;
            claim.FPCL_HOSDIS_DATE = FPCL_HOSDIS_DATE;
            claim.FPCL_ATTND_WORKPLACE = FPCL_ATTND_WORKPLACE;
            claim.FPCL_REJOING_WORKPLACE = FPCL_REJOING_WORKPLACE;
            claim.FPCL_ACC_NAME = FPCL_ACC_NAME;
            claim.FPCL_BANK_NAME = FPCL_BANK_NAME;
            claim.FPCL_ACC_TYPE = FPCL_ACC_TYPE;
            claim.FPCL_ACCNO_IBFT = FPCL_ACCNO_IBFT;

            var strToken = HttpContext.Session.GetString("JwTokenPos");

            using (var handler = new HttpClientHandler())
            {
                // allow the bad certificate
                handler.ServerCertificateCustomValidationCallback = (request, cert, chain, errors) => true;

                using (var client = new HttpClient(handler))
                {
                    SendRequest = null;
                    try
                    {
                        var Token = strToken.Replace("{", "}");
                        client.BaseAddress = new Uri(Intimate_claim);
                        var contentType = new MediaTypeWithQualityHeaderValue("application/json");
                        client.DefaultRequestHeaders.Accept.Add(contentType);
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Token);
                        SendRequest = new StringContent(JsonConvert.SerializeObject(claim), Encoding.UTF8, "application/json");
                        using (var response = await client.PostAsync(Intimate_claim, SendRequest))
                        {
                            Random random = new Random();
                            string randomDigits = "";
                            for (int i = 0; i < 8; i++)
                            {
                                randomDigits += random.Next(0, 10).ToString();
                            }
                            int randomNumber = int.Parse(randomDigits);
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            var dict2 = JArray.Parse(apiResponse);
                            foreach (JObject ReqArr in dict2.Children<JObject>())
                            {
                                string ReqNo = ReqArr["REQ_CODE"].ToString();
                                string msgText = "<p>Your Request for Claim Intimation has been received under the request number " + ReqNo + "</p><p>We will get back to you soon.</p><p>Thank You for using our services</p><p>For any further assistance, please contact CS@salaamtakaful.com via WhatsApp/UAN on 021-111-875-111.</p>";
                                await this.SendEmail(SUM_FULL_NAME, msgText, SUM_USER_EMAIL_ADDR, "Claim Intimation");
                                var smsURL = "https://api.itelservices.net/send.php?transaction_id=" + randomNumber + "&user=salaamtakaf&pass=kdPre&number=" + (SUM_CUST_CONTPHONE).Substring(1) + "&text=Dear " + SUM_FULL_NAME + ", Your Request for Claim Intimation has been received under the request number " + ReqNo + ". We will get back to you soon. Thank You for using our services. For any further assistance, please contact CS@salaamtakaful.com via WhatsApp/UAN on 021-111-875-111." + "&from=44731&type=sms";
                                await client.PostAsync(smsURL, SendRequest);
                                TempData["successMessage"] = "Request Processed Successfully";
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        TempData["successUSER"] = ex.ToString();
                    }
                    return RedirectToAction("ClaimIntimation");
                }
            }
        }
    }
}