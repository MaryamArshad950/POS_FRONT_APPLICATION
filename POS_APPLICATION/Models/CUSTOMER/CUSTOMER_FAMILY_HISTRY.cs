using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS_APPLICATION.Models.CUSTOMER
{
    public class CUSTOMER_FAMILY_HISTRY
    {
        public int FSCU_CUSTOMER_CODE { get; set; }
        public string FSCF_MEMBER_NAME { get; set; }
        public int FSCF_SERIAL_NO { get; set; }
        public int FSCU_RELTN_FSCD_DID { get; set; }
        public DateTime FSCF_MEMBER_DOB { get; set; }
        public string FSCF_MEMBER_CNIC { get; set; }
        public string FSCF_FAMILY_ID { get; set; }
        public string FSCF_STATUS { get; set; }
        public int FSCF_CRUSER { get; set; }
        public string FSCF_MEMBER_STATUS { get; set; }
        public int FSCF_AGE { get; set; }
        public string FSCF_STATOFHLTH { get; set; }
        public string FSCF_YEAROFDTH { get; set; }
        public int FSCF_AGEOFDTH { get; set; }
        public string FSCF_CAUSOFDTH { get; set; }
        public DateTime FSCF_CRDATE { get; set; }
    }
}