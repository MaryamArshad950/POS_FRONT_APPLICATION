using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS_APPLICATION.Models.ILLUSTRATION
{
    public class DCMNT_QUESTNR
    {
        public int FCUQ_CHNLUW_QSN_ID { get; set; }
        public int FCDM_DOCUMENT_ID { get; set; }
        public int FSPM_PRODUCT_ID { get; set; }
        public int FSPQS_QSTNR_FSCD_ID { get; set; }
        public string FCUQ_ANSR_YN { get; set; }
        public int FCUQ_PARENT_ID { get; set; }
        public string FCUQ_STATUS { get; set; }
    }
}
