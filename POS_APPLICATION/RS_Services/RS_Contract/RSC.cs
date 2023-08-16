using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using POS_APPLICATION.Models;
using RDL_TestProject.RS_Services.RS_Interface;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace RDL_TestProject.RS_Services.RS_Contract
{
    public class RSC : IRS
    {
        private readonly IConfiguration configuration;
        private readonly EmailCredential email;
        public RSC(IConfiguration _configuration, EmailCredential email)
        {
            this.email = email;
            configuration = _configuration;
        }
        StringContent SendRequest;
        public string ProposalReport(string propID, string format)
        {
            if (format == null)
                return ProposalReport(propID);
            var reportServerUrl = configuration.GetSection("ReportServer").GetSection("ServerName").Value;
            var reportPath = configuration.GetSection("ReportServer").GetSection("ReportFolder").Value + "POS_Illust";
            var queryString = $"&P_DOCUMENT_CODE={propID}";
            string url = $"{reportServerUrl}?/{reportPath}&rs:Command=Render{queryString}&rs:Format={format}";
            
            return url;
        }
        public string ProposalReport(string propID)
        {
            var reportServerUrl = configuration.GetSection("ReportServer").GetSection("ServerName").Value;
            var reportPath = configuration.GetSection("ReportServer").GetSection("ReportFolder").Value + "POS_Illust";
            var queryString = $"&P_DOCUMENT_CODE={propID}";
            string url = $"{reportServerUrl}?/{reportPath}&rs:Command=Render{queryString}&rc:Toolbar=false";
                return url;
        }
        public string GetReportLink(string reportName, string format, string P_DOCUMENT_CODE, int P_UGR_RATE, int P_DOCUMENT_ID)
        {
            if (format == null)
            {
                return GetReportLink(reportName, P_DOCUMENT_CODE, P_UGR_RATE, P_DOCUMENT_ID);
            }

            var reportServerUrl = configuration.GetSection("ReportServer").GetSection("ServerName").Value;
            var reportPath = configuration.GetSection("ReportServer").GetSection("ReportFolder").Value + reportName;
            string dbUsername = configuration.GetSection("ReportServer").GetSection("Credentials").GetSection("User").Value;
            string dbPassword = configuration.GetSection("ReportServer").GetSection("Credentials").GetSection("Password").Value;
            var queryString = $"&P_DOCUMENT_CODE={P_DOCUMENT_CODE}&P_UGR_RATE={P_UGR_RATE}&P_DOCUMENT_ID={P_DOCUMENT_ID}";
            var url = $"{reportServerUrl}?/{reportPath}&rs:Command=Render{queryString}&rs:Format={format}";

            return url;
        }
        public string GetReportLink(string reportName, string P_DOCUMENT_CODE, int P_UGR_RATE, int P_DOCUMENT_ID)
        {
            var reportServerUrl = configuration.GetSection("ReportServer").GetSection("ServerName").Value;
            var reportPath = configuration.GetSection("ReportServer").GetSection("ReportFolder").Value + reportName;
            string dbUsername = configuration.GetSection("ReportServer").GetSection("Credentials").GetSection("User").Value;
            string dbPassword = configuration.GetSection("ReportServer").GetSection("Credentials").GetSection("Password").Value;
            var queryString = $"&P_DOCUMENT_CODE={P_DOCUMENT_CODE}&P_UGR_RATE={P_UGR_RATE}&P_DOCUMENT_ID={P_DOCUMENT_ID}";
            var url = $"{reportServerUrl}?/{reportPath}&rs:Command=Render{queryString}&rc:Toolbar=false";

            return url;
        }
        //http://myreportserver.com/reportserver?/MyReport&rs:Command=Render&rc:DataSource1=user:John;password:123&rc:DataSource2=user:;password:&param1=value1&param2=value2

        public async Task SendEmailMesg(string username, string messageEmail, string emailAddress, string subject)
        {
            try
            {
                var message = new MailMessage();
                message.To.Add(emailAddress);
                message.From = new MailAddress(email.Email);
                message.Subject = subject;
                message.IsBodyHtml = true;
                message.Body = $"Dear {username}, {messageEmail}";
                using (var smtp = new SmtpClient(email.Host, email.Port))
                {
                    smtp.EnableSsl = false;
                    smtp.UseDefaultCredentials = false;
                    smtp.Credentials = new NetworkCredential(email.Email, email.Password);
                    await smtp.SendMailAsync(message);
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task SendSMSMesg(string username, string Txtmessage, string phoneNumber, string transactionID)
        {
            try
            {
                var SMSURL1 = configuration.GetSection("Credentials").GetSection("smsURL").Value;
                var SMSURL2 = configuration.GetSection("Credentials").GetSection("smsURL2").Value;
                var SMSURL3 = configuration.GetSection("Credentials").GetSection("smsURL3").Value;
                var SMSURL4 = configuration.GetSection("Credentials").GetSection("smsURLFinal").Value;
                var smsURL = "";
                if (transactionID == null)
                {
                    Random random = new Random();
                    string randomDigits = "";
                    for (int i = 0; i < 8; i++)
                    {
                        randomDigits += random.Next(0, 10).ToString();
                    }
                    int randomNumber = int.Parse(randomDigits);
                    smsURL = SMSURL1 + randomNumber + SMSURL2 + phoneNumber + SMSURL3 + username + Txtmessage + SMSURL4;
                }
                else
                {
                    smsURL = SMSURL1 + transactionID + SMSURL2 + phoneNumber + SMSURL3 + username + Txtmessage + SMSURL4;
                }

                using (var handler = new HttpClientHandler())
                {
                    handler.ServerCertificateCustomValidationCallback = (request, cert, chain, errors) => true;
                    using (var client = new HttpClient(handler))
                    {
                        SendRequest = null;
                        await client.PostAsync(smsURL, SendRequest);
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}