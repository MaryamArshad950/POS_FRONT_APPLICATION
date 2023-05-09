using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS_APPLICATION.Models.BENEFICIARY
{
    public class DCMNT_NOMINEE
    {
        public int FCPND_PNMNEDTL_ID { get; set; }
        public int FCDM_DOCUMENT_ID { get; set; }
        public int FCPND_SERIAL_NO { get; set; }
        public int FSNT_IDENTYPE_ID { get; set; }
        public string FSCU_IDENTIFICATION_NO { get; set; }
        public string FCPND_NMNEE_NAME { get; set; }
        public DateTime FCPND_DOB { get; set; }
        public int FCPND_AGE { get; set; }
        public int FCPND_RELTN_FSCD_ID { get; set; }
        public int FCPND_NMNEE_PERCT { get; set; }
        public string FCPND_APPROVED { get; set; }
        public string FCPND_REMARKS { get; set; }
        public string FCPND_STATUS { get; set; }
    }
}
