using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS_APPLICATION.Models.CUSTOMER
{
    public class DMSDTLS
    {
        public int FPDD_DMSDTL_ID { get; set; }
        public int FPDH_DMSHDR_ID { get; set; }
        public int FPDD_SERIAL_NO { get; set; }
        public string FPDD_NAME { get; set; }
        public string FPDD_TYPE { get; set; }
        public DateTime FPDD_DATE { get; set; }
        public string FPDD_PATH { get; set; }
        //public IFormFile FPDD_IMAGE_PATH { get; set; }
        public string FPDD_DESC { get; set; }
        public string FPDD_STATUS { get; set; }
        public DateTime FPDD_FLXFLD_DATE { get; set; }
        public string FPDD_FLXFLD_VCHAR { get; set; }
        public int FPDD_FLXFLD_NUMBER { get; set; }
        public int FPDD_CRUSER { get; set; }
        public DateTime FPDD_CRDATE { get; set; }
        public int FPDD_CHKUSER { get; set; }
        public DateTime FPDD_CHKDATE { get; set; }
        public int FPDD_AUTHUSER { get; set; }
        public DateTime FPDD_AUTHDATE { get; set; }
        public int FPDD_CNCLUSER { get; set; }
        public DateTime FPDD_CNCLDATE { get; set; }
        public string FPDD_AUDIT_COMMENTS { get; set; }
        public string FPDD_USER_IPADDR { get; set; }
    }
}
