!function () {
    $(document).ready(function () {
        $("#processPlan").removeAttr("hidden", true);
        $("#reportPlan").removeAttr("hidden", true);
        $("#servicesDropdown").removeAttr("hidden", true);
        if (sessionStorage.getItem("GlobalPos") != null) {
            sessionStorage.removeItem("GlobalPos")
        }
        if (sessionStorage.getItem("tokenIndex") != null && sessionStorage.getItem("tokenIndex") != "" && sessionStorage.getItem("User") == null) {
            localStorage.setItem("token2", sessionStorage.getItem("tokenIndex"));
        }
        if (sessionStorage.getItem("tokenIndex") == "") {
            sessionStorage.setItem("tokenIndex", localStorage.getItem("token2"));
            sessionStorage.setItem("token", localStorage.getItem("token2"));
        }
        let nf = new Intl.NumberFormat('en-US');
        if (sessionStorage.getItem("cnic.") != null) {
            let getsession = sessionStorage.getItem("tokenIndex");
            let custCNIC = sessionStorage.getItem("cnic.");
            if (custCNIC[5] != "-" && custCNIC[13] != "-") {
                let n1 = custCNIC.substring(0, 5);
                let n2 = custCNIC.substring(5, 12);
                let addn = n1 + "-" + n2 + "-" + custCNIC[custCNIC.length - 1]
                custCNIC = addn;
            }
            $.ajax({
                "crossDomain": true,
                url: "" + Result_API + "/api/Inquiry/GetInquiryByUsername/" + custCNIC,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': Result_API,
                    'Access-Control-Allow-Methods': 'POST, GET',
                    'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                    'Authorization': 'Bearer ' + getsession
                },
                datatype: 'jsonp',
                success: function (result) {
                    let policyResult = [];
                    let proposalResult = [];
                    if (result.length != 0) {
                        for (let i = 0; i < result.length; i++) {
                            if (result[i].FPDM_POLICY_NO == null) {
                                proposalResult.push(result[i].FPDM_PROPOSAL_NO);
                                sessionStorage.setItem("proposalResult", proposalResult)
                                let FCDM_DOCUMENT_DATE = new Date(result[i].FCDM_DOCUMENT_DATE);
                                let dcmntMonth = FCDM_DOCUMENT_DATE.getMonth() + 1;
                                if (("" + dcmntMonth).length == 1) {
                                    dcmntMonth = "0" + dcmntMonth;
                                }
                                FCDM_DOCUMENT_DATE = FCDM_DOCUMENT_DATE.getDate() + "-" + dcmntMonth + "-" + FCDM_DOCUMENT_DATE.getFullYear();

                                let FPDM_PROP_ENT_DATE = new Date(result[i].FPDM_PROP_ENT_DATE);
                                let propMonth = FPDM_PROP_ENT_DATE.getMonth() + 1;
                                if (("" + propMonth).length == 1) {
                                    propMonth = "0" + propMonth;
                                }
                                FPDM_PROP_ENT_DATE = FPDM_PROP_ENT_DATE.getDate() + "-" + propMonth + "-" + FPDM_PROP_ENT_DATE.getFullYear();

                                $("#tblMyPrpsls tbody").append("<tr>" +
                                    "<td>" + result[i].FPDM_PROPOSAL_NO + "</td>" +
                                    "<td>" + FPDM_PROP_ENT_DATE + "</td>" +
                                    "<td>PKR " + nf.format(result[i].FPDM_GROSSCONTRIB) + "</td>" +
                                    "<td>PKR " + nf.format(result[i].FCDM_FACE_VALUE) + "</td>" +
                                    "<td>" + result[i].FCDM_PAYING_TERM + "</td>" +
                                    "<td><button class='btn btn-warning text-white btn-rounded'>Status</button></td>" +
                                    "</tr>");
                            }
                            else {
                                policyResult.push(result[i].FPDM_POLICY_NO);
                                sessionStorage.setItem("policyResult", policyResult)
                                let FCDM_DOCUMENT_DATE = new Date(result[i].FCDM_DOCUMENT_DATE);
                                let dcmntMonth = FCDM_DOCUMENT_DATE.getMonth() + 1;
                                if (("" + dcmntMonth).length == 1) {
                                    dcmntMonth = "0" + dcmntMonth;
                                }
                                FCDM_DOCUMENT_DATE = FCDM_DOCUMENT_DATE.getDate() + "-" + dcmntMonth + "-" + FCDM_DOCUMENT_DATE.getFullYear();

                                let FPDM_PROP_ENT_DATE = new Date(result[i].FPDM_PROP_ENT_DATE);
                                let propMonth = FPDM_PROP_ENT_DATE.getMonth() + 1;
                                if (("" + propMonth).length == 1) {
                                    propMonth = "0" + propMonth;
                                }
                                FPDM_PROP_ENT_DATE = FPDM_PROP_ENT_DATE.getDate() + "-" + propMonth + "-" + FPDM_PROP_ENT_DATE.getFullYear();

                                let FPDM_POLISSU_DATE = new Date(result[i].FPDM_POLISSU_DATE);
                                let polMonth = FPDM_POLISSU_DATE.getMonth() + 1;
                                if (("" + polMonth).length == 1) {
                                    polMonth = "0" + polMonth;
                                }
                                FPDM_POLISSU_DATE = FPDM_POLISSU_DATE.getDate() + "-" + polMonth + "-" + FPDM_POLISSU_DATE.getFullYear();

                                let policy_apprvd = "";
                                if (result[i].FPDM_APPROVED == "Y") {
                                    policy_apprvd = "Approved";
                                }
                                $("#FPDM_POLICY_NO").val(result[i].FPDM_POLICY_NO);
                                $("#FPDM_POLISSU_DATE").val(FPDM_POLISSU_DATE);
                                $("#FPDM_APPROVED").val(policy_apprvd);
                                $("#FPDM_POLDOC_REFNO").val(result[i].FPDM_POLDOC_REFNO);
                                $("#FCDM_DOCUMENT_DATE").val(FCDM_DOCUMENT_DATE);
                                $("#FPDM_GROSSCONTRIB").val(nf.format(result[i].FPDM_GROSSCONTRIB));
                                $("#FCDM_FACE_VALUE").val(nf.format(result[i].FCDM_FACE_VALUE));
                                $("#FCDM_PAYING_TERM").val(result[i].FCDM_PAYING_TERM + " years");
                                $("#FPDM_PROPOSAL_NO").val(result[i].FPDM_PROPOSAL_NO);
                                $("#FPDM_PROP_ENT_DATE").val(FPDM_PROP_ENT_DATE);
                                $("#tblMyAccptdPrpsls tbody").append("<tr>" +
                                    "<td><a id='" + i + "' href='/Services/Funds' onclick='searchCashValue(this.id, this.text)'>" + result[i].FPDM_POLICY_NO + "</a></td>" +
                                    "<td>" + FPDM_POLISSU_DATE + "</td>" +
                                    "<td>" + policy_apprvd + "</td>" +
                                    "<td id='proposalAccpted" + i + "'>" + result[i].FPDM_PROPOSAL_NO + "</td>" +
                                    "<td id='grossContrib" + i + "'>PKR " + nf.format(result[i].FPDM_GROSSCONTRIB) + "</td>" +
                                    "<td>PKR " + nf.format(result[i].FPDM_GROSSCONTRIB) + "</td>" +
                                    "<td>PKR " + nf.format(result[i].FCDM_FACE_VALUE) + "</td>" +
                                    "<td>" + result[i].FCDM_PAYING_TERM + "</td>" +
                                    "</tr>");
                            }
                        }
                    }
                },
                error: function (data2) { }
            });
            $.ajax({
                "crossDomain": true,
                url: "" + Result_API + "/api/PosUser/GetUserByUserCd/" + sessionStorage.getItem("cnic."),
                type: "GET",
                contentType: "application/json; charset=utf-8",
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': Result_API,
                    'Access-Control-Allow-Methods': 'POST, GET',
                    'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                    'Authorization': 'Bearer ' + getsession
                },
                datatype: 'jsonp',
                success: function (result) {
                    $(result).each(function () {
                        $.post("/User/SetSessionValue", { key: "SUM_USER_EMAIL_ADDR", value: this.SUM_USER_EMAIL_ADDR }, function () {
                            $.post("/User/SetSessionValue", { key: "SUM_CUST_CONTPHONE", value: result[0].SUM_CUST_CONTPHONE }, function () {
                                $.post("/User/SetSessionValue", { key: "SUM_FULL_NAME", value: result[0].SUM_FULL_NAME }, function () {
                                });
                            });
                        });

                        sessionStorage.setItem("customer_name", this.SUM_FULL_NAME);
                    })
                },
                error: function (data2) { }
            });
        }
        else {
            window.location.href = "/";
            localStorage.clear();
            sessionStorage.clear();
        }
        
    })
}()
function searchCashValue(ID, policyNo) {
    sessionStorage.setItem("PolicyNo", policyNo);
    let proposal_no = $("#proposalAccpted" + ID).text();
    let grossContrib = $("#grossContrib" + ID).text().replaceAll(",", "");
    grossContrib = grossContrib.slice(4)

    sessionStorage.setItem("Proposal_NoF", proposal_no);
    sessionStorage.setItem("GROSS_AMT", grossContrib);
}