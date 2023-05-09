!function () {
    $(document).ready(function () {
        let nf = new Intl.NumberFormat('en-US');
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
    })
}()
function checkValue(val) {
    if (val == 1) {
        $(".paymode-select").attr("hidden", true);
        $("#HS_TransactionReferenceNumber").val("");
        $("#TransactionReferenceNumber").val("");
        $("#TransactionAmount").val("");
        $('input[name="P_DOCUMENT_ID"]').val("");
        $('input[name="FIPR_COLL_AMOUNT"]').val("");
        $('input[name="PaymentType"]').val("");

        $(".indexation-contribution").removeAttr("hidden", true)
        $(".topup").attr("hidden", true)
    } if (val == 2) {
        $(".paymode-select").attr("hidden", true);
        let proposal_no = sessionStorage.getItem("Proposal_NoF");
        $("#policy_number").val(sessionStorage.getItem("PolicyNo"));
        $('input[name="P_DOCUMENT_ID"]').val("");
        $('input[name="FIPR_COLL_AMOUNT"]').val("");
        $('input[name="PaymentType"]').val("");

        $("#HS_TransactionReferenceNumber").val("");
        $("#TransactionReferenceNumber").val("");
        $("#TransactionAmount").val("");
        $.ajax({
            "crossDomain": true,
            url: Global_API + "/API/NEW_BUSINESS/GET_CUSTOMER_PROP_FUND/" + proposal_no + "/Y/Y",
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
                console.log(result)
                $(result).each(function () {
                    $(".fund_name").html(this.FUND_NAME);
                })
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 401) {
                }
            }
        });
        $(".indexation-contribution").attr("hidden", true)
        $(".paymode-select").attr("hidden", true)
        $(".topup").removeAttr("hidden", true)
    }
}
function calculateTotalPayment(Amount) {
    $("#TOTAL_AMOUNT").val(Amount)
}
function paymentSelection(elemID) {
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
            $("#P_DOCUMENT_ID").val(sessionStorage.getItem("Proposal_NoF"));
            $("#FIPR_COLL_AMOUNT").val(gross_payment);
            $("#PaymentType").val("CC");
            $(".bank_charges").html("2.6%")
            $("#chargesDisclaimer").modal("show");
        })
        $("#btnNIFTPay").click(function () {
            $("#P_DOCUMENT_ID").val(sessionStorage.getItem("Proposal_NoF"));
            $("#FIPR_COLL_AMOUNT").val(gross_payment);
            $("#PaymentType").val("NI");
            $(".disclaimer-text").html("Free! Zero bank transactional fee on Bank Transfer & Easy Paisa Premium / Loan Payments!")
            //$(".bank_charges").html("Free")
            $("#chargesDisclaimer").modal("show");
        })
        $("#btnJazzCash").click(function () {
            $("#P_DOCUMENT_ID").val(sessionStorage.getItem("Proposal_NoF"));
            $("#FIPR_COLL_AMOUNT").val(gross_payment);
            $("#PaymentType").val("JC");
        })
        $("#btnEasyPaisaPay").click(function () {
            $("#P_DOCUMENT_ID").val(sessionStorage.getItem("Proposal_NoF"));
            $("#FIPR_COLL_AMOUNT").val(gross_payment);
            $("#PaymentType").val("EP");
        })
    } else {
        alert('The gross payment input is not checked');
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