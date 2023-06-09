!function () {
    $(document).ready(function () {
        if (sessionStorage.getItem("cnic.") == null) {
            window.location.href = "/";
            localStorage.clear();
            sessionStorage.clear();
        }
        else {
            var nf = new Intl.NumberFormat('en-US');
            let gross_amount = sessionStorage.getItem("GROSS_AMT");
            if (gross_amount != null) {

                //$(".non-index-contrib").append("<div class='input-group-append m-auto'>" +
                //    "<input class='form-control checkbox' type='checkbox' id='' />" +
                //    "</div>");
                $(".non-index-contrib").append('<p>PKR ' + nf.format(gross_amount) + '</p>')
                $(".index-contrib").append('<p>PKR ' + nf.format(gross_amount) + '</p>')
            }
            $("#btnPaymentopup").click(function () {
                if ($("#policy_number").val() != "" && $("#TOTAL_AMOUNT").val() != "") {
                    let orderId = Math.floor(Math.random() * 9000000) + 1000000;
                    orderId = orderId.toString();

                    $("#HS_TransactionReferenceNumber").val(orderId);
                    $("#TransactionReferenceNumber").val(orderId);
                    $("#TransactionAmount").val($("#TOTAL_AMOUNT").val());
                    $(".paymode-select").removeAttr("hidden", true);
                }
                $("#btnCreditCard").click(function () {
                    $("#P_DOCUMENT_ID").val(sessionStorage.getItem("Proposal_NoF"));
                    $("#FIPR_COLL_AMOUNT").val($("#TOTAL_AMOUNT").val());
                    $("#PaymentType").val("CC");
                    $(".bank_charges").html("2.6%")
                    $("#chargesDisclaimer").modal("show");
                })
                $("#btnNIFTPay").click(function () {
                    $("#P_DOCUMENT_ID").val(sessionStorage.getItem("Proposal_NoF"));
                    $("#FIPR_COLL_AMOUNT").val($("#TOTAL_AMOUNT").val());
                    $("#PaymentType").val("NI");
                    $(".disclaimer-text").html("Free! Zero bank transactional fee on Bank Transfer & Easy Paisa Premium / Loan Payments!")
                    //$(".bank_charges").html("Free")
                    $("#chargesDisclaimer").modal("show");
                })
                $("#btnJazzCash").click(function () {
                    $("#P_DOCUMENT_ID").val(sessionStorage.getItem("Proposal_NoF"));
                    $("#FIPR_COLL_AMOUNT").val($("#TOTAL_AMOUNT").val());
                    $("#PaymentType").val("JC");
                })
                $("#btnEasyPaisaPay").click(function () {
                    $("#P_DOCUMENT_ID").val(sessionStorage.getItem("Proposal_NoF"));
                    $("#FIPR_COLL_AMOUNT").val($("#TOTAL_AMOUNT").val());
                    $("#PaymentType").val("EP");
                })
            })
        }
    })
}()
function checkValue(val) {
    let custCNIC = sessionStorage.getItem("cnic.");
    if (custCNIC && custCNIC.length === 13) {
        custCNIC = custCNIC.slice(0, 5) + '-' + custCNIC.slice(5, 12) + '-' + custCNIC.slice(12);
    }
    if (val == 1) {
        $(".paymode-select").attr("hidden", true);
        $("#HS_TransactionReferenceNumber").val("");
        $("#TransactionReferenceNumber").val("");
        $("#TransactionAmount").val("");
        $('input[name="P_DOCUMENT_ID"]').val("");
        $('input[name="FIPR_COLL_AMOUNT"]').val("");
        $('input[name="PaymentType"]').val("");
        $(".proposal_Contribution").removeAttr("hidden", true)
        //$(".indexation-contribution").removeAttr("hidden", true)
        //$('.proposal_Contribution').attr("hidden", true)
        $(".policy-topup-no").attr("hidden", true)
        $(".topup-data").attr("hidden", true)
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
                if (result.length != 0) {
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].FPDM_POLICY_NO == null) {
                            $("#FPDM_PROPOSAL_NO").empty();
                            $("#FPDM_PROPOSAL_NO").append($("<option value=''>Select</option>"))
                            $("#FPDM_PROPOSAL_NO").append($("<option></option>").val(result[i].FPDM_PROPOSAL_NO).html(result[i].FPDM_PROPOSAL_NO));
                        }
                        else {
                            $("#FPDM_POLICY_NO").empty();
                            $("#FPDM_POLICY_NO").append($("<option value=''>Select</option>"))
                            $("#FPDM_POLICY_NO").append($("<option></option>").val(result[i].FPDM_POLICY_NO).html(result[i].FPDM_POLICY_NO))
                        }
                    }
                }
            },
            error: function (data2) { }
        });
    } if (val == 2) {
        $(".proposal_Contribution").attr("hidden",true)
        $(".paymode-select").attr("hidden", true);
        let proposal_no = sessionStorage.getItem("Proposal_NoF");
        $("#policy_number").val(sessionStorage.getItem("PolicyNo"));
        $('input[name="P_DOCUMENT_ID"]').val("");
        $('input[name="FIPR_COLL_AMOUNT"]').val("");
        $('input[name="PaymentType"]').val("");
        $("#HS_TransactionReferenceNumber").val("");
        $("#TransactionReferenceNumber").val("");
        $("#TransactionAmount").val("");
        $(".indexation-contribution").attr("hidden", true)
        $(".paymode-select").attr("hidden", true)
        $(".topup-data").attr("hidden",true)
        //if (proposal_no != null || proposal_no != "" || proposal_no != undefined) {
        //    showFund(proposal_no);
        //}
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
                console.log(result)
                if (result.length >= 1) {
                    $(".policy-topup-no").removeAttr("hidden")
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].FPDM_POLICY_NO != null) {
                            $("#policy_number").empty();
                            $("#policy_number").append($("<option value=''>Select</option>"))
                            $("#policy_number").append($("<option></option>").val(result[i].FPDM_POLICY_NO).html(result[i].FPDM_POLICY_NO));
                        }
                    }
                }
                if (result.length == 0) {
                    $(".policy-topup-no").attr("hidden")
                    Swal.fire({
                        icon: 'info',
                        title: 'Alert',
                        text: 'No policy has been issued yet! Please isssue your policy if you want to make a topup policy payment'
                    })
                }
            },
            error: function (data2) { }
        });
    }
}
function NB_Payments(Val, ID) {
    let proposalIn = document.getElementById("FPDM_PROPOSAL_NO");
    let policyIn = document.getElementById("FPDM_POLICY_NO");
    if (Val == 1) {
        $("#FPDM_POLICY_NO").attr("hidden", true);
        $(".indexation-contribution").attr("hidden", true);
        sessionStorage.setItem("PayCheck", "ProposalPay");
        $("#FPDM_POLICY_NO").attr("hidden", true);
        $("#FPDM_PROPOSAL_NO").val("");
        if (proposalIn.options.length == 1) {
            Swal.fire({
                icon: 'info',
                title: 'Alert',
                text: 'No proposal payment is left! Please generate a new proposal if you want to make a payment'
            })
        }
        if (proposalIn.options.length > 1) {
            $("#FPDM_PROPOSAL_NO").removeAttr("hidden", true);
        }
    }
    if (Val == 2) {
        sessionStorage.setItem("PayCheck", "RenewalPay");
        $("#FPDM_PROPOSAL_NO").attr("hidden", true);
        $(".indexation-contribution").attr("hidden", true);
        $("#FPDM_POLICY_NO").val("");
        if (policyIn.options.length == 1) {
            Swal.fire({
                icon: 'info',
                title: 'Alert',
                text: 'No policy has been issued yet! Please isssue your policy if you want to make a renewal policy payment'
            })
        }
        if (policyIn.options.length > 1) {
            $("#FPDM_POLICY_NO").removeAttr("hidden", true);
        }
    }
}
function PayContributionAmount(Val) {
    var nf = new Intl.NumberFormat('en-US');
    if (Val != "") {
        let custCNIC = sessionStorage.getItem("cnic.");
        if (custCNIC[5] != "-" && custCNIC[13] != "-") {
            let n1 = custCNIC.substring(0, 5);
            let n2 = custCNIC.substring(5, 12);
            let addn = n1 + "-" + n2 + "-" + custCNIC[custCNIC.length - 1]
            custCNIC = addn;
        }
        if (sessionStorage.getItem("PayCheck") == "ProposalPay") {
            sessionStorage.setItem("Proposal_NoF", $("#FPDM_PROPOSAL_NO").val());
        }
        if (sessionStorage.getItem("PayCheck") == "RenewalPay") {
            sessionStorage.setItem("Policy_NoF", $("#FPDM_POLICY_NO").val());
        }
        $.ajax({
            "crossDomain": true,
            url: Global_API + "/api/Inquiry/GetInquiryByUsername/" + custCNIC,
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
                    if (this.FPDM_POLICY_NO == Val) {
                        sessionStorage.setItem("GROSS_AMT", this.FPDM_GROSSCONTRIB);
                        $(".non-index-contrib").html('<p>Non-index Contribution</p><p>PKR ' + nf.format(this.FPDM_GROSSCONTRIB) + '</p>')
                        $(".index-contrib").html('<p>Index Contribution</p><p>PKR ' + nf.format(this.FPDM_GROSSCONTRIB) + '</p>');
                    } if (this.FPDM_PROPOSAL_NO == Val) {
                        sessionStorage.setItem("GROSS_AMT", this.FPDM_GROSSCONTRIB);
                        $(".non-index-contrib").html('<p>Non-index Contribution</p><p>PKR ' + nf.format(this.FPDM_GROSSCONTRIB) + '</p>')
                        $(".index-contrib").html('<p>Index Contribution</p><p>PKR ' + nf.format(this.FPDM_GROSSCONTRIB) + '</p>');
                    }
                })
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 401) {
                }
            }
        });
        $(".indexation-contribution").removeAttr("hidden", true);
    }
}
function showFund(ProposalNum, PolicyNumb) {
    let custCNIC = sessionStorage.getItem("cnic.");
    if (custCNIC[5] != "-" && custCNIC[13] != "-") {
        let n1 = custCNIC.substring(0, 5);
        let n2 = custCNIC.substring(5, 12);
        let addn = n1 + "-" + n2 + "-" + custCNIC[custCNIC.length - 1]
        custCNIC = addn;
    }
    if (PolicyNumb != null || PolicyNumb != undefined) {
        $.ajax({
            "crossDomain": true,
            url: Global_API + "/api/Inquiry/GetInquiryByUsername/" + custCNIC,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': Global_API,
                'Access-Control-Allow-Methods': 'POST, GET',
                'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                'Authorization': 'Bearer ' + getsession
            },
            datatype: 'jsonp',
            success: function (result) {               
                $(result).each(function () {
                    if (this.FPDM_POLICY_NO == PolicyNumb) {
                        $(".topup-data").removeAttr("hidden", true);
                        showFund(this.FPDM_PROPOSAL_NO);
                    }
                })
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 401) {
                }
            }
        });
    }
    if (ProposalNum != null || ProposalNum != "") {
        $.ajax({
            "crossDomain": true,
            url: Global_API + "/API/NEW_BUSINESS/GET_CUSTOMER_PROP_FUND/" + ProposalNum + "/Y/Y",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': Global_API,
                'Access-Control-Allow-Methods': 'POST, GET',
                'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                'Authorization': 'Bearer ' + getsession
            },
            datatype: 'jsonp',
            success: function (result) {
                $(".topup-data").removeAttr("hidden", true);
                $(result).each(function () {
                    $(".fund_name").html(this.FUND_NAME);
                })
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 401) {
                }
            }
        });
    }
}
function calculateTotalPayment(Amount) {
    if (Amount == "" || Amount == undefined) {
        $("#TOTAL_AMOUNT").val($("#fund_payment").val());
    } else {
        $("#TOTAL_AMOUNT").val(Amount)
    }
}
function paymentSelection() {
    let gross_payment = sessionStorage.getItem("GROSS_AMT");
    let nonindexcontrib = $("#nonIndexContrib");
    let indexcontrib = $("#IndexContrib");

    if (nonindexcontrib.prop('checked') || indexcontrib.prop('checked')) {
        let orderID = Math.floor(Math.random() * 9000000) + 1000000;
        orderID = orderID.toString();

        $("#HS_TransactionReferenceNumber").val(orderID);
        $("#TransactionReferenceNumber").val(orderID);
        $("#TransactionAmount").val(gross_payment);
        //$("#P_DOCUMENT_ID").val(sessionStorage.getItem("Proposal_NoF"));
        //$("#FIPR_COLL_AMOUNT").val(gross_payment);
        $(".paymode-select").removeAttr("hidden", true);
        $("#btnCreditCard").click(function () {
            if (sessionStorage.getItem("PayCheck") == "ProposalPay") {
                $("#P_DOCUMENT_ID").val(sessionStorage.getItem("Proposal_NoF"));
            }
            if (sessionStorage.getItem("PayCheck") == "RenewalPay") {
                $("#P_DOCUMENT_ID").val(sessionStorage.getItem("Policy_NoF"));
            }
            $("#FIPR_COLL_AMOUNT").val(gross_payment);
            $("#PaymentType").val("CC");
            $(".bank_charges").html("2.6%")
            $("#chargesDisclaimer").modal("show");
        })
        $("#btnNIFTPay").click(function () {
            if (sessionStorage.getItem("PayCheck") == "ProposalPay") {
                $("#P_DOCUMENT_ID").val(sessionStorage.getItem("Proposal_NoF"));
            }
            if (sessionStorage.getItem("PayCheck") == "RenewalPay") {
                $("#P_DOCUMENT_ID").val(sessionStorage.getItem("Policy_NoF"));
            }
            $("#FIPR_COLL_AMOUNT").val(gross_payment);
            $("#PaymentType").val("NI");
            $(".disclaimer-text").html("Free! Zero bank transactional fee on Bank Transfer & Easy Paisa Premium / Loan Payments!")
            //$(".bank_charges").html("Free")
            $("#chargesDisclaimer").modal("show");
        })
        $("#btnJazzCash").click(function () {
            if (sessionStorage.getItem("PayCheck") == "ProposalPay") {
                $("#P_DOCUMENT_ID").val(sessionStorage.getItem("Proposal_NoF"));
            }
            if (sessionStorage.getItem("PayCheck") == "RenewalPay") {
                $("#P_DOCUMENT_ID").val(sessionStorage.getItem("Policy_NoF"));
            }
            $("#FIPR_COLL_AMOUNT").val(gross_payment);
            $("#PaymentType").val("JC");
        })
        $("#btnEasyPaisaPay").click(function () {
            if (sessionStorage.getItem("PayCheck") == "ProposalPay") {
                $("#P_DOCUMENT_ID").val(sessionStorage.getItem("Proposal_NoF"));
            }
            if (sessionStorage.getItem("PayCheck") == "RenewalPay") {
                $("#P_DOCUMENT_ID").val(sessionStorage.getItem("Policy_NoF"));
            }
            $("#FIPR_COLL_AMOUNT").val(gross_payment);
            $("#PaymentType").val("EP");
        })
    } else {
        Swal.fire({
            icon: 'info',
            title: 'Alert',
            text: 'The gross payment input is not checked!',
        })
    }
}
function HandShakeOrderId(elem) {
    $(elem).attr('disabled', 'disabled');
    $("#handshake").attr('disabled', 'disabled');
    submitRequest("HandshakeForm");
    if ($("#HS_IsRedirectionRequest").val() == "1") {
        document.getElementById("HandshakeForm").submit();
    }
    else {
        var myData = {
            HS_MerchantId: $("#HS_MerchantId").val(),
            HS_StoreId: $("#HS_StoreId").val(),
            HS_MerchantHash: $("#HS_MerchantHash").val(),
            HS_MerchantUsername: $("#HS_MerchantUsername").val(),
            HS_MerchantPassword: $("#HS_MerchantPassword").val(),
            HS_IsRedirectionRequest: $("#HS_IsRedirectionRequest").val(),
            HS_ReturnURL: $("#HS_ReturnURL").val(),
            HS_RequestHash: $("#HS_RequestHash").val(),
            HS_ChannelId: $("#HS_ChannelId").val(),
            HS_TransactionReferenceNumber: $("#HS_TransactionReferenceNumber").val(),
        }
        let trans_date = new Date();
        let trans_Month = trans_date.getMonth() + 1;
        if (("" + trans_Month).length == 1) {
            trans_Month = "0" + trans_Month;
        }
        trans_date = trans_Month + "-" + trans_date.getDate() + "-" + trans_date.getFullYear();

        $.ajax({
            type: 'POST',
            url: 'https://sandbox.bankalfalah.com/HS/HS/HS',
            contentType: "application/x-www-form-urlencoded",
            data: myData,
            dataType: "json",
            beforeSend: function () {
            },
            success: function (r) {
                if (r != '') {
                    if (r.success == "true") {
                        $("#AuthToken").val(r.AuthToken);
                        $("#ReturnURL").val(r.ReturnURL);
                        sessionStorage.setItem("profile_id", $("#ChannelId").val());
                        sessionStorage.setItem("id", '3');
                        sessionStorage.setItem("amount_cents", $("#TransactionAmount").val());
                        sessionStorage.setItem("integration_id", $("#MerchantId").val());
                        sessionStorage.setItem("data.message", "Approved");
                        sessionStorage.setItem("created_at", trans_date);

                        console.log('Success: Handshake Successful');
                        $("#run").click();
                    }
                    else {
                        alert('Error: Handshake Unsuccessful');
                    }
                }
                else {
                    alert('Error: Handshake Unsuccessful');
                }
            },
            error: function (error) {
                alert('Error: An error occurred');
            },
            complete: function (data) {
                $("#handshake").removeAttr('disabled', 'disabled');
            }
        });
    }
}
function submitRequest(formName) {
    var mapString = '', hashName = 'RequestHash';
    if (formName == "HandshakeForm") {
        hashName = 'HS_' + hashName;
    }

    $("#" + formName + " :input").each(function () {
        if ($(this).attr('id') != '') {
            mapString += $(this).attr('id') + '=' + $(this).val() + '&';
        }
    });

    $("#" + hashName).val(CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(mapString.substr(0, mapString.length - 1)), CryptoJS.enc.Utf8.parse($("#Key1").val()),
        {
            keySize: 128 / 8,
            iv: CryptoJS.enc.Utf8.parse($("#Key2").val()),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }));
}