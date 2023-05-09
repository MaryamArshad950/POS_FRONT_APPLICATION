using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS_APPLICATION.Models.CLAIMS
{
    public class CLAIM_INTIMATION
    {
        public int FPCL_CLAIM_ID { get; set; }
        public int FPDM_POLDOM_ID { get; set; }
        public int FPDM_POLICY_IDX { get; set; }
        public string FPDH_POLICY_NO { get; set; }
        public int FPCL_CLINT_NO { get; set; }
        public string FPCL_CLINT_CPDE { get; set; }
        public int FPCL_CLMTP_FSCD_ID { get; set; }
        public int FCIH_ILEVT_FSCD_ID { get; set; }
        public string FCIH_PLACE_OF_EVNT { get; set; }
        public DateTime FCIH_DATE_EVNT { get; set; }
        public DateTime FPCL_DATE_TREATMNT { get; set; }
        public string FPCL_CLAIM_DESC { get; set; }
        public string FPCL_SIMLR_CNDITION { get; set; }
        public string FPCL_YES_DETAIL { get; set; }
        public string FPCL_TREATED { get; set; }
        public string FPCL_NAME { get; set; }
        public string FPCL_ADDRESS { get; set; }
        public DateTime FPCL_HOSPADMT_DATE { get; set; }
        public DateTime FPCL_HOSDIS_DATE { get; set; }
        public DateTime FPCL_ATTND_WORKPLACE { get; set; }
        public DateTime FPCL_REJOING_WORKPLACE { get; set; }
        public string FPCL_ACC_NAME { get; set; }
        public string FPCL_BANK_NAME { get; set; }
        public string FPCL_ACC_TYPE { get; set; }
        public string FPCL_ACCNO_IBFT { get; set; }
        public string FCIH_APPROVED { get; set; }
        public string FCIH_STATUS { get; set; }
        public DateTime FCIH_FLXFLD_DATE1 { get; set; }
        public DateTime FCIH_FLXFLD_DATE2 { get; set; }
        public DateTime FCIH_FLXFLD_DATE3 { get; set; }
        public string FCIH_FLXFLD_VCHAR1 { get; set; }
        public string FCIH_FLXFLD_VCHAR2 { get; set; }
        public string FCIH_FLXFLD_VCHAR3 { get; set; }
        public int FCIH_FLXFLD_NUMBER1 { get; set; }
        public int FCIH_FLXFLD_NUMBER2 { get; set; }
        public int FCIH_FLXFLD_NUMBER3 { get; set; }
        public int FCIH_CRUSER { get; set; }
        public DateTime FCIH_CRDATE { get; set; }
        public int FCIH_CHKUSER { get; set; }
        public DateTime FCIH_CHKDATE { get; set; }
        public int FCIH_AUTHUSER { get; set; }
        public DateTime FCIH_AUTHDATE { get; set; }
        public int FCIH_CNCLUSER { get; set; }
        public DateTime FCIH_CNCLDATE { get; set; }
        public string FCIH_AUDIT_COMMENTS { get; set; }
        public string FCIH_USER_IPADDR { get; set; }
    }
}
