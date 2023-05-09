using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RDL_TestProject.RS_Services.RS_Interface
{ 
    public interface IRS
    {
        string GetReportLink(string reportName, string format, string P_DOCUMENT_CODE, int P_UGR_RATE, int P_DOCUMENT_ID);
        string GetReportLink(string reportName, string P_DOCUMENT_CODE, int P_UGR_RATE, int P_DOCUMENT_ID);
        public string ProposalReport(string propID);
        public string ProposalReport(string propID, string format);
        Task SendEmailMesg(string username, string messageEmail, string emailAddress, string subject);
        Task SendSMSMesg(string username, string Txtmessage, string phoneNumber, string transactionID);
    }
}