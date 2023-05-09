using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS_APPLICATION.Models.CUST_NEED_ANALYSIS
{
    public class TAKAFUL_HIST
    {
        public int FCIH_INSUREREXIST_ID { get; set; }
        public string SUM_SYS_USER_CODE { get; set; }
        public string FCIH_INSUREREXIST_YN { get; set; }
        public string FCIH_POLICY_NO { get; set; }
        public int FCIH_SA_AMOUNT { get; set; }
        public int FCIH_CONTRIB_AMT { get; set; }
        public DateTime FCIH_START_DATE { get; set; }
        public DateTime FCIH_MATURITY_DATE { get; set; }
        public string FCIH_INSURER_PURPOSE { get; set; }
        public string FCIH_INSURER_NM { get; set; }
        public string FCIH_COND_ACCPTNCE { get; set; }
        public int FCIH_CRUSER { get; set; }
        public DateTime FCIH_CRDATE { get; set; }
    }
}
