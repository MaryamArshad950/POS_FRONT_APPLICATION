using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS_APPLICATION.Models.CUSTOMER
{
    public class CUSTOMER_ADDRESS
    {
        public int FSCU_CUSTOMER_CODE { get; set; }
        public string FSCU_CUSTADDR_OPS_TYPE { get; set; }
        public string FSCA_ADDRESS_TYPE { get; set; }
        public int FSSC_COUNTRY_ID { get; set; }
        public int FSSP_PROVINCE_ID { get; set; }
        public int FSCT_CITY_ID { get; set; }
        public int FSPS_POSTAL_ID { get; set; }
        public int FSAP_AREA_ID { get; set; }
        public string FSCA_ADDRESS1 { get; set; }
        public string FSCA_ADDRESS2 { get; set; }
        public string FSCA_ADDRESS3 { get; set; }
        public string FSCA_TELNO1 { get; set; }
        public string FSCA_TELNO2 { get; set; }
        public string FSCA_MOBILE1 { get; set; }
        public string FSCA_MOBILE2 { get; set; }
        public string FSCA_POBOX { get; set; }
        public string FSCA_FAXNO { get; set; }
        public string FSCA_PAGER { get; set; }
        public string FSCA_EMAIL1 { get; set; }
        public string FSCA_EMAIL2 { get; set; }
        public string FSCA_ADDR_ISCORSP { get; set; }
        public string FSCA_STATUS { get; set; }
        public int FSCA_CRUSER { get; set; }
        public DateTime FSCA_CRDATE { get; set; }
    }
}
