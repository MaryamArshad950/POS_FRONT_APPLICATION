using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS_APPLICATION.Models.CUST_NEED_ANALYSIS
{
    public class FINANCIAL_NEEDS
    {
        public int FCFN_FINOBJ_ID { get; set; }
        public string SUM_SYS_USER_CODE { get; set; }
        public int FSFP_FINQUEST_FSCD_ID { get; set; }
        public int FSFP_FINQUEST_TYPE { get; set; }
        public int FCFN_FINQUEST_PRIORITYNO { get; set; }
        public int FCFN_CRUSER { get; set; }
        public DateTime FCFN_CRDATE { get; set; }
    }
}
