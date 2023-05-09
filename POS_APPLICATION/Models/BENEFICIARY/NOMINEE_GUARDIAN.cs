using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS_APPLICATION.Models.BENEFICIARY
{
    public class NOMINEE_GUARDIAN
    {
        public int FCNGD_NMGRDDTL_ID { get; set; }
        public int FCPND_PNMNEDTL_ID { get; set; }
        public int FCDM_DOCUMENT_ID { get; set; }
        public int FCNGD_SERIAL_NO { get; set; }
        public int FSNT_IDENTYPE_ID { get; set; }
        public string FSCU_IDENTIFICATION_NO { get; set; }
        public string FCNGD_GUDAN_NAME { get; set; }
        public DateTime FCNGD_DOB { get; set; }
        public int FCNGD_AGE { get; set; }
        public int FCNGD_RELTN_FSCD_ID { get; set; }
        public int FCNGD_NMNEE_PERCT { get; set; }
        public int FCNGD_APPROVED { get; set; }
        public string FCNGD_REMARKS { get; set; }
        public string FCNGD_STATUS { get; set; }
    }
}
