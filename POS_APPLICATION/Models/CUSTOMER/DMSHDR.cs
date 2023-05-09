using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS_APPLICATION.Models.CUSTOMER
{
    public class DMSHDR
    {
        public int FPDH_DMSHDR_ID { get; set; }
        public string FPDH_POLICY_NO { get; set; }
        public int FPDM_POLDOM_ID { get; set; }
        public int FPDM_POLICY_IDX { get; set; }
        public string FPDH_DMSCUS_CNIC { get; set; }
        public string FPDH_DESCRIPTION { get; set; }
        public string FPDH_SHORT_DESCR { get; set; }
        public string FPDH_APPROVED_YN { get; set; }
        public string FPDH_STATUS { get; set; }
        public DateTime FPDH_FLXFLD_DATE { get; set; }
        public string FPDH_FLXFLD_VCHAR { get; set; }
        public int FPDH_FLXFLD_NUMBER { get; set; }
        public int FPDH_CRUSER { get; set; }
        public DateTime FPDH_CRDATE { get; set; }
        public int FPDH_CHKUSER { get; set; }
        public DateTime FPDH_CHKDATE { get; set; }
        public int FPDH_AUTHUSER { get; set; }
        public DateTime FPDH_AUTHDATE { get; set; }
        public int FPDH_CNCLUSER { get; set; }
        public DateTime FPDH_CNCLDATE { get; set; }
        public string FPDH_AUDIT_COMMENTS { get; set; }
        public int NEW_GEN_DMS_ID { get; set; }
        public string FPDH_USER_IPADDR { get; set; }
    }
}
