using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS_APPLICATION.Models.POS_USER_MASTER
{
    public class POS_USER
    {
        public int SUM_SYS_USER_ID { get; set; }
        public string SUM_SYS_USER_CODE { get; set; }
        public string SUM_FULL_NAME { get; set; }
        public string SUM_USER_PASSWORD { get; set; }
        public int FSDS_DESIGN_ID { get; set; }
        public string SUM_USER_EMAIL_ADDR { get; set; }
        public DateTime SUM_CUST_DOB { get; set; }
        public string SUM_CUST_CONTPHONE { get; set; }
        public string SUM_CUST_OTP { get; set; }
        public int SUM_CRUSER { get; set; }
        public DateTime SUM_CRDATE { get; set; }
    }
}
