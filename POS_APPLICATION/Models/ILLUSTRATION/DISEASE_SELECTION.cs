using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS_APPLICATION.Models.ILLUSTRATION
{
    public class DISEASE_SELECTION
    {
        public int FCDS_DISEASE_SLCTN_ID { get; set; }
        public int FCDM_DOCUMENT_ID { get; set; }
        public int FSPQS_QSTNR_FSCD_ID { get; set; }
        public int FSDI_DISEASE_ID { get; set; }
        public string FCDS_DISEASE_DURATION { get; set; }
        public string FCDS_DISEASE_DETAILS { get; set; }                    
        public string FCDS_STATUS { get; set; }
        public int FCDS_CRUSER { get; set; }
        public DateTime FCDS_CRDATE { get; set; }

    }
}
