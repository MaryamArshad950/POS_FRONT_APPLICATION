using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS_APPLICATION.Models.CUST_NEED_ANALYSIS
{
    public class FINANCIAL_DTLS
    {
        public int FCFA_FIN_ID { get; set; }
        public string SUM_SYS_USER_CODE { get; set; }
        public int FCFA_ANNUAL_INCOME { get; set; }
        public int FCFA_OTHER_INCOME { get; set; }
        public int FCFA_TOTAL_INCOME { get; set; }
        public int FCFA_CUST_EXPENSES { get; set; }
        public int FCFA_EXPENSES_LASTYR { get; set; }
        public int FCFA_EXPENSES_CURRENTYR { get; set; }
        public int FCFA_NET_SAVINGS { get; set; }
        public string FCFA_ADDTNL_DTLS { get; set; }
        public DateTime FCFA_CRDATE { get; set; }
    }
}