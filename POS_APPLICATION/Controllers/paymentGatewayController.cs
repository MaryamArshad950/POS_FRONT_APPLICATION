using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using POS_APPLICATION.Models;

namespace POS_APPLICATION.Controllers
{
    public class paymentGatewayController : Controller
    {
        IConfiguration configuration;
        static string Result_API = "", IP_Address = "", Port_No = "";
        string userAuthentURL = "",
               paymentOrder = "",
               paymentCard = "",
               paymentEasyPaisa = "",
               paymentNIFT = "",
               payMobSKey = "";
        StringContent SendRequest;
        [Obsolete]
        public paymentGatewayController(IConfiguration _Configuration)
        {
            configuration = _Configuration;
            GetIPHostAPI();
        }
        public string GetIPHostAPI()
        {
            IP_Address = configuration.GetSection("Endpoint").GetSection("ILCORE_API_IP").Value;
            Port_No = configuration.GetSection("Endpoint").GetSection("ILCORE_API_PNO").Value;
            paymentEasyPaisa = configuration.GetSection("paymentConfig").GetSection("paymentEasyPaisa").Value;
            paymentNIFT = configuration.GetSection("paymentConfig").GetSection("paymentNIFT").Value;
            Result_API = IP_Address + ":" + Port_No;
            ViewData["GetIPHostAPI"] = Result_API;
            return Result_API;
        }
        public async Task<ActionResult> paymobPaymentUserAuthent(string P_DOCUMENT_ID, int FIPR_COLL_AMOUNT, string PaymentType)
        {
            payMobSKey = configuration.GetSection("paymentConfig").GetSection("SalaampmKey").Value;
            userAuthentURL = configuration.GetSection("paymentConfig").GetSection("ULoginURL").Value;
            UserAuthen payMobUser = new UserAuthen();
            var handler = new HttpClientHandler();
            string CustEmailAddr = HttpContext.Session.GetString("SUM_USER_EMAIL_ADDR");
            string CustPhone = HttpContext.Session.GetString("SUM_CUST_CONTPHONE");
            handler.ClientCertificateOptions = ClientCertificateOption.Manual;
            handler.ServerCertificateCustomValidationCallback = (httpRequestMessage, cert, cetChain, policyErrors) => { return true; };
            payMobUser.api_key = payMobSKey;
            Random rand = new Random();
            using (var client = new HttpClient(handler))
            {
                SendRequest = null;
                try
                {
                    SendRequest = new StringContent(JsonConvert.SerializeObject(payMobUser), Encoding.UTF8, "application/json");
                    using (var response = await client.PostAsync(userAuthentURL, SendRequest))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        var Restoken = (JObject)JsonConvert.DeserializeObject(apiResponse);
                        string genToken = Restoken["token"].Value<string>();
                        HttpContext.Session.SetString("JwTokenPay", genToken);
                        Models.SessionExtensions.Application["JwTokenPay"] = genToken;
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception("Failed to user Authentication" + ex.Message);
                }
                string paymentAmount = Convert.ToString(FIPR_COLL_AMOUNT * 100);
                if (PaymentType == "CC")
                {
                    double amountpayment = FIPR_COLL_AMOUNT / 0.974;
                    amountpayment = Math.Round(amountpayment * 100);

                    paymentAmount = amountpayment.ToString();
                }
                string Clientid = configuration.GetSection("paymentConfig").GetSection("Clientid").Value;
                paymentOrder = configuration.GetSection("paymentConfig").GetSection("paymentOrder").Value;
                string prudCurr = "PKR", prodShtDesc = "Vanila Policy through Credit Card", prudDesc = "Life Insurance Policy Vanilla Product by Credit Card", OrderId;
                P_DOCUMENT_ID = "DSF" + (rand.Next(100000000, 1000000000)).ToString();
                try
                {
                    string paymentOrderJson = @"{'auth_token':'" + Models.SessionExtensions.Application["JwTokenPay"] + "','delivery_needed':'false','amount_cents':'" + paymentAmount + "','currency': '" + prudCurr + "', 'merchant_order_id': '" + P_DOCUMENT_ID + "', 'items': [ { 'name': '" + prodShtDesc + "','amount_cents': '" + paymentAmount + "', 'description': '" + prudDesc + "', 'quantity': '1' } ] }";
                    JObject json = JObject.Parse(paymentOrderJson);
                    SendRequest = new StringContent(JsonConvert.SerializeObject(json), Encoding.UTF8, "application/json");
                    using (var response = await client.PostAsync(paymentOrder, SendRequest))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        var data = (JObject)JsonConvert.DeserializeObject(apiResponse);
                        OrderId = data["id"].Value<string>();
                        HttpContext.Session.SetString("OrderId", OrderId);
                        Models.SessionExtensions.Application["OrderId"] = OrderId;
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception("Failed to Order ID API" + ex.Message);
                }
                if (PaymentType == "CC")
                {
                    try
                    {
                        //double amountpayment = (int.Parse(paymentAmount) / 0.974);
                        //amountpayment = Math.Round(amountpayment* 100);

                        //paymentAmount = amountpayment.ToString();
                        paymentCard = configuration.GetSection("paymentConfig").GetSection("paymentCard").Value;
                        string creditCardJson = @"{'auth_token': '" + Models.SessionExtensions.Application["JwTokenPay"] + "','amount_cents': '" + paymentAmount + "','expiration': 3600,'order_id': '" + OrderId + "','billing_data': {'apartment': 'B499','email': '" + CustEmailAddr + "','floor': '1','first_name': 'Deen Muhammad Khan', 'street': 'Gulshan-e-Iqbal Karachi Eest Karachi','building': '1','phone_number': '" + CustPhone + "', " +
                                                  "'shipping_method': 'PKG','postal_code': '75010','city': 'Karachi','country': 'Pakistan', 'last_name': 'Muhammad','state': 'Sindh' },'currency': '" + prudCurr + "', " +
                                                  "'integration_id': '" + Clientid + "','lock_order_when_paid': 'false'}";
                        JObject json = JObject.Parse(creditCardJson);
                        SendRequest = new StringContent(JsonConvert.SerializeObject(json), Encoding.UTF8, "application/json");
                        using (var response = await client.PostAsync(paymentCard, SendRequest))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            var data = (JObject)JsonConvert.DeserializeObject(apiResponse);
                            string orderToken = data["token"].Value<string>();
                            HttpContext.Session.SetString("OrderId", OrderId);
                            string ORDERID = HttpContext.Session.GetString("OrderId");
                            Models.SessionExtensions.Application["orderToken"] = orderToken;
                            string CardPaymentURL = "https://pakistan.paymob.com/api/acceptance/iframes/74992?payment_token=" + Models.SessionExtensions.Application["orderToken"] + "";
                            return Redirect(CardPaymentURL);
                        }
                    }
                    catch (Exception ex)
                    {
                        throw new Exception("Failed to load Credit Card API" + ex.Message);
                    }
                }
                if (PaymentType == "EP")
                {
                    try
                    {
                        Clientid = configuration.GetSection("paymentConfig").GetSection("EPClientId").Value;
                        paymentCard = configuration.GetSection("paymentConfig").GetSection("paymentCard").Value;
                        string creditCardJson = @"{'auth_token': '" + Models.SessionExtensions.Application["JwTokenPay"] + "','amount_cents': '" + paymentAmount + "','expiration': 3600,'order_id': '" + OrderId + "','billing_data': {'apartment': 'B499','email': '" + CustEmailAddr + "','floor': '1','first_name': 'Deen Muhammad Khan', 'street': 'Gulshan-e-Iqbal Karachi Eest Karachi','building': '1','phone_number': '" + CustPhone + "', " +
                                                  "'shipping_method': 'PKG','postal_code': '75010','city': 'Karachi','country': 'Pakistan', 'last_name': 'Muhammad','state': 'Sindh' },'currency': '" + prudCurr + "', " +
                                                  "'integration_id': '" + Clientid + "','lock_order_when_paid': 'false'}";
                        JObject json = JObject.Parse(creditCardJson);
                        SendRequest = new StringContent(JsonConvert.SerializeObject(json), Encoding.UTF8, "application/json");
                        using (var response = await client.PostAsync(paymentCard, SendRequest))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            var data = (JObject)JsonConvert.DeserializeObject(apiResponse);
                            string orderToken = data["token"].Value<string>();
                            HttpContext.Session.SetString("OrderId", OrderId);
                            Models.SessionExtensions.Application["orderToken"] = orderToken;
                            string CardPaymentURL = "https://pakistan.paymob.com/iframe/" + Models.SessionExtensions.Application["orderToken"] + "";
                            return Redirect(CardPaymentURL);
                        }
                    }
                    catch (Exception ex)
                    {
                        throw new Exception("Failed to load Credit Card API" + ex.Message);
                    }
                }
                if (PaymentType == "JC")
                {
                    try
                    {
                        Clientid = configuration.GetSection("paymentConfig").GetSection("JazzClientId").Value;
                        paymentCard = configuration.GetSection("paymentConfig").GetSection("paymentCard").Value;
                        string creditCardJson = @"{'auth_token': '" + Models.SessionExtensions.Application["JwTokenPay"] + "','amount_cents': '" + paymentAmount + "','expiration': 3600,'order_id': '" + OrderId + "','billing_data': {'apartment': 'B499','email': '" + CustEmailAddr + "','floor': '1','first_name': 'Deen Muhammad Khan', 'street': 'Gulshan-e-Iqbal Karachi Eest Karachi','building': '1','phone_number': '" + CustPhone + "', " +
                                                  "'shipping_method': 'PKG','postal_code': '75010','city': 'Karachi','country': 'Pakistan', 'last_name': 'Muhammad','state': 'Sindh' },'currency': '" + prudCurr + "', " +
                                                  "'integration_id': '" + Clientid + "','lock_order_when_paid': 'false'}";
                        JObject json = JObject.Parse(creditCardJson);
                        SendRequest = new StringContent(JsonConvert.SerializeObject(json), Encoding.UTF8, "application/json");
                        using (var response = await client.PostAsync(paymentCard, SendRequest))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            var data = (JObject)JsonConvert.DeserializeObject(apiResponse);
                            string orderToken = data["token"].Value<string>();
                            HttpContext.Session.SetString("OrderId", OrderId);
                            Models.SessionExtensions.Application["orderToken"] = orderToken;
                            string CardPaymentURL = "https://pakistan.paymob.com/iframe/" + Models.SessionExtensions.Application["orderToken"] + "";
                            return Redirect(CardPaymentURL);
                        }
                    }
                    catch (Exception ex)
                    {
                        throw new Exception("Failed to load Credit Card API" + ex.Message);
                    }
                }
                if (PaymentType == "NI")
                {
                    try
                    {
                        paymentCard = configuration.GetSection("paymentConfig").GetSection("paymentCard").Value;
                        string creditCardJson = @"{'auth_token': '" + Models.SessionExtensions.Application["JwTokenPay"] + "','amount_cents': '" + paymentAmount + "','expiration': 3600,'order_id': '" + OrderId + "','billing_data': {'apartment': 'B499','email': '" + CustEmailAddr + "','floor': '1','first_name': 'Deen Muhammad Khan', 'street': 'Gulshan-e-Iqbal Karachi Eest Karachi','building': '1','phone_number': '" + CustPhone + "', " +
                                                  "'shipping_method': 'PKG','postal_code': '75010','city': 'Karachi','country': 'Pakistan', 'last_name': 'Muhammad','state': 'Sindh' },'currency': '" + prudCurr + "', " +
                                                  "'integration_id': '" + Clientid + "','lock_order_when_paid': 'false'}";
                        JObject json = JObject.Parse(creditCardJson);
                        SendRequest = new StringContent(JsonConvert.SerializeObject(json), Encoding.UTF8, "application/json");
                        using (var response = await client.PostAsync(paymentCard, SendRequest))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            var data = (JObject)JsonConvert.DeserializeObject(apiResponse);
                            string orderToken = data["token"].Value<string>();
                            HttpContext.Session.SetString("OrderId", OrderId);
                            Models.SessionExtensions.Application["orderToken"] = orderToken;
                            string NIFTURL = "https://pakistan.paymob.com/api/acceptance/iframes/85307?payment_token=" + Models.SessionExtensions.Application["orderToken"] + "";
                            return Redirect(NIFTURL);
                        }
                    }
                    catch (Exception ex)
                    {
                        throw new Exception("Failed to load Credit Card API" + ex.Message);
                    }
                }
                return RedirectToAction("PRO_RECEIPT");
            }
        }
    }
}