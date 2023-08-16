using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Http;
using System.Text;
using System.IO;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using POS_APPLICATION.Models.POS_USER_MASTER;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;
using POS_APPLICATION.Models.CUST_NEED_ANALYSIS;
using POS_APPLICATION.Models.ILLUSTRATION;
using POS_APPLICATION.Models;
using POS_APPLICATION.Models.BENEFICIARY;
using Microsoft.AspNetCore.Hosting;
using POS_APPLICATION.Models.CUSTOMER;
using System.Net.Http.Headers;
using RDL_TestProject.RS_Services.RS_Interface;
//using System.Web.Mvc;

namespace POS_APPLICATION.Controllers
{
    public class UserController : Controller
    {
        static string LASTLOGIN;
        IConfiguration Configuration;
        private readonly IRS rS;

        private readonly IWebHostEnvironment _webHostEnvironment;
        public UserController(IConfiguration _configuration, IWebHostEnvironment webHostEnvironment, IRS _rS)
        {
            Configuration = _configuration;
            rS = _rS;
            GetIPHostAPI();
            GetCoreHostAPI();
            _webHostEnvironment = webHostEnvironment;
        }

        static string Result_API = "", Global_API = "", IP_Address = "", Port_No = "", DE_ACTIVEJWTTOKEN, checkUserValidate, checkCoreUserValidate, DefaultPosUser;
        StringContent SendRequest;
        //  StringContent SendRequest2;

        private readonly string Add_DcmntInfo = "" + Result_API + "/api/Participant/PostParticipantDetails";
        private readonly string Add_UserInfo = "" + Result_API + "/api/PosUser/SavePOSUserDetails";
        private readonly string Add_MedicalInfo = "" + Result_API + "/api/DcmntQuestnr/SaveOrUpdateDcmntQuestnrDetails";
        private readonly string Add_DiseasesInfo = "" + Result_API + "/api/DcmntQuestnr/SaveDcmntQuestnrDetails";
        private readonly string Add_NomineeInfo = "" + Result_API + "/api/DcmntNominee/SaveOrUpdateDcmntNominee";
        private readonly string Add_NomineeGurdInfo = "" + Result_API + "/api/DcmntNominee/SaveOrUpdateNomineeGuardian";
        private readonly string Add_TakafulHist = "" + Result_API + "/api/TakafulHist/SaveOrUpdateUserTakafulHistory";
        private readonly string Add_FinancialDtls = "" + Result_API + "/api/FinanceDtls/SaveOrUpdateUserFinanceDtls";
        private readonly string Add_FinancialNeeds = "" + Result_API + "/api/FinanceNeeds/SaveOrUpdateUserFinanceNeeds";
        private readonly string Add_DMS = "" + Result_API + "/API/DMS/POST_DMS_HDR";
        private readonly string Add_DMS_DETAILS = "" + Result_API + "/API/DMS/POST_DMS_DETAILS";
        private readonly string Add_Rider_Dtls = "" + Result_API + "/api/Participant/PostRiderDetails";
        private readonly string Add_familyhistory = "" + Result_API + "/API/CUSTOMER_FAMILY_HISTRY/";
        private readonly string updateUserPswd = "" + Result_API + "/api/PosUser/UpdatePasswd";
        private readonly string logoutSession = "" + Result_API + "/API/AUTH_CONTROLLER/LOGOUT";
        public string GetIPHostAPI()
        {
            IP_Address = Configuration.GetSection("Endpoint").GetSection("POS_API_IP").Value;
            Port_No = Configuration.GetSection("Endpoint").GetSection("POS_API_PNO").Value;
            Result_API = IP_Address + ":" + Port_No;
            ViewData["GetIPHostAPI"] = Result_API;
            DefaultPosUser = Configuration.GetSection("Credentials").GetSection("POS").Value;
            Global_API = Configuration.GetSection("Endpoint").GetSection("GLOBAL_API_IP").Value;
            checkUserValidate = "" + Result_API + "/API/AUTH_CONTROLLER/AUTHENTICATE";
            checkCoreUserValidate = "" + Global_API + "/API/AUTH_CONTROLLER/AUTHENTICATE";
            DE_ACTIVEJWTTOKEN = "" + Result_API + "/API/AUTH_CONTROLLER/DE_ACTIVEJWTTOKEN";
            return Result_API;
        }
        public string GetCoreHostAPI()
        {
            Global_API = Configuration.GetSection("Endpoint").GetSection("GLOBAL_API_IP").Value;
            return Global_API;
        }
        [HttpGet]
        public async Task<IActionResult> Logout()
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(logoutSession);

                var responseTask = await client.GetAsync(logoutSession);
                if (responseTask.IsSuccessStatusCode)
                {
                    HttpContext.Session.Remove("Session");
                    Response.Cookies.Delete("Session");
                    HttpContext.Session.Clear(); // Clear the session data
                                                 // Other logout actions...
                    return RedirectToAction("Index", "User");
                }
                else
                {
                    HttpContext.Session.Remove("Session");
                    Response.Cookies.Delete("Session");
                    HttpContext.Session.Clear(); // Clear the session data
                                                 // Other logout actions...
                    return RedirectToAction("Index", "User");
                }
            }
               
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult RecoverPassword()
        {
            return View();
        }
        [HttpPost]
        public IActionResult GetSessionValue(string key)
        {
            return Ok(HttpContext.Session.GetString(key));
        }
        [HttpPost]
        public IActionResult SetSessionValue(string key, string value)
        {
            HttpContext.Session.SetString(key, value);
            return Ok();
        }
        [HttpPost]
        public IActionResult removeSessionValue()
        {
            HttpContext.Session.Clear();
            return Ok();
        }
        [HttpPost]
        public async Task<IActionResult> createDefaultPOSAcc()
        {
            POS_USER user = new POS_USER();
            userMaster user_master = new userMaster();
            string JWTToken = null;
            string UserIDValue = null;
            ViewBag.TOKEN = null;
            user.SUM_SYS_USER_ID = 0;
            user.SUM_SYS_USER_CODE = DefaultPosUser;
            user.SUM_USER_PASSWORD = DefaultPosUser;
            user.SUM_CRUSER = 1;
            user.SUM_CRDATE = DateTime.Today;
            //HttpContext.Session.Clear();
            using (var handler = new HttpClientHandler())
            {
                // allow the bad certificate
                handler.ServerCertificateCustomValidationCallback = (request, cert, chain, errors) => true;

                using (var client = new HttpClient(handler))
                {
                    SendRequest = null;
                    try
                    {
                        SendRequest = new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, "application/json");
                        using (var response = await client.PostAsync(Add_UserInfo, SendRequest))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            if (apiResponse != null)
                            {
                                var dict2 = JArray.Parse(apiResponse);
                                foreach (JObject UserArr in dict2.Children<JObject>())
                                {
                                    UserIDValue = UserArr["NEW_USER_ID"].ToString();
                                    HttpContext.Session.SetString("POS_SYS_USER_ID", UserIDValue);
                                }
                            }
                            else
                            {
                                TempData["successUSER"] = "user updated!";
                            }
                        }
                        //Token authenticate
                        user_master.UserName = user.SUM_SYS_USER_CODE + UserIDValue;
                        user_master.Password = user.SUM_USER_PASSWORD;

                        SendRequest = new StringContent(JsonConvert.SerializeObject(user_master), Encoding.UTF8, "application/json");
                        using (var response = await client.PostAsync(checkUserValidate, SendRequest))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            if (apiResponse == "\"Invalid user\"" ||
                                apiResponse == "\"Database Connection fail\"" ||
                                apiResponse == "\"Token Exception!" ||
                                apiResponse == "\"Incorrect credentials. Please try again!\"" ||
                                apiResponse == "\"User account Locked, Please contact System Administrator!\"" ||
                                apiResponse == "\"You have entered an Invalid credentials 3 times User has been Locked\"")
                            {
                                TempData["WrongStatus"] = apiResponse.ToString().Trim('"');
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
                                        HttpContext.Session.SetString("JwTokenPos", JWTToken);
                                    }
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        TempData["successUSER"] = ex.ToString();
                    }
                }
            }
            return Ok(JWTToken.ToString());
        }
        [HttpPost]
        public async Task<IActionResult> authorizePOSAcc()
        {
            userMaster user_master = new userMaster();
            string JWTToken = null;
            user_master.UserName = "POSUSER";
            user_master.Password = "POSUSER";
            HttpContext.Session.Clear();
            using (var handler = new HttpClientHandler())
            {
                // allow the bad certificate
                handler.ServerCertificateCustomValidationCallback = (request, cert, chain, errors) => true;

                using (var client = new HttpClient(handler))
                {
                    SendRequest = null;
                    try
                    {
                        //Token authenticate
                        SendRequest = new StringContent(JsonConvert.SerializeObject(user_master), Encoding.UTF8, "application/json");
                        using (var response = await client.PostAsync(checkUserValidate, SendRequest))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            if (apiResponse == "\"Invalid user\"" ||
                                apiResponse == "\"Database Connection fail\"" ||
                                apiResponse == "\"Token Exception!" ||
                                apiResponse == "\"Incorrect credentials. Please try again!\"" ||
                                apiResponse == "\"User account Locked, Please contact System Administrator!\"" ||
                                apiResponse == "\"You have entered an Invalid credentials 3 times User has been Locked\"")
                            {
                                TempData["WrongStatus"] = apiResponse.ToString().Trim('"');
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
                                        HttpContext.Session.SetString("JwTokenUser", JWTToken);
                                    }
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        TempData["successUSER"] = ex.ToString();
                    }
                }
            }
            return Ok(JWTToken.ToString());
        }
        public string PosReport(string P_DOCUMENT_CODE)
        {
            var reportServerUrl = Configuration.GetSection("ReportServer").GetSection("ServerName").Value;
            var reportPath = Configuration.GetSection("ReportServer").GetSection("ReportFolder").Value + "POS_Illust";
            var queryString = $"&P_DOCUMENT_CODE={P_DOCUMENT_CODE}";
            string url = $"{reportServerUrl}?/{reportPath}&rs:Command=Render{queryString}&rs:Format=PDF";

            return url;

        }
        public IActionResult GetUrl(string Src_CODE)
        {
            string returnUrl = PosReport(Src_CODE);
            ViewData["returnUrl"] = returnUrl;
            return Json(returnUrl);
        }

        public static string EncryptString(string key, string plainText)
        {
            byte[] iv = new byte[16];
            byte[] array;

            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(key);
                aes.IV = iv;

                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

                using (MemoryStream memoryStream = new MemoryStream())
                {
                    using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter streamWriter = new StreamWriter((Stream)cryptoStream))
                        {
                            streamWriter.Write(plainText);
                        }

                        array = memoryStream.ToArray();
                    }
                }
            }


            return Convert.ToBase64String(array);
        }
        public string DecryptString(string Text)
        {
            var key = Configuration.GetSection("Credentials").GetSection("SymKey").Value;
            byte[] iv = new byte[16];
            byte[] buffer = Convert.FromBase64String(Text);

            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(key);
                aes.IV = iv;
                ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

                using (MemoryStream memoryStream = new MemoryStream(buffer))
                {
                    using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader streamReader = new StreamReader((Stream)cryptoStream))
                        {
                            return streamReader.ReadToEnd();
                        }
                    }
                }
            }
        }

        public async Task<ActionResult> SendEmail(string username, string messageEmail, string emailAddress, string subject)
        {
            await rS.SendEmailMesg(username, messageEmail, emailAddress, subject);
            return Ok("Email Has Been Sent Successfully");
        }
        public async Task<ActionResult> SendSMS(string username, string Txtmessage, string phoneNumber, string transactionID)
        {
            await rS.SendSMSMesg(username, Txtmessage, phoneNumber, transactionID);
            return Ok("Sms Has Been Sent Successfully");
        }

        public IActionResult Onboarding()
        {
            return View();

            //try
            //{
            //    var strToken = HttpContext.Session.GetString("JwTokenPos");
            //    if (strToken != null)
            //    {
            //        return View();
            //    }
            //    else
            //    {
            //        return RedirectToAction("Index", "User");
            //    }
            //}
            //catch (Exception)
            //{
            //    return RedirectToAction("Index", "User");
            //}
        }
        public IActionResult Illustration()
        {
            try
            {
                var strToken = HttpContext.Session.GetString("JwTokenPos");
                if (strToken != null)
                {
                    return View();
                }
                else
                {
                    return RedirectToAction("Index", "User");
                }
            }
            catch (Exception)
            {
                return RedirectToAction("Index", "User");
            }
        }
        public IActionResult Basic_information()
        {
            try
            {
                var strToken = HttpContext.Session.GetString("JwTokenPos");
                if (strToken != null)
                {
                    return View();
                }
                else
                {
                    return RedirectToAction("Index", "User");
                }
            }
            catch (Exception)
            {
                return RedirectToAction("Index", "User");
            }
        }
        public IActionResult Policy_issuance()
        {
            try
            {
                var strToken = HttpContext.Session.GetString("JwTokenPos");
                if (strToken != null)
                {
                    return View();
                }
                else
                {
                    return RedirectToAction("Index", "User");
                }
            }
            catch (Exception)
            {
                return RedirectToAction("Index", "User");
            }
        }
        public IActionResult Proposal_summary()
        {
            try
            {
                var strToken = HttpContext.Session.GetString("JwTokenPos");
                if (strToken != null)
                {
                    return View();
                }
                else
                {
                    return RedirectToAction("Index", "User");
                }
            }
            catch (Exception)
            {
                return RedirectToAction("Index", "User");
            }
        }

        [HttpPost]
        public async Task<ActionResult> ADD_PARTICIPANT_BASICINFO(int FCDM_DOCUMENT_ID, string FCDM_DOCUMENT_CODE, int FSPM_PRODUCT_ID, string FCDM_OWCUST_FIRSTNAME, string FCDM_OWCUST_MDDLNAME, string FCDM_OWCUST_LASTNAME,
                                                                  string FCDM_OWCUST_CNIC, int FCDM_OW_GENDR_FSCD_ID, DateTime FCDM_OWCUST_DOB,
                                                                  string FCDM_OWCUST_MOBILENO,
                                                                  string FCDM_OWCUST_EMAILADDR, decimal FCDM_OWCUST_HEITACT, int FCDM_OWCUST_HEITUNT,
                                                                  int FCDM_OWCUST_WEITACT, int FCDM_OWCUST_WEITUNT, float FCDM_OWCUST_BMI, int FCDM_OW_CUOCP_FSCD_ID,
                                                                  int FCDM_PFREQ_FSCD_ID, string FCDM_PLAN_CONTRIB, int FCDM_PAYING_TERM, string FCDM_FACE_VALUE,
                                                                  int FCDM_PLAN_CASE_STATUS, int FCDM_COVER_MULTIPLE, int FCDM_CONTRIB_IDX_RATE,
                                                                  int FSAG_AGENT_CODE, int FCDM_FACEVAL_IDX_RATE, int FCDM_OW_FSNT_IDENTYPE_ID, int FCDM_BENEFIT_TERM,
                                                                  int[] FCUQ_CHNLUW_QSN_ID, int[] FSPQS_QSTNR_FSCD_ID, string[] FCUQ_ANSR_YN, int[] FCUQ_PARENT_ID,
                                                                  int[] FCIH_INSUREREXIST_ID, string FCIH_INSUREREXIST_YN, string[] FCIH_POLICY_NO, string[] FCIH_SA_AMOUNT, string[] FCIH_CONTRIB_AMT, DateTime[] FCIH_START_DATE, DateTime[] FCIH_MATURITY_DATE, string[] FCIH_INSURER_PURPOSE, string[] FCIH_INSURER_NM, string[] FCIH_COND_ACCPTNCE,
                                                                  int FCFA_FIN_ID, string FCFA_ANNUAL_INCOME, string FCFA_OTHER_INCOME, string FCFA_TOTAL_INCOME,
                                       string FCFA_EXPENSES_LASTYR, string FCFA_EXPENSES_CURRENTYR, string FCFA_NET_SAVINGS, string FCFA_ADDTNL_DTLS,
                                                                  int[] FSFP_FINQUEST_FSCD_ID, int[] FSFP_FINQUEST_TYPE, int[] FCFN_FINQUEST_PRIORITYNO,
                                                                  int[] FSDI_DISEASE_ID, string[] FCDS_DISEASE_DURATION, string[] FCDS_DISEASE_DETAILS, int CHECK_RIDER, int[] FCDR_DOC_RDR_ID, int[] FSPM_PRODRDR_ID, int[] FCDR_PAYING_TERM, int[] FCDR_FACE_VALUE, IFormFile[] FPDD_PATH,
                               int[] FSCU_RELTN_FSCD_DID, int[] FSCF_AGE, string[] FSCF_STATOFHLTH, string[] FSCF_YEAROFDTH, int[] FSCF_AGEOFDTH, string[] FSCF_CAUSOFDTH, string[] DiseaseDoc)
        {
            PARTICIPANT participant = new PARTICIPANT();
            Rider rider = new Rider();
            DCMNT_QUESTNR dcmnt_questnr = new DCMNT_QUESTNR();
            DISEASE_SELECTION diseases = new DISEASE_SELECTION();
            TAKAFUL_HIST takaful_hist = new TAKAFUL_HIST();
            FINANCIAL_DTLS fin_dtls = new FINANCIAL_DTLS();
            FINANCIAL_NEEDS fin_needs = new FINANCIAL_NEEDS();
            DMSHDR dms_hdr = new DMSHDR();
            DMSDTLS dms_dtls = new DMSDTLS();
            CUSTOMER_FAMILY_HISTRY family = new CUSTOMER_FAMILY_HISTRY();
            int questionsLength;
            int DMSDtlID = 0;

            participant.FCDM_DOCUMENT_ID = FCDM_DOCUMENT_ID;
            participant.FCDM_DOCUMENT_CODE = FCDM_DOCUMENT_CODE;
            participant.FSPM_PRODUCT_ID = FSPM_PRODUCT_ID;
            participant.FCDM_OWCUST_FIRSTNAME = FCDM_OWCUST_FIRSTNAME;
            participant.FCDM_OWCUST_MDDLNAME = FCDM_OWCUST_MDDLNAME;
            participant.FCDM_OWCUST_LASTNAME = FCDM_OWCUST_LASTNAME;
            participant.FCDM_OWCUST_CNIC = FCDM_OWCUST_CNIC;
            participant.FCDM_OW_GENDR_FSCD_ID = FCDM_OW_GENDR_FSCD_ID;
            participant.FCDM_OWCUST_DOB = FCDM_OWCUST_DOB;
            participant.FCDM_OWCUST_MOBILENO = FCDM_OWCUST_MOBILENO;
            participant.FCDM_OWCUST_EMAILADDR = FCDM_OWCUST_EMAILADDR;
            participant.FCDM_OWCUST_HEITACT = FCDM_OWCUST_HEITACT;
            participant.FCDM_OWCUST_HEITUNT = FCDM_OWCUST_HEITUNT;
            participant.FCDM_OWCUST_WEITACT = FCDM_OWCUST_WEITACT;
            participant.FCDM_OWCUST_WEITUNT = FCDM_OWCUST_WEITUNT;
            participant.FCDM_OWCUST_BMI = FCDM_OWCUST_BMI;
            participant.FCDM_OW_CUOCP_FSCD_ID = FCDM_OW_CUOCP_FSCD_ID;
            participant.FCDM_OWCUST_ANNUINCOME = int.Parse(FCFA_ANNUAL_INCOME.Replace(",",""));
            //participant.FCDM_OWCUST_ANNUINCOME = FCFA_NET_SAVINGS;
            participant.FCDM_PFREQ_FSCD_ID = FCDM_PFREQ_FSCD_ID;
            participant.FCDM_PLAN_CONTRIB = int.Parse(FCDM_PLAN_CONTRIB.Replace(",", ""));
            participant.FCDM_PAYING_TERM = FCDM_PAYING_TERM;
            participant.FCDM_PLAN_CASE_STATUS = FCDM_PLAN_CASE_STATUS;
            participant.FCDM_COVER_MULTIPLE = FCDM_COVER_MULTIPLE;
            participant.FCDM_CONTRIB_IDX_RATE = FCDM_CONTRIB_IDX_RATE;
            participant.FCDM_FACEVAL_IDX_RATE = FCDM_FACEVAL_IDX_RATE;
            participant.FCDM_OW_FSNT_IDENTYPE_ID = FCDM_OW_FSNT_IDENTYPE_ID;
            participant.FCDM_FACE_VALUE = int.Parse(FCDM_FACE_VALUE.Replace(",", ""));
            participant.FSAG_AGENT_CODE = FSAG_AGENT_CODE;
            var strToken = HttpContext.Session.GetString("JwToken");
            if (strToken == null)
            {
                strToken = HttpContext.Session.GetString("JwTokenPos");
            }
            string DocumentNoValue = "";
            string DocumentCodeValue = "";
            string CustomerCodeValue = "";
            string customerCNIC = "";
            int count;
            List<string> DMSIDList = new List<string>();
            using (var handler = new HttpClientHandler())
            {
                // allow the bad certificate
                handler.ServerCertificateCustomValidationCallback = (request, cert, chain, errors) => true;

                using (var client = new HttpClient(handler))
                {
                    SendRequest = null;
                    try
                    {
                        SendRequest = new StringContent(JsonConvert.SerializeObject(participant), Encoding.UTF8, "application/json");
                        var Token = strToken.Replace("{", "}");
                        client.BaseAddress = new Uri(Add_DcmntInfo);
                        var contentType = new MediaTypeWithQualityHeaderValue("application/json");
                        client.DefaultRequestHeaders.Accept.Add(contentType);
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Token);

                        /***************Partcipant Basic Info Insert*********************/
                        using (var response = await client.PostAsync(Add_DcmntInfo, SendRequest))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            var dict2 = JArray.Parse(apiResponse);
                            foreach (JObject DocCodeArr in dict2.Children<JObject>())
                            {
                                DocumentNoValue = DocCodeArr["NEW_GEN_ID"].ToString();
                                DocumentCodeValue = DocCodeArr["NEW_GEN_CODE"].ToString();
                                CustomerCodeValue = DocCodeArr["NEW_GENT_CUST_CODE"].ToString();
                            }
                            TempData["DocumentNoValue"] = DocumentNoValue;
                            TempData["DocumentCodeValue"] = DocumentCodeValue;
                            TempData["CustomerCodeValue"] = CustomerCodeValue;
                            TempData["successDocument"] = "Data has been saved Succesfully!";
                        }
                        int Document_ID = int.Parse(DocumentNoValue);

                        //riders addition
                        if (CHECK_RIDER == 1)
                        {
                            for (int i = 0; i <= FSPM_PRODRDR_ID.Length - 1; i++)
                            {
                                rider.FCDR_DOC_RDR_ID = FCDR_DOC_RDR_ID[i];
                                rider.FCDM_DOCUMENT_ID = Document_ID;
                                rider.FSPM_PRODRDR_ID = FSPM_PRODRDR_ID[i];
                                rider.FCDR_PAYING_TERM = FCDR_PAYING_TERM[i];
                                rider.FCDR_FACE_VALUE = FCDR_FACE_VALUE[i];
                                try
                                {
                                    SendRequest = new StringContent(JsonConvert.SerializeObject(rider), Encoding.UTF8, "application/json");
                                    using (var response = await client.PostAsync(Add_Rider_Dtls, SendRequest))
                                    {
                                        string apiResponse = await response.Content.ReadAsStringAsync();
                                    }
                                }
                                catch (Exception ex)
                                {
                                    TempData["successDocument"] = ex.ToString();
                                }
                            }
                        }
                        if (int.Parse(FCDM_PLAN_CONTRIB.Replace(",", "")) >= 500000)
                        {
                            questionsLength = FSPQS_QSTNR_FSCD_ID.Length;
                        }
                        else
                        {
                            questionsLength = FSPQS_QSTNR_FSCD_ID.Length - 5;
                        }

                        //medical info insert
                        for (int i = 0; i <= questionsLength - 1; i++)
                        {
                            //dcmnt_questnr.FCUQ_CHNLUW_QSN_ID = FCUQ_CHNLUW_QSN_ID[i];
                            dcmnt_questnr.FCDM_DOCUMENT_ID = Document_ID;
                            dcmnt_questnr.FSPM_PRODUCT_ID = FSPM_PRODUCT_ID;
                            dcmnt_questnr.FSPQS_QSTNR_FSCD_ID = FSPQS_QSTNR_FSCD_ID[i];
                            dcmnt_questnr.FCUQ_ANSR_YN = FCUQ_ANSR_YN[i];
                            try
                            {
                                SendRequest = new StringContent(JsonConvert.SerializeObject(dcmnt_questnr), Encoding.UTF8, "application/json");
                                using (var response = await client.PostAsync(Add_MedicalInfo, SendRequest))
                                {
                                    string apiResponse = await response.Content.ReadAsStringAsync();
                                }
                            }
                            catch (Exception ex)
                            {
                                TempData["successDocument"] = ex.ToString();
                            }
                        }



                        //if (FSPQS_QSTNR_FSCD_ID[0] == 3541 || FSPQS_QSTNR_FSCD_ID[1] == 3542 || FSPQS_QSTNR_FSCD_ID[3] == 3641 || FSPQS_QSTNR_FSCD_ID[4] == 3642 || FSPQS_QSTNR_FSCD_ID[7] == 3645 && FCUQ_ANSR_YN[0] == "Y" || FCUQ_ANSR_YN[1] == "Y" || FCUQ_ANSR_YN[3] == "Y" || FCUQ_ANSR_YN[4] == "Y" || FCUQ_ANSR_YN[7] == "Y")  //CORRECT THIS CONDITION
                        //{
                        //    //Diseases info insert if any
                        //    for (int i = 0; i <= FSDI_DISEASE_ID.Length - 1; i++)
                        //    {
                        //        if (FSDI_DISEASE_ID[i] <= 26)
                        //        {
                        //            diseases.FSDI_DISEASE_ID = FSDI_DISEASE_ID[i];
                        //            diseases.FCDM_DOCUMENT_ID = Document_ID;
                        //            diseases.FSPQS_QSTNR_FSCD_ID = 3541;
                        //            diseases.FCDS_DISEASE_DURATION = FCDS_DISEASE_DURATION[i];
                        //            diseases.FCDS_DISEASE_DETAILS = FCDS_DISEASE_DETAILS[i];
                        //            diseases.FCDS_STATUS = "Y";
                        //            diseases.FCDS_CRUSER = 1;
                        //            diseases.FCDS_CRDATE = DateTime.Today;
                        //        }
                        //        if (FSDI_DISEASE_ID[i] >= 27 && FSDI_DISEASE_ID[i] <= 33)
                        //        {
                        //            diseases.FSDI_DISEASE_ID = FSDI_DISEASE_ID[i];
                        //            diseases.FCDM_DOCUMENT_ID = Document_ID;
                        //            diseases.FSPQS_QSTNR_FSCD_ID = 3542;
                        //            diseases.FCDS_DISEASE_DETAILS = FCDS_DISEASE_DETAILS[i];
                        //            diseases.FCDS_STATUS = "Y";
                        //            diseases.FCDS_CRUSER = 1;
                        //            diseases.FCDS_CRDATE = DateTime.Today;
                        //        }
                        //        if (FSDI_DISEASE_ID[i] >= 34 && FSDI_DISEASE_ID[i] <= 36)
                        //        {
                        //            diseases.FSDI_DISEASE_ID = FSDI_DISEASE_ID[i];
                        //            diseases.FCDM_DOCUMENT_ID = Document_ID;
                        //            diseases.FSPQS_QSTNR_FSCD_ID = 3641;
                        //            diseases.FCDS_DISEASE_DETAILS = FCDS_DISEASE_DETAILS[i];
                        //            diseases.FCDS_STATUS = "Y";
                        //            diseases.FCDS_CRUSER = 1;
                        //            diseases.FCDS_CRDATE = DateTime.Today;
                        //        }
                        //        if (FSDI_DISEASE_ID[i] >= 37 && FSDI_DISEASE_ID[i] <= 40)
                        //        {
                        //            diseases.FSDI_DISEASE_ID = FSDI_DISEASE_ID[i];
                        //            diseases.FCDM_DOCUMENT_ID = Document_ID;
                        //            diseases.FSPQS_QSTNR_FSCD_ID = 3642;
                        //            diseases.FCDS_DISEASE_DETAILS = FCDS_DISEASE_DETAILS[i];
                        //            diseases.FCDS_STATUS = "Y";
                        //            diseases.FCDS_CRUSER = 1;
                        //            diseases.FCDS_CRDATE = DateTime.Today;
                        //        }
                        //        if (FSDI_DISEASE_ID[i] >= 41)
                        //        {
                        //            diseases.FSDI_DISEASE_ID = FSDI_DISEASE_ID[i];
                        //            diseases.FCDM_DOCUMENT_ID = Document_ID;
                        //            diseases.FSPQS_QSTNR_FSCD_ID = 3645;
                        //            diseases.FCDS_DISEASE_DETAILS = FCDS_DISEASE_DETAILS[i];
                        //            diseases.FCDS_STATUS = "Y";
                        //            diseases.FCDS_CRUSER = 1;
                        //            diseases.FCDS_CRDATE = DateTime.Today;
                        //        }
                        //        try
                        //        {
                        //            SendRequest = new StringContent(JsonConvert.SerializeObject(diseases), Encoding.UTF8, "application/json");
                        //            using (var response = await client.PostAsync(Add_DiseasesInfo, SendRequest))
                        //            {
                        //                string apiResponse = await response.Content.ReadAsStringAsync();
                        //            }
                        //        }
                        //        catch (Exception ex)
                        //        {
                        //            TempData["successDocument"] = ex.ToString();
                        //        }
                        //    }
                        //}
                        //if(FSPQS_QSTNR_FSCD_ID[5] == 3643 && FCUQ_ANSR_YN[5] == "Y")
                        //{
                        //    for(int i = 0; i <= FSCU_RELTN_FSCD_DID.Length - 1; i++)
                        //    {
                        //        family.FSCU_CUSTOMER_CODE = int.Parse(CustomerCodeValue);
                        //        family.FSCU_RELTN_FSCD_DID = FSCU_RELTN_FSCD_DID[i];
                        //        family.FSCF_AGE = FSCF_AGE[i];
                        //        family.FSCF_STATOFHLTH = FSCF_STATOFHLTH[i];
                        //        family.FSCF_AGEOFDTH = FSCF_AGEOFDTH[i];
                        //        family.FSCF_YEAROFDTH = FSCF_YEAROFDTH[i];
                        //        family.FSCF_CAUSOFDTH = FSCF_CAUSOFDTH[i];
                        //        family.FSCF_CRUSER = 1;
                        //        family.FSCF_CRDATE = DateTime.Now;
                        //        try
                        //        {
                        //            SendRequest = new StringContent(JsonConvert.SerializeObject(family), Encoding.UTF8, "application/json");
                        //            using (var response = await client.PostAsync(Add_familyhistory, SendRequest))
                        //            {
                        //                string apiResponse = await response.Content.ReadAsStringAsync();
                        //            }
                        //        }
                        //        catch (Exception ex)
                        //        {
                        //            TempData["successDocument"] = ex.ToString();
                        //        }
                        //    }
                        //}



                        //MEDICAL DOCUMENTS UPLOAD 
                        dms_hdr.FPDH_DMSCUS_CNIC = FCDM_OWCUST_CNIC.Replace("-", "");
                        dms_hdr.FPDH_DESCRIPTION = "Medical documents";
                        dms_hdr.FPDH_SHORT_DESCR = "Medical documents";
                        dms_hdr.FPDH_STATUS = "Y";
                        dms_hdr.FPDH_APPROVED_YN = "Y";
                        dms_hdr.FPDH_CRUSER = 1;
                        dms_hdr.FPDH_CRDATE = DateTime.Now;
                        try
                        {
                            SendRequest = new StringContent(JsonConvert.SerializeObject(dms_hdr), Encoding.UTF8, "application/json");
                            using (var response = await client.PostAsync(Add_DMS, SendRequest))
                            {
                                string apiResponse = await response.Content.ReadAsStringAsync();
                                var dict = JArray.Parse(apiResponse);
                                foreach (JObject dms in dict.Children<JObject>())
                                {
                                    dms_hdr.FPDH_DMSHDR_ID = int.Parse(dms["NEW_DMSHDR_ID"].ToString());
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            TempData["successDocument"] = ex.ToString();
                        }

                        if (FSPQS_QSTNR_FSCD_ID[0] == 3541 || FSPQS_QSTNR_FSCD_ID[1] == 3542 || FSPQS_QSTNR_FSCD_ID[3] == 3641 || FSPQS_QSTNR_FSCD_ID[4] == 3642 || FSPQS_QSTNR_FSCD_ID[7] == 3645 && FCUQ_ANSR_YN[0] == "Y" || FCUQ_ANSR_YN[1] == "Y" || FCUQ_ANSR_YN[3] == "Y" || FCUQ_ANSR_YN[4] == "Y" || FCUQ_ANSR_YN[7] == "Y")  //CORRECT THIS CONDITION
                        {
                            //Diseases info insert if any
                            for (int i = 0; i <= FSDI_DISEASE_ID.Length - 1; i++)
                            {
                                if (FSDI_DISEASE_ID[i] <= 26)
                                {
                                    diseases.FSDI_DISEASE_ID = FSDI_DISEASE_ID[i];
                                    diseases.FCDM_DOCUMENT_ID = Document_ID;
                                    diseases.FSPQS_QSTNR_FSCD_ID = 3541;
                                    diseases.FCDS_DISEASE_DURATION = FCDS_DISEASE_DURATION[i];
                                    diseases.FCDS_DISEASE_DETAILS = FCDS_DISEASE_DETAILS[i];
                                    diseases.FCDS_STATUS = "Y";
                                    diseases.FCDS_CRUSER = 1;
                                    diseases.FCDS_CRDATE = DateTime.Today;
                                    if(DiseaseDoc[i] != "none")
                                    {
                                        count = DMSIDList.Count();
                                        var img = await uploadFile(FPDD_PATH[count]);
                                        dms_dtls.FPDH_DMSHDR_ID = dms_hdr.FPDH_DMSHDR_ID;
                                        dms_dtls.FPDD_PATH = img;
                                        dms_dtls.FPDD_DESC = "Diseases ID " + diseases.FSDI_DISEASE_ID;
                                        SendRequest = new StringContent(JsonConvert.SerializeObject(dms_dtls), Encoding.UTF8, "application/json");

                                        using (var response = await client.PostAsync(Add_DMS_DETAILS, SendRequest))
                                        {
                                            string apiResponse = await response.Content.ReadAsStringAsync();
                                            var dict2 = JArray.Parse(apiResponse);
                                            foreach (JObject DMSDtl in dict2.Children<JObject>())
                                            {
                                                DMSDtlID = int.Parse(DMSDtl["NEW_DMSDTL_ID"].ToString());
                                                DMSIDList.Add(DMSDtlID + "");
                                            }
                                        }
                                    }
                                    diseases.FPDD_DMSDTL_ID = DMSDtlID;
                                }
                                if (FSDI_DISEASE_ID[i] >= 27 && FSDI_DISEASE_ID[i] <= 33)
                                {
                                    diseases.FSDI_DISEASE_ID = FSDI_DISEASE_ID[i];
                                    diseases.FCDM_DOCUMENT_ID = Document_ID;
                                    diseases.FSPQS_QSTNR_FSCD_ID = 3542;
                                    diseases.FCDS_DISEASE_DETAILS = FCDS_DISEASE_DETAILS[i];
                                    diseases.FCDS_STATUS = "Y";
                                    diseases.FCDS_CRUSER = 1;
                                    diseases.FCDS_CRDATE = DateTime.Today;
                                    if (DiseaseDoc[i] != "none")
                                    {
                                        count = DMSIDList.Count();
                                        var img = await uploadFile(FPDD_PATH[count]);
                                        dms_dtls.FPDH_DMSHDR_ID = dms_hdr.FPDH_DMSHDR_ID;
                                        dms_dtls.FPDD_PATH = img;
                                        dms_dtls.FPDD_DESC = "Diseases ID " + diseases.FSDI_DISEASE_ID;
                                        SendRequest = new StringContent(JsonConvert.SerializeObject(dms_dtls), Encoding.UTF8, "application/json");

                                        using (var response = await client.PostAsync(Add_DMS_DETAILS, SendRequest))
                                        {
                                            string apiResponse = await response.Content.ReadAsStringAsync();
                                            var dict2 = JArray.Parse(apiResponse);
                                            foreach (JObject DMSDtl in dict2.Children<JObject>())
                                            {
                                                DMSDtlID = int.Parse(DMSDtl["NEW_DMSDTL_ID"].ToString());
                                                DMSIDList.Add(DMSDtlID + "");
                                            }
                                        }
                                    }
                                    diseases.FPDD_DMSDTL_ID = DMSDtlID;
                                }
                                if (FSDI_DISEASE_ID[i] >= 34 && FSDI_DISEASE_ID[i] <= 36)
                                {
                                    diseases.FSDI_DISEASE_ID = FSDI_DISEASE_ID[i];
                                    diseases.FCDM_DOCUMENT_ID = Document_ID;
                                    diseases.FSPQS_QSTNR_FSCD_ID = 3641;
                                    diseases.FCDS_DISEASE_DETAILS = FCDS_DISEASE_DETAILS[i];
                                    diseases.FCDS_STATUS = "Y";
                                    diseases.FCDS_CRUSER = 1;
                                    diseases.FCDS_CRDATE = DateTime.Today;
                                    if (DiseaseDoc[i] != "none")
                                    {
                                        count = DMSIDList.Count();
                                        var img = await uploadFile(FPDD_PATH[count]);
                                        dms_dtls.FPDH_DMSHDR_ID = dms_hdr.FPDH_DMSHDR_ID;
                                        dms_dtls.FPDD_PATH = img;
                                        dms_dtls.FPDD_DESC = "Diseases ID " + diseases.FSDI_DISEASE_ID;
                                        SendRequest = new StringContent(JsonConvert.SerializeObject(dms_dtls), Encoding.UTF8, "application/json");

                                        using (var response = await client.PostAsync(Add_DMS_DETAILS, SendRequest))
                                        {
                                            string apiResponse = await response.Content.ReadAsStringAsync();
                                            var dict2 = JArray.Parse(apiResponse);
                                            foreach (JObject DMSDtl in dict2.Children<JObject>())
                                            {
                                                DMSDtlID = int.Parse(DMSDtl["NEW_DMSDTL_ID"].ToString());
                                                DMSIDList.Add(DMSDtlID + "");
                                            }
                                        }
                                    }
                                    diseases.FPDD_DMSDTL_ID = DMSDtlID;
                                }
                                if (FSDI_DISEASE_ID[i] >= 37 && FSDI_DISEASE_ID[i] <= 40)
                                {
                                    diseases.FSDI_DISEASE_ID = FSDI_DISEASE_ID[i];
                                    diseases.FCDM_DOCUMENT_ID = Document_ID;
                                    diseases.FSPQS_QSTNR_FSCD_ID = 3642;
                                    diseases.FCDS_DISEASE_DETAILS = FCDS_DISEASE_DETAILS[i];
                                    diseases.FCDS_STATUS = "Y";
                                    diseases.FCDS_CRUSER = 1;
                                    diseases.FCDS_CRDATE = DateTime.Today;
                                    if (DiseaseDoc[i] != "none")
                                    {
                                        count = DMSIDList.Count();
                                        var img = await uploadFile(FPDD_PATH[count]);
                                        dms_dtls.FPDH_DMSHDR_ID = dms_hdr.FPDH_DMSHDR_ID;
                                        dms_dtls.FPDD_PATH = img;
                                        dms_dtls.FPDD_DESC = "Diseases ID " + diseases.FSDI_DISEASE_ID;
                                        SendRequest = new StringContent(JsonConvert.SerializeObject(dms_dtls), Encoding.UTF8, "application/json");

                                        using (var response = await client.PostAsync(Add_DMS_DETAILS, SendRequest))
                                        {
                                            string apiResponse = await response.Content.ReadAsStringAsync();
                                            var dict2 = JArray.Parse(apiResponse);
                                            foreach (JObject DMSDtl in dict2.Children<JObject>())
                                            {
                                                DMSDtlID = int.Parse(DMSDtl["NEW_DMSDTL_ID"].ToString());
                                                DMSIDList.Add(DMSDtlID + "");
                                            }
                                        }
                                    }
                                    diseases.FPDD_DMSDTL_ID = DMSDtlID;
                                }
                                if (FSDI_DISEASE_ID[i] >= 41)
                                {
                                    diseases.FSDI_DISEASE_ID = FSDI_DISEASE_ID[i];
                                    diseases.FCDM_DOCUMENT_ID = Document_ID;
                                    diseases.FSPQS_QSTNR_FSCD_ID = 3645;
                                    diseases.FCDS_DISEASE_DETAILS = FCDS_DISEASE_DETAILS[i];
                                    diseases.FCDS_STATUS = "Y";
                                    diseases.FCDS_CRUSER = 1;
                                    diseases.FCDS_CRDATE = DateTime.Today;
                                    if (DiseaseDoc[i] != "none")
                                    {
                                        count = DMSIDList.Count();
                                        var img = await uploadFile(FPDD_PATH[count]);
                                        dms_dtls.FPDH_DMSHDR_ID = dms_hdr.FPDH_DMSHDR_ID;
                                        dms_dtls.FPDD_PATH = img;
                                        dms_dtls.FPDD_DESC = "Diseases ID " + diseases.FSDI_DISEASE_ID;
                                        SendRequest = new StringContent(JsonConvert.SerializeObject(dms_dtls), Encoding.UTF8, "application/json");

                                        using (var response = await client.PostAsync(Add_DMS_DETAILS, SendRequest))
                                        {
                                            string apiResponse = await response.Content.ReadAsStringAsync();
                                            var dict2 = JArray.Parse(apiResponse);
                                            foreach (JObject DMSDtl in dict2.Children<JObject>())
                                            {
                                                DMSDtlID = int.Parse(DMSDtl["NEW_DMSDTL_ID"].ToString());
                                                DMSIDList.Add(DMSDtlID + "");
                                            }
                                        }
                                    }
                                    diseases.FPDD_DMSDTL_ID = DMSDtlID;
                                }

                                try
                                {
                                    SendRequest = new StringContent(JsonConvert.SerializeObject(diseases), Encoding.UTF8, "application/json");
                                    using (var response = await client.PostAsync(Add_DiseasesInfo, SendRequest))
                                    {
                                        string apiResponse = await response.Content.ReadAsStringAsync();
                                    }
                                }
                                catch (Exception ex)
                                {
                                    TempData["successDocument"] = ex.ToString();
                                }
                            }
                        }
                        if (FSPQS_QSTNR_FSCD_ID[5] == 3643 && FCUQ_ANSR_YN[5] == "Y")
                        {
                            for (int i = 0; i <= FSCU_RELTN_FSCD_DID.Length - 1; i++)
                            {
                                family.FSCU_CUSTOMER_CODE = int.Parse(CustomerCodeValue);
                                family.FSCU_RELTN_FSCD_DID = FSCU_RELTN_FSCD_DID[i];
                                family.FSCF_AGE = FSCF_AGE[i];
                                family.FSCF_STATOFHLTH = FSCF_STATOFHLTH[i];
                                family.FSCF_AGEOFDTH = FSCF_AGEOFDTH[i];
                                family.FSCF_YEAROFDTH = FSCF_YEAROFDTH[i];
                                family.FSCF_CAUSOFDTH = FSCF_CAUSOFDTH[i];
                                family.FSCF_CRUSER = 1;
                                family.FSCF_CRDATE = DateTime.Now;
                                try
                                {
                                    SendRequest = new StringContent(JsonConvert.SerializeObject(family), Encoding.UTF8, "application/json");
                                    using (var response = await client.PostAsync(Add_familyhistory, SendRequest))
                                    {
                                        string apiResponse = await response.Content.ReadAsStringAsync();
                                    }
                                }
                                catch (Exception ex)
                                {
                                    TempData["successDocument"] = ex.ToString();
                                }
                            }
                        }

                        //for (int i = 0; i < FPDD_PATH.Length; i++)
                        //{
                        //    var img = await uploadFile(FPDD_PATH[i]);
                        //    dms_dtls.FPDH_DMSHDR_ID = dms_hdr.FPDH_DMSHDR_ID;
                        //    dms_dtls.FPDD_PATH = img;
                        //    dms_dtls.FPDD_DESC = "Diseases";
                        //    SendRequest = new StringContent(JsonConvert.SerializeObject(dms_dtls), Encoding.UTF8, "application/json");

                        //    using (var response = await client.PostAsync(Add_DMS_DETAILS, SendRequest))
                        //    {
                        //        string apiResponse = await response.Content.ReadAsStringAsync();
                        //        var dict2 = JArray.Parse(apiResponse);
                        //        foreach (JObject DMSDtl in dict2.Children<JObject>())
                        //        {
                        //            DMSDtlID = int.Parse(DMSDtl["NEW_DMSDTL_ID"].ToString());
                        //            DMSIDs.Add(DMSDtlID + "");
                        //        }
                        //    }
                        //}

                        //Console.WriteLine(DMSIDs);
                        //***************need analysis form data*******************//
                        customerCNIC = FCDM_OWCUST_CNIC.Replace("-", "");

                        //Takaful History
                        if (FCIH_INSUREREXIST_YN == "N")
                        {
                            takaful_hist.SUM_SYS_USER_CODE = customerCNIC;
                            takaful_hist.FCIH_INSUREREXIST_ID = FCIH_INSUREREXIST_ID[0];
                            takaful_hist.FCIH_INSUREREXIST_YN = FCIH_INSUREREXIST_YN;
                            takaful_hist.FCIH_POLICY_NO = "";
                            takaful_hist.FCIH_SA_AMOUNT = 0;
                            takaful_hist.FCIH_CONTRIB_AMT = 0;
                            //takaful_hist.FCIH_START_DATE = ;
                            //takaful_hist.FCIH_MATURITY_DATE = ""
                            takaful_hist.FCIH_INSURER_PURPOSE = "";
                            takaful_hist.FCIH_INSURER_NM = "";
                            takaful_hist.FCIH_COND_ACCPTNCE = "";
                            takaful_hist.FCIH_CRDATE = DateTime.Today;
                            try
                            {
                                SendRequest = new StringContent(JsonConvert.SerializeObject(takaful_hist), Encoding.UTF8, "application/json");
                                using (var response = await client.PostAsync(Add_TakafulHist, SendRequest))
                                {
                                    string apiResponse = await response.Content.ReadAsStringAsync();
                                }
                            }
                            catch (Exception ex)
                            {
                                TempData["successDocument"] = ex.ToString();
                            }
                        }
                        if (FCIH_INSUREREXIST_YN == "Y")
                        {
                            for (int i = 0; i <= FCIH_POLICY_NO.Length - 1; i++)
                            {
                                takaful_hist.FCIH_INSUREREXIST_ID = FCIH_INSUREREXIST_ID[i];
                                takaful_hist.SUM_SYS_USER_CODE = customerCNIC;
                                takaful_hist.FCIH_INSUREREXIST_YN = FCIH_INSUREREXIST_YN;
                                takaful_hist.FCIH_POLICY_NO = FCIH_POLICY_NO[i];
                                takaful_hist.FCIH_SA_AMOUNT = int.Parse(FCIH_SA_AMOUNT[i].Replace(",", ""));
                                takaful_hist.FCIH_CONTRIB_AMT = int.Parse(FCIH_CONTRIB_AMT[i].Replace(",", ""));
                                takaful_hist.FCIH_START_DATE = FCIH_START_DATE[i];
                                takaful_hist.FCIH_MATURITY_DATE = FCIH_MATURITY_DATE[i];
                                takaful_hist.FCIH_INSURER_PURPOSE = FCIH_INSURER_PURPOSE[i];
                                takaful_hist.FCIH_INSURER_NM = FCIH_INSURER_NM[i];
                                takaful_hist.FCIH_COND_ACCPTNCE = FCIH_COND_ACCPTNCE[i];
                                takaful_hist.FCIH_CRDATE = DateTime.Today;
                                try
                                {
                                    SendRequest = new StringContent(JsonConvert.SerializeObject(takaful_hist), Encoding.UTF8, "application/json");
                                    //client.BaseAddress = new Uri(Add_TakafulHist);
                                    using (var response = await client.PostAsync(Add_TakafulHist, SendRequest))
                                    {
                                        string apiResponse = await response.Content.ReadAsStringAsync();
                                    }
                                }
                                catch (Exception ex)
                                {
                                    TempData["successDocument"] = ex.ToString();
                                }
                            }
                        }

                        //Financial details
                        fin_dtls.FCFA_FIN_ID = FCFA_FIN_ID;
                        fin_dtls.SUM_SYS_USER_CODE = customerCNIC;
                        fin_dtls.FCFA_ANNUAL_INCOME = int.Parse(FCFA_ANNUAL_INCOME.Replace(",", ""));
                        if (FCFA_OTHER_INCOME != null)
                        {
                            fin_dtls.FCFA_OTHER_INCOME = int.Parse(FCFA_OTHER_INCOME.Replace(",", ""));
                        }
                        fin_dtls.FCFA_TOTAL_INCOME = int.Parse(FCFA_TOTAL_INCOME.Replace(",", ""));
                        //fin_dtls.FCFA_CUST_EXPENSES = int.Parse(FCFA_CUST_EXPENSES.Replace(",", ""));
                        fin_dtls.FCFA_EXPENSES_LASTYR = int.Parse(FCFA_EXPENSES_LASTYR.Replace(",", ""));
                        fin_dtls.FCFA_EXPENSES_CURRENTYR = int.Parse(FCFA_EXPENSES_CURRENTYR.Replace(",", ""));
                        fin_dtls.FCFA_NET_SAVINGS = int.Parse(FCFA_NET_SAVINGS.Replace(",", ""));
                        fin_dtls.FCFA_ADDTNL_DTLS = FCFA_ADDTNL_DTLS;
                        fin_dtls.FCFA_CRDATE = DateTime.Today;
                        try
                        {
                            SendRequest = new StringContent(JsonConvert.SerializeObject(fin_dtls), Encoding.UTF8, "application/json");
                            using (var response = await client.PostAsync(Add_FinancialDtls, SendRequest))
                            {
                                string apiResponse = await response.Content.ReadAsStringAsync();
                            }
                        }
                        catch (Exception ex)
                        {
                            TempData["successDocument"] = ex.ToString();
                        }

                        //financial needs
                        for (int i = 0; i <= FSFP_FINQUEST_FSCD_ID.Length - 1; i++)
                        {
                            fin_needs.SUM_SYS_USER_CODE = customerCNIC;
                            fin_needs.FSFP_FINQUEST_FSCD_ID = FSFP_FINQUEST_FSCD_ID[i];
                            fin_needs.FSFP_FINQUEST_TYPE = FSFP_FINQUEST_TYPE[i];
                            fin_needs.FCFN_FINQUEST_PRIORITYNO = FCFN_FINQUEST_PRIORITYNO[i];
                            fin_needs.FCFN_CRDATE = DateTime.Today;
                            try
                            {
                                SendRequest = new StringContent(JsonConvert.SerializeObject(fin_needs), Encoding.UTF8, "application/json");
                                using (var response = await client.PostAsync(Add_FinancialNeeds, SendRequest))
                                {
                                    string apiResponse = await response.Content.ReadAsStringAsync();
                                }
                            }
                            catch (Exception ex)
                            {
                                TempData["successDocument"] = ex.ToString();
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        TempData["successCode"] = ex.ToString();
                    }
                    return RedirectToAction("Illustration");
                }
            }
        }

        [HttpPost]
        public async Task<ActionResult> POS_USER_CREATION(int SUM_SYS_USER_ID, string SUM_SYS_USER_CODE, string SUM_FULL_NAME, string USER_NAME,
                                                          int FSDS_DESIGN_ID, string SUM_USER_EMAIL_ADDR, DateTime SUM_CUST_DOB, string SUM_CUST_CONTPHONE,
                                                          string SUM_CUST_OTP, int SUM_CRUSER, DateTime SUM_CRDATE)
        {
            POS_USER user = new POS_USER();
            userMaster user_master = new userMaster();
            string JWTToken = null;
            ViewBag.TOKEN = null;
            LASTLOGIN = SUM_SYS_USER_CODE;

            Random rand = new Random();
            user.SUM_SYS_USER_ID = int.Parse(HttpContext.Session.GetString("POS_SYS_USER_ID"));

            user.SUM_SYS_USER_CODE = SUM_SYS_USER_CODE;
            user.SUM_FULL_NAME = SUM_FULL_NAME;
            user.FSDS_DESIGN_ID = 1;
            user.SUM_USER_EMAIL_ADDR = SUM_USER_EMAIL_ADDR;
            user.SUM_CUST_DOB = SUM_CUST_DOB;
            user.SUM_CUST_CONTPHONE = SUM_CUST_CONTPHONE;
            int otp = rand.Next(100000, 1000000);

            user.SUM_CUST_OTP = otp.ToString();
            user.SUM_CRUSER = 1;
            user.SUM_CRDATE = DateTime.Today;
            var key = Configuration.GetSection("Credentials").GetSection("SymKey").Value;
            int num = rand.Next(1000, 10000);
            USER_NAME = USER_NAME + num;
            user.SUM_USER_PASSWORD = EncryptString(key, USER_NAME).ToString();
            string UserIDValue = "";
            using (var handler = new HttpClientHandler())
            {
                // allow the bad certificate
                handler.ServerCertificateCustomValidationCallback = (request, cert, chain, errors) => true;

                using (var client = new HttpClient(handler))
                {
                    SendRequest = null;
                    try
                    {
                        SendRequest = new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, "application/json");
                        using (var response = await client.PostAsync(Add_UserInfo, SendRequest))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            if (apiResponse != null)
                            {
                                var dict2 = JArray.Parse(apiResponse);
                                foreach (JObject UserArr in dict2.Children<JObject>())
                                {
                                    UserIDValue = UserArr["NEW_USER_ID"].ToString();
                                }
                                TempData["UserIDValue"] = UserIDValue;
                                HttpContext.Session.SetString("SUM_USER_EMAIL_ADDR", SUM_USER_EMAIL_ADDR);
                                HttpContext.Session.SetString("SUM_CUST_CONTPHONE", SUM_CUST_CONTPHONE);
                                HttpContext.Session.SetString("SUM_FULL_NAME", SUM_FULL_NAME);
                            }
                            else
                            {
                                TempData["successUSER"] = "user updated!";
                            }
                        }
                        //Token authenticate
                        user_master.UserName = SUM_SYS_USER_CODE;
                        user_master.Password = user.SUM_USER_PASSWORD;

                        SendRequest = new StringContent(JsonConvert.SerializeObject(user_master), Encoding.UTF8, "application/json");
                        using (var response = await client.PostAsync(checkUserValidate, SendRequest))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            if (apiResponse == "\"Invalid user\"" ||
                                apiResponse == "\"Database Connection fail\"" ||
                                apiResponse == "\"Token Exception!" ||
                                apiResponse == "\"Incorrect credentials. Please try again!\"" ||
                                apiResponse == "\"User account Locked, Please contact System Administrator!\"" ||
                                apiResponse == "\"You have entered an Invalid credentials 3 times User has been Locked\"")
                            {
                                TempData["WrongStatus"] = apiResponse.ToString().Trim('"');
                                return RedirectToAction("Index");
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
                                        ViewBag.TOKEN = JWTToken.ToString();
                                        TempData["Token"] = JWTToken.ToString();
                                    }
                                }
                                string msgText = "<p>Your OTP Verification Code for Salam Family Takaful Customer Portal is " + otp;
                                await this.SendEmail(SUM_FULL_NAME, msgText, SUM_USER_EMAIL_ADDR, "OTP");
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        TempData["successUSER"] = ex.ToString();
                    }
                    return RedirectToAction("Onboarding");
                }
            }
        }


        [HttpPost]
        //[ValidateInput(true)]
        public async Task<ActionResult> POS_USER_LOGIN(string SUM_SYS_USER_CODE, string SUM_USER_PASSWORD)
        {
            userMaster user_master = new userMaster();
            coreUser core_user = new coreUser();
            string JWTToken = null;
            // string CoreJWTToken = null;
            HttpContext.Session.Clear();
            ViewBag.TOKEN = null;
            LASTLOGIN = SUM_SYS_USER_CODE;
            user_master.UserName = SUM_SYS_USER_CODE;
            var key = Configuration.GetSection("Credentials").GetSection("SymKey").Value;
            user_master.Password = EncryptString(key, SUM_USER_PASSWORD);
            //user_master.Password = DecryptString( SUM_USER_PASSWORD);
            core_user.UserName = "POSTEST";
            core_user.Password = "POSTEST";

            using (var handler = new HttpClientHandler())
            {
                // allow the bad certificate
                handler.ServerCertificateCustomValidationCallback = (request, cert, chain, errors) => true;

                using (var client = new HttpClient(handler))
                {
                    SendRequest = null;
                    try
                    {
                        //core authenticate
                        //SendRequest = new StringContent(JsonConvert.SerializeObject(core_user), Encoding.UTF8, "application/json");
                        //using (var response2 = await client.PostAsync(checkCoreUserValidate, SendRequest))
                        //{
                        //    string apiResponse2 = await response2.Content.ReadAsStringAsync();
                        //    if (apiResponse2 == "\"Invalid user\"" ||
                        //        apiResponse2 == "\"Database Connection fail\"" ||
                        //        apiResponse2 == "\"Token Exception!" ||
                        //        apiResponse2 == "\"Incorrect credentials. Please try again!\"" ||
                        //        apiResponse2 == "\"User account Locked, Please contact System Administrator!\"" ||
                        //        apiResponse2 == "\"You have entered an Invalid credentials 3 times User has been Locked\"")
                        //    {
                        //        TempData["WrongStatus"] = apiResponse2.ToString().Trim('"');
                        //        return RedirectToAction("Index");
                        //    }
                        //    else
                        //    {
                        //        var reg2 = new Regex("\".*?\"");
                        //        var matches2 = reg2.Matches((string)apiResponse2);
                        //        for (int i = 1; i < 3; i++)
                        //        {
                        //            if (i == 2)
                        //            {
                        //                CoreJWTToken = (string)matches2[1].ToString().Trim('"');
                        //                HttpContext.Session.SetString("CoreJWTToken", CoreJWTToken);
                        //                //HttpContext.Session.SetString("UserName", UserName);
                        //                ViewBag.CORETOKEN = CoreJWTToken.ToString();
                        //                TempData["GlobalToken"] = CoreJWTToken.ToString();
                        //            }
                        //        }
                        //    }
                        //}

                        SendRequest = new StringContent(JsonConvert.SerializeObject(user_master), Encoding.UTF8, "application/json");
                        using (var response = await client.PostAsync(checkUserValidate, SendRequest))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            if (apiResponse == "\"Invalid user\"" ||
                                apiResponse == "\"Database Connection fail\"" ||
                                apiResponse == "\"Token Exception!" ||
                                apiResponse == "\"Incorrect credentials. Please try again!\"" ||
                                apiResponse == "\"User account Locked, Please contact System Administrator!\"" ||
                                apiResponse == "\"You have entered an Invalid credentials 3 times User has been Locked\"")
                            {
                                TempData["WrongStatus"] = apiResponse.ToString().Trim('"');
                                return RedirectToAction("Index");
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
                                        HttpContext.Session.SetString("JwTokenPos", JWTToken);

                                        ViewBag.TOKEN = JWTToken.ToString();
                                        TempData["TokenIndex"] = JWTToken.ToString();
                                    }
                                }
                                return RedirectToAction("Proposal_summary");
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        TempData["successUSER"] = ex.ToString();
                    }
                    return RedirectToAction("Index");
                }
            }
        }

        [HttpPost]
        public async Task<ActionResult> UPDATE_USER_PASSWD(string SUM_SYS_USER_CODE, string SUM_USER_PASSWORD, string SUM_USER_EMAIL_ADDR)
        {
            POS_USER user = new POS_USER();
            user.SUM_SYS_USER_CODE = SUM_SYS_USER_CODE;
            var key = Configuration.GetSection("Credentials").GetSection("SymKey").Value;
            user.SUM_USER_PASSWORD = EncryptString(key, SUM_USER_PASSWORD);
            var strToken = HttpContext.Session.GetString("JwTokenUser");
            using (var handler = new HttpClientHandler())
            {
                handler.ServerCertificateCustomValidationCallback = (request, cert, chain, errors) => true;

                using (var client = new HttpClient(handler))
                {
                    SendRequest = null;
                    try
                    {
                        SendRequest = new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, "application/json");
                        using (var response = await client.PostAsync(updateUserPswd, SendRequest))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            TempData["WrongStatus"] = "Password Changed Successfully";
                        }
                    }
                    catch (Exception ex)
                    {
                        TempData["WrongStatus"] = ex.ToString();
                    }
                    string msgText = "<p>Your password for Salam Family Takaful Customer Portal has been changed successfully</p><p>If you have not done this transaction please reach out to us</p>";
                    await this.SendEmail("customer", msgText, SUM_USER_EMAIL_ADDR, "Password Changed");
                    HttpContext.Session.Clear();
                    return RedirectToAction("Index");
                }
            }
        }

        [HttpPost]
        public async Task<ActionResult> SaveDMS(int FPDH_DMSHDR_ID, string FPDH_POLICY_NO, string FPDH_DMSCUS_CNIC, int FPDM_POLDOM_ID, int FPDM_POLICY_IDX, string FPDH_DESCRIPTION, string FPDH_SHORT_DESCR, string FPDH_APPROVED_YN, string FPDH_STATUS, DateTime FPDH_FLXFLD_DATE, string FPDH_FLXFLD_VCHAR, int FPDH_FLXFLD_NUMBER, int FPDH_CRUSER, DateTime FPDH_CRDATE, int FPDH_CHKUSER, DateTime FPDH_CHKDATE, int FPDH_AUTHUSER, DateTime FPDH_AUTHDATE, int FPDH_CNCLUSER, DateTime FPDH_CNCLDATE, string FPDH_AUDIT_COMMENTS, string FPDH_USER_IPADDR,
                                               //dMS detail
                                               int[] FPDD_DMSDTL_ID, string FPDD_PATH_front, string FPDD_PATH_back, IFormFile[] FPDD_PATH, int[] FPDD_SERIAL_NO, string[] FPDD_NAME, string[] FPDD_TYPE, DateTime[] FPDD_DATE, /*string FPDD_PATH,*/ string[] FPDD_DESC, string[] FPDD_STATUS, DateTime[] FPDD_FLXFLD_DATE, string[] FPDD_FLXFLD_VCHAR, int[] FPDD_FLXFLD_NUMBER, int[] FPDD_CRUSER, DateTime[] FPDD_CRDATE, int[] FPDD_CHKUSER, DateTime[] FPDD_CHKDATE, int[] FPDD_AUTHUSER, DateTime[] FPDD_AUTHDATE, int[] FPDD_CNCLUSER, DateTime[] FPDD_CNCLDATE, string[] FPDD_AUDIT_COMMENTS, string[] FPDD_USER_IPADDR)
        {
            DMSHDR dmshdr = new DMSHDR();
            DMSDTLS dmsdtl = new DMSDTLS();

            dmshdr.FPDH_POLICY_NO = FPDH_POLICY_NO;
            dmshdr.FPDH_DESCRIPTION = "CNIC";
            dmshdr.FPDH_SHORT_DESCR = "CNIC";
            dmshdr.FPDH_DMSCUS_CNIC = FPDH_DMSCUS_CNIC;
            dmshdr.FPDH_APPROVED_YN = "Y";
            dmshdr.FPDH_STATUS = "N";
            dmshdr.FPDH_CRUSER = 1;
            dmshdr.FPDH_CRDATE = FPDH_CRDATE;
            var strToken = HttpContext.Session.GetString("JwToken");

            string apiResponse = "";

            using (var handler = new HttpClientHandler())
            {
                // allow the bad certificate
                handler.ServerCertificateCustomValidationCallback = (request, cert, chain, errors) => true;

                using (var client1 = new HttpClient(handler))
                {
                    SendRequest = null;
                    if (dmshdr.FPDH_DMSHDR_ID == 0)
                    {
                        try
                        {
                            var Token = strToken.Replace("{", "}");
                            client1.BaseAddress = new Uri(Add_DMS);
                            var contentType = new MediaTypeWithQualityHeaderValue("application/json");
                            client1.DefaultRequestHeaders.Accept.Add(contentType);
                            client1.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Token);
                            SendRequest = new StringContent(JsonConvert.SerializeObject(dmshdr), Encoding.UTF8, "application/json");

                            using (var response = await client1.PostAsync(Add_DMS, SendRequest))
                            {
                                apiResponse = await response.Content.ReadAsStringAsync();
                                //TempData["successPolicMangt"] = " " + apiResponse.Replace('"', ' ').Trim();
                                var dict2 = JArray.Parse(apiResponse);

                                foreach (JObject img_dtls in dict2.Children<JObject>())
                                {
                                    if (img_dtls != null)
                                    {
                                        var address = img_dtls["IDs"];
                                        dmshdr.FPDH_DMSHDR_ID = int.Parse(img_dtls["NEW_DMSHDR_ID"].ToString());
                                        TempData["FPDH_DMSHDR_ID"] = dmshdr.FPDH_DMSHDR_ID;
                                    }
                                }
                            }

                            //DMS Details
                            for (int i = 0; i < FPDD_PATH.Length; i++)
                            {
                                var img = await uploadFile(FPDD_PATH[i]);
                                dmsdtl.FPDH_DMSHDR_ID = dmshdr.FPDH_DMSHDR_ID;
                                dmsdtl.FPDD_PATH = img;
                                //dmsdtl.FPDD_DESC = FPDD_DESC[i];

                                SendRequest = new StringContent(JsonConvert.SerializeObject(dmsdtl), Encoding.UTF8, "application/json");

                                using (var response = await client1.PostAsync(Add_DMS_DETAILS, SendRequest))
                                {
                                    apiResponse = await response.Content.ReadAsStringAsync();
                                }
                            }
                        }
                        catch (Exception ed)
                        {
                            TempData["successDMS"] = ed.ToString();
                        }
                    }
                }
                return RedirectToAction("Basic_information");
            }
        }

        public async Task<string> uploadFile(IFormFile file)
        {
            string webRootPath = _webHostEnvironment.WebRootPath;
            string contentRootPath = _webHostEnvironment.ContentRootPath;
            Random r = new Random();
            string path = "-1";
            string filePath = "-1";
            int random = r.Next();
            if (file != null && file.Length > 0)
            {
                string extension = Path.GetExtension(file.FileName);
                if (extension.ToLower().Equals(".jpg") || extension.ToLower().Equals(".jpeg") || extension.ToLower().Equals(".png") || extension.ToLower().Equals(".pdf"))
                {
                    try
                    {
                        string rootPath = Path.Combine(webRootPath, "upload");
                        if (!Directory.Exists(rootPath))
                        {
                            Directory.CreateDirectory(rootPath);
                        }
                        path = random + Path.GetFileName(file.FileName);
                        filePath = rootPath + "\\" + path;
                        using (FileStream stream = new FileStream(Path.Combine(rootPath, path), FileMode.Create))
                        {
                            file.CopyTo(stream);
                        }
                    }
                    catch (Exception ex)
                    {
                        path = "-1";
                        TempData["successDMS"] = ex.ToString();
                    }
                }
                else
                {
                    await Response.WriteAsync("<script>alert('Only jpg ,jpeg or png formats are acceptable....'); </script>");
                }
            }
            else
            {
                await Response.WriteAsync("<script>alert('Please select a file'); </script>");
                path = "-1";
            }
            return filePath;
        }

        [HttpPost]
        public async Task<ActionResult> ADD_DCMNT_NOMINEE(int[] FCPND_PNMNEDTL_ID, int[] FCDM_DOCUMENT_ID, string[] B_FSCU_IDENTIFICATION_NO, string[] FCPND_NMNEE_NAME,
                                                           int[] FCPND_AGE, int[] FCPND_RELTN_FSCD_ID, int[] FCPND_NMNEE_PERCT,
                                                           int[] FCNGD_NMGRDDTL_ID, string[] G_FSCU_IDENTIFICATION_NO, string[] FCNGD_GUDAN_NAME, int[] FCNGD_AGE)
        {
            DCMNT_NOMINEE dcmnt_nominee = new DCMNT_NOMINEE();
            NOMINEE_GUARDIAN nominee_grdn = new NOMINEE_GUARDIAN();
            var strToken = HttpContext.Session.GetString("JwToken");
            //string NomineeIDValue = "";

            using (var handler = new HttpClientHandler())
            {
                // allow the bad certificate
                handler.ServerCertificateCustomValidationCallback = (request, cert, chain, errors) => true;

                using (var client = new HttpClient(handler))
                {
                    var Token = strToken.Replace("{", "}");
                    client.BaseAddress = new Uri(Add_NomineeInfo);
                    var contentType = new MediaTypeWithQualityHeaderValue("application/json");
                    client.DefaultRequestHeaders.Accept.Add(contentType);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Token);

                    SendRequest = null;
                    for (int i = 0; i <= B_FSCU_IDENTIFICATION_NO.Length - 1; i++)
                    {
                        dcmnt_nominee.FCPND_PNMNEDTL_ID = FCPND_PNMNEDTL_ID[i];
                        dcmnt_nominee.FCDM_DOCUMENT_ID = FCDM_DOCUMENT_ID[i];
                        dcmnt_nominee.FSCU_IDENTIFICATION_NO = B_FSCU_IDENTIFICATION_NO[i];
                        dcmnt_nominee.FCPND_NMNEE_NAME = FCPND_NMNEE_NAME[i];
                        dcmnt_nominee.FCPND_AGE = FCPND_AGE[i];
                        dcmnt_nominee.FCPND_RELTN_FSCD_ID = FCPND_RELTN_FSCD_ID[i];
                        dcmnt_nominee.FCPND_NMNEE_PERCT = FCPND_NMNEE_PERCT[i];
                        try
                        {
                            SendRequest = new StringContent(JsonConvert.SerializeObject(dcmnt_nominee), Encoding.UTF8, "application/json");
                            //Nominee Info Insert
                            using (var response = await client.PostAsync(Add_NomineeInfo, SendRequest))
                            {
                                string apiResponse = await response.Content.ReadAsStringAsync();
                                //var dict2 = JArray.Parse(apiResponse);
                                //foreach (JObject NomineeArr in dict2.Children<JObject>())
                                //{
                                //    NomineeIDValue = NomineeArr["NEW_NOMINEE_ID"].ToString();
                                //}
                                //TempData["NomineeIDValue"] = NomineeIDValue;
                                //TempData["successNominee"] = "Nominee has been saved Succesfully!";
                            }

                            //int Nominee_ID = int.Parse(NomineeIDValue);

                            //guardian info insert
                            //for (int i = 0; i <= G_FSCU_IDENTIFICATION_NO.Length - 1; i++)
                            //{
                            //    nominee_grdn.FCNGD_NMGRDDTL_ID = FCNGD_NMGRDDTL_ID[i];
                            //    nominee_grdn.FCPND_PNMNEDTL_ID = FCPND_PNMNEDTL_ID[i];
                            //    nominee_grdn.FCDM_DOCUMENT_ID = FCDM_DOCUMENT_ID[i];
                            //    nominee_grdn.FSCU_IDENTIFICATION_NO = G_FSCU_IDENTIFICATION_NO[i];
                            //    nominee_grdn.FCNGD_GUDAN_NAME = FCNGD_GUDAN_NAME[i];
                            //    nominee_grdn.FCNGD_AGE = FCNGD_AGE[i];
                            //    try
                            //    {
                            //        SendRequest = new StringContent(JsonConvert.SerializeObject(nominee_grdn), Encoding.UTF8, "application/json");
                            //        using (var response = await client.PostAsync(Add_NomineeGurdInfo, SendRequest))
                            //        {
                            //            string apiResponse = await response.Content.ReadAsStringAsync();
                            //        }
                            //    }
                            //    catch (Exception ex)
                            //    {
                            //        TempData["successDocument"] = ex.ToString();
                            //    }
                            //}

                        }
                        catch (Exception ex)
                        {
                            TempData["successNominee"] = ex.ToString();
                        }
                    }

                    return RedirectToAction("Basic_information");
                }
            }
        }
    }
}