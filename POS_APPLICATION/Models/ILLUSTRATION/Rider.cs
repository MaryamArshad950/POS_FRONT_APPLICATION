using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS_APPLICATION.Models.ILLUSTRATION
{
    public class Rider
    {
        public int FCDM_DOCUMENT_ID { get; set; }
        public int FCDR_DOC_RDR_ID { get; set; }
        public int FSPM_PRODRDR_ID { get; set; }
        public int FCDR_PAYING_TERM { get; set; }
        public int FCDR_FACE_VALUE { get; set; }
    }
}
