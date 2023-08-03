using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS_APPLICATION.Models.ILLUSTRATION
{
    public class PARTICIPANT
    {
        public int FCDM_DOCUMENT_ID { get; set; }
        public string FCDM_DOCUMENT_CODE { get; set; }
        public int FSPM_PRODUCT_ID { get; set; }
        public string FCDM_OWCUST_FIRSTNAME { get; set; }
        public string FCDM_OWCUST_MDDLNAME { get; set; }
        public string FCDM_OWCUST_LASTNAME { get; set; }
        public int FCDM_OW_GENDR_FSCD_ID { get; set; }
        public int FCDM_OW_TITLE_FSCD_DID { get; set; }
        public DateTime FCDM_OWCUST_DOB { get; set; }
        public decimal FCDM_OWCUST_HEITACT { get; set; }
        public int FCDM_OWCUST_HEITUNT { get; set; }
        public int FCDM_OWCUST_WEITACT { get; set; }
        public int FCDM_OWCUST_WEITUNT { get; set; }
        public float FCDM_OWCUST_BMI { get; set; }
        public string FCDM_OWCUST_MOBILENO { get; set; }
        public string FCDM_OWCUST_EMAILADDR { get; set; }
        public int FCDM_OW_CUOCP_FSCD_ID { get; set; }
        public int FCDM_OWCUST_ANNUINCOME { get; set; }
        public int FCDM_PFREQ_FSCD_ID { get; set; }
        public int FCDM_PLAN_CONTRIB { get; set; }
        public int FCDM_PAYING_TERM { get; set; }
        public int FCDM_PLAN_CASE_STATUS { get; set; }
        public int FCDM_COVER_MULTIPLE { get; set; }
        public int FCDM_CONTRIB_IDX_RATE { get; set; }
        public int FCDM_FACEVAL_IDX_RATE { get; set; }
        public int FCDM_OW_FSNT_IDENTYPE_ID { get; set; }
        public string FCDM_OWCUST_CNIC { get; set; }
        public int FCDM_BENEFIT_TERM { get; set; }
        public string FCDM_PROPOSAL_NO { get; set; }
        public int FCDM_FACE_VALUE { get; set; }
        public int FSAG_AGENT_CODE { get; set; }
    }
}