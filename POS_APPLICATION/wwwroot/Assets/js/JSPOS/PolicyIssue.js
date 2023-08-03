!function () {
    $(document).ready(function () {
        let RCPT_TYPE = 1;
        let BNK_CHRGS = Number(sessionStorage.getItem("BNK_CHRGS"));
        const urlParams = new URLSearchParams(location.search);
        for (const [key, value] of urlParams) {
            sessionStorage.setItem(`${key}`, `${value}`);
        }
        if (sessionStorage.getItem("success") == 'true') {
            $("#success").removeAttr("hidden", true);
            let FPDM_PROPOSAL_NO = sessionStorage.getItem("Prpsl_No");
            let FPDM_APPROVED = 'N';
            let CURR_CODE = sessionStorage.getItem("currency");
            let CLLCT_AMOUNT = sessionStorage.getItem("amount_cents");
            let GWAY_STATUS = sessionStorage.getItem("success");
            let GWAY_REFNO = sessionStorage.getItem("order");
            let PROFILE_ID = sessionStorage.getItem("profile_id");
            let TRANS_REF_ID = sessionStorage.getItem("id");
            let PENDING_STATUS = sessionStorage.getItem("pending");
            let INTGN_ID = sessionStorage.getItem("integration_id");
            let TRANS_STATUS = sessionStorage.getItem("data.message");
            let TRANS_DATE = sessionStorage.getItem("created_at").slice(0, 10);
            Receipting(FPDM_PROPOSAL_NO, FPDM_APPROVED, CURR_CODE, CLLCT_AMOUNT, GWAY_STATUS, GWAY_REFNO, PROFILE_ID, TRANS_REF_ID, PENDING_STATUS, INTGN_ID, TRANS_STATUS, TRANS_DATE, RCPT_TYPE, BNK_CHRGS);
        }
        if (sessionStorage.getItem("success") != 'true' && sessionStorage.getItem("RC") == null) {
            $("#failure").removeAttr("hidden", true);
        }
        if (sessionStorage.getItem("RC") != null && sessionStorage.getItem("RC") == '00' || sessionStorage.getItem("TS") == 'P' && sessionStorage.getItem("success") == null) {
            $("#success").removeAttr("hidden", true);
            sessionStorage.setItem("pending", "false");
            let FPDM_PROPOSAL_NO = sessionStorage.getItem("Prpsl_No");
            let FPDM_APPROVED = 'N';
            let CURR_CODE = 'PKR';
            let CLLCT_AMOUNT = sessionStorage.getItem("amount_cents");
            let GWAY_STATUS = 'true';
            let GWAY_REFNO = sessionStorage.getItem("O");
            let PROFILE_ID = sessionStorage.getItem("profile_id");
            let TRANS_REF_ID = sessionStorage.getItem("id");
            let PENDING_STATUS = sessionStorage.getItem("pending");
            let INTGN_ID = sessionStorage.getItem("integration_id");
            let TRANS_STATUS = sessionStorage.getItem("data.message");
            let TRANS_DATE = sessionStorage.getItem("created_at");
            Receipting(FPDM_PROPOSAL_NO, FPDM_APPROVED, CURR_CODE, CLLCT_AMOUNT, GWAY_STATUS, GWAY_REFNO, PROFILE_ID, TRANS_REF_ID, PENDING_STATUS, INTGN_ID, TRANS_STATUS, TRANS_DATE, RCPT_TYPE, BNK_CHRGS);
        }
        if (sessionStorage.getItem("RC") != null && sessionStorage.getItem("RC") != '00' || sessionStorage.getItem("TS") != 'P' && sessionStorage.getItem("success") == null) {
            window.location.href = "/Basic_information";
        }
        $("#btnPolicyToPlan").click(function () {
            sessionStorage.clear();
            localStorage.clear();
        })
    })
}()
function Receipting(FPDM_PROPOSAL_NO, FPDM_APPROVED, CURR_CODE, CLLCT_AMOUNT, GWAY_STATUS, GWAY_REFNO, PROFILE_ID, TRANS_REF_ID, PENDING_STATUS, INTGN_ID, TRANS_STATUS, TRANS_DATE, RCPT_TYPE, BNK_CHRGS) {
    if (sessionStorage.getItem("PayCheck") == "RenewalPay" && sessionStorage.getItem("Policy_NoF") != null) {
        FPDM_PROPOSAL_NO = sessionStorage.getItem("Policy_NoF");
        FPDM_APPROVED = 'Y';
        RCPT_TYPE = 2;
    }
    if (sessionStorage.getItem("PayCheck") == "TopupPay" && sessionStorage.getItem("Policy_NoF") != null) {
        FPDM_PROPOSAL_NO = sessionStorage.getItem("Policy_NoF");
        FPDM_APPROVED = 'Y';
        RCPT_TYPE = 3;
    }
    if (sessionStorage.getItem("PayCheck") == "ProposalPay" && sessionStorage.getItem("Proposal_NoF") != null) {
        FPDM_PROPOSAL_NO = sessionStorage.getItem("Proposal_NoF");
        RCPT_TYPE = 1;
    }

    $.ajax({
        "crossDomain": true,
        url: "" + Result_API + "/API/RECEIPT/SAVEorUPDATE_RECEIPT_INFO?FPDM_PROPOSAL_NO=" + FPDM_PROPOSAL_NO + "&FPDM_APPROVED=" + FPDM_APPROVED + "&CURR_CODE=" + CURR_CODE +
            "&CLLCT_AMOUNT=" + CLLCT_AMOUNT + "&GWAY_STATUS=" + GWAY_STATUS + "&GWAY_REFNO=" + GWAY_REFNO + "&PROFILE_ID=" + PROFILE_ID + "&TRANS_REF_ID=" + TRANS_REF_ID + "" +
            "&PENDING_STATUS=" + PENDING_STATUS + "&INTGN_ID=" + INTGN_ID + "&TRANS_STATUS=" + TRANS_STATUS + "&TRANS_DATE=" + TRANS_DATE + "&RCPT_TYPE=" + RCPT_TYPE + "&BNK_CHRGS=" + BNK_CHRGS,
        type: "POST",
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
            if ((sessionStorage.getItem("PayCheck") == "RenewalPay" || sessionStorage.getItem("PayCheck") == "TopupPay") && sessionStorage.getItem("Policy_NoF") != null) {
                $(result).each(function () {
                    let NEW_POL_NO = this.NEW_POL_NO
                    let message = this.APP_ALTMSG;
                    if (this.APP_STS == "Y") {
                        let DOCUMENT_ID = Number(sessionStorage.getItem("DOCUMENT_ID"));
                        let SERIAL_NO = Number(sessionStorage.getItem("SERIAL_NO"));
                        let TOPUP_CONTRIB = Number(sessionStorage.getItem("TOPUP_CONTRIB"));
                        let PRMFND_ID = Number(sessionStorage.getItem("PRMFND_ID"));
                        let DISTRIBURATE = Number(sessionStorage.getItem("DISTRIBURATE"));
                        let CURRENCY_CODE = 1;
                        let GLVOUCHR_NO = NEW_POL_NO;
                        let STATUS = "Y";
                        $.ajax({
                            "crossDomain": true,
                            url: "" + Result_API + "/API/TOPUP/SAVEorUPDATE_TOPUP_DETAILS?DOCUMENT_ID=" + DOCUMENT_ID + "&SERIAL_NO=" + SERIAL_NO + "&TOPUP_CONTRIB=" + TOPUP_CONTRIB + "&PRMFND_ID=" + PRMFND_ID + "&DISTRIBURATE=" + DISTRIBURATE + "&CURRENCY_CODE=" + CURRENCY_CODE + "&GLVOUCHR_NO=" + GLVOUCHR_NO + "&STATUS=" + STATUS,
                            type: "POST",
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
                                    window.location.href = "/ContributionPayment"
                                })
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                if (jqXHR.status === 401) {
                                }
                            }
                        });
                    }
                    else {
                        $("#policyfailed").removeAttr("hidden", true);
                        $("#policyText").attr("hidden", true);
                        let policyFailure = document.getElementById("policyfailed");
                        policyFailure.innerHTML = 'Please check your email for policy attachments or respond to sms sent to your provided contact Number';
                    }
                });
            }
            if (sessionStorage.getItem("PayCheck") == "ProposalPay" && sessionStorage.getItem("Prpsl_No") != null){
                $(result).each(function () {
                    sessionStorage.setItem("NEW_POL_NO", this.NEW_POL_NO);
                    let NEW_POL_NO = sessionStorage.getItem("NEW_POL_NO");
                    let message = this.APP_ALTMSG;
                    if (this.APP_STS == "Y") {
                        $("#policyText").removeAttr("hidden", true);
                        let policyNumber = document.getElementById("policy-number");
                        policyNumber.innerHTML = NEW_POL_NO;
                        let userID = sessionStorage.getItem("User");
                        if (userID != null) {
                            $.ajax({
                                "crossDomain": true,
                                url: "" + Result_API + "/api/PosUser/GetPOSUserDetails/" + userID,
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
                                    $(result).each(function () {
                                        let cust_name = this.SUM_FULL_NAME;
                                        let cust_number = (this.SUM_CUST_CONTPHONE).slice(1);
                                        CLLCT_AMOUNT = CLLCT_AMOUNT.slice(0, CLLCT_AMOUNT.length - 2);
                                        let nf = new Intl.NumberFormat('en-US');
                                        CLLCT_AMOUNT = nf.format(CLLCT_AMOUNT);
                                        $.ajax({
                                            type: "POST",
                                            url: "/User/SendSMS",
                                            timeout: 1000,
                                            data: {
                                                username: cust_name, Txtmessage: ", Thank you for paying the contribution PKR " + CLLCT_AMOUNT + " for your Takaful application " + NEW_POL_NO + ". For any further assistance, please contact CS@salaamtakaful.com via WhatsApp/UAN on 021-111-875-111.", phoneNumber: cust_number
                                            }
                                        }).done(function (msg) {
                                        });
                                        $.ajax({
                                            type: "POST",
                                            url: "/User/SendSMS",
                                            timeout: 5000,
                                            data: {
                                                username: cust_name, Txtmessage: ", Thank you for selecting Salaam Life And Savings for your financial protection. The relevant documents of your membership no " + NEW_POL_NO + " have been sent to you via email. The PMD also contains 14 days free look cancellation clause. To confirm receipt of membership documents, please respond to this message with '1'. In case you have not received the documents, please immediately contact CS@salaamtakaful.com via WhatsApp/UAN on 021-111-875-111.", phoneNumber: cust_number
                                            }
                                        }).done(function (msg) {
                                        });
                                        if (this.SUM_USER_EMAIL_ADDR != null) {
                                            let doc_code = sessionStorage.getItem("docIdPrpsl");
                                            doc_code = 'DOC' + doc_code;
                                            let email = this.SUM_USER_EMAIL_ADDR;
                                            let subject = "Welcome Email(Your Policy No " + NEW_POL_NO + ")";
                                            let msgEmail = "M";
                                            $.ajax({
                                                "crossDomain": true,
                                                url: "" + Result_API + "/api/EMAIL/POST_SendEmailNotification/" + email + "/" + FPDM_PROPOSAL_NO + "/" + doc_code + "/" + subject + "/" + cust_name + "/" + msgEmail + "/" + CLLCT_AMOUNT,
                                                type: "POST",
                                                headers: {
                                                    'Content-Type': 'application/x-www-form-urlencoded',
                                                    'Access-Control-Allow-Origin': Result_API,
                                                    'Access-Control-Allow-Methods': 'POST, GET',
                                                    'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                                                    'Authorization': 'Bearer ' + getsession
                                                },
                                                datatype: JSON,
                                                contentType: "application/json; charset=utf-8",
                                                success: function (result) {
                                                },
                                                error: function (jqXHR, textStatus, errorThrown) {
                                                    if (jqXHR.status === 401) {
                                                    }
                                                }
                                            });
                                            window.setTimeout(function () {
                                                sessionStorage.clear();
                                                localStorage.clear();
                                                $.post("/User/removeSessionValue", function (token) {
                                                    window.location.href = "/"
                                                });
                                            }, 7000)
                                        }
                                    })
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    if (jqXHR.status === 401) {
                                    }
                                }
                            });
                        }
                        if (userID == null) {
                            $.ajax({
                                "crossDomain": true,
                                url: "" + Result_API + "/api/PosUser/GetUserByUserCd/" + sessionStorage.getItem("cnic."),
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
                                    $(result).each(function () {
                                        let cust_name = this.SUM_FULL_NAME;
                                        let cust_number = (this.SUM_CUST_CONTPHONE).slice(1);
                                        CLLCT_AMOUNT = CLLCT_AMOUNT.slice(0, CLLCT_AMOUNT.length - 2);
                                        let nf = new Intl.NumberFormat('en-US');
                                        CLLCT_AMOUNT = nf.format(CLLCT_AMOUNT);

                                        $.ajax({
                                            type: "POST",
                                            url: "/User/SendSMS",
                                            data: {
                                                username: cust_name, Txtmessage: ", Thank you for paying the contribution PKR " + CLLCT_AMOUNT + " for your Takaful application " + NEW_POL_NO + ". For any further assistance, please contact CS@salaamtakaful.com via WhatsApp/UAN on 021-111-875-111.", phoneNumber: cust_number
                                            }
                                        }).done(function (msg) {
                                        });
                                        $.ajax({
                                            type: "POST",
                                            url: "/User/SendSMS",
                                            data: {
                                                username: cust_name, Txtmessage: ", Thank you for selecting Salaam Life & Savings for your financial protection. The relevant documents of your membership no " + NEW_POL_NO + " have been sent to you via email. The PMD also contains 14 days free look cancellation clause. To confirm receipt of membership documents, please respond to this message with '1'. In case you have not received the documents, please immediately contact CS@salaamtakaful.com via WhatsApp/UAN on 021-111-875-111.", phoneNumber: cust_number
                                            }
                                        }).done(function (msg) {
                                        });
                                        if (this.SUM_USER_EMAIL_ADDR != null) {

                                            let doc_code = sessionStorage.getItem("docIdPrpsl");
                                            doc_code = 'DOC' + doc_code;
                                            let email = this.SUM_USER_EMAIL_ADDR;
                                            let subject = "Welcome Email(Your Policy No " + NEW_POL_NO + ")";
                                            let msgEmail = "M";
                                            $.ajax({
                                                "crossDomain": true,
                                                url: "" + Result_API + "/api/EMAIL/POST_SendEmailNotification/" + email + "/" + FPDM_PROPOSAL_NO + "/" + doc_code + "/" + subject + "/" + cust_name + "/" + msgEmail + "/" + CLLCT_AMOUNT,
                                                type: "POST",
                                                headers: {
                                                    'Content-Type': 'application/x-www-form-urlencoded',
                                                    'Access-Control-Allow-Origin': Result_API,
                                                    'Access-Control-Allow-Methods': 'POST, GET',
                                                    'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                                                    'Authorization': 'Bearer ' + getsession
                                                },
                                                datatype: JSON,
                                                contentType: "application/json; charset=utf-8",
                                                success: function (result) {
                                                },
                                                error: function (jqXHR, textStatus, errorThrown) {
                                                    if (jqXHR.status === 401) {
                                                    }
                                                }
                                            });
                                            window.setTimeout(function () {
                                                sessionStorage.clear();
                                                localStorage.clear();
                                                $.post("/User/removeSessionValue", function (token) {
                                                    window.location.href = "/"
                                                });
                                            }, 7000)
                                        }
                                    })
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    if (jqXHR.status === 401) {
                                    }
                                }
                            });
                        }
                    }
                    else {
                        $("#policyfailed").removeAttr("hidden", true);
                        $("#policyText").attr("hidden", true);
                        let policyFailure = document.getElementById("policyfailed");
                        policyFailure.innerHTML = 'Please check your email for policy attachments or respond to sms sent to your provided contact Number';
                    }
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401) {
            }
        }
    });
}