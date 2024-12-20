﻿!function () {
    $("#spinner").hide();
    $('#contact').val("+92");
    let contact_no = document.querySelector("#contact");
    window.intlTelInput(contact_no);
    $(".iti--allow-dropdown").addClass("w-100",true);
    $("#btnUserLogin").click(function () {
        if ($("#SUM_SYS_USER_CODE").val() != "" && $("#SUM_USER_PASSWORD").val() != "") {
            sessionStorage.setItem("cnic.", $("#SUM_SYS_USER_CODE").val());
            sessionStorage.getItem("cnic.");
        }
    })
    setTimeout(function () {
        $(".validation-alert").fadeTo(500, 0).slideUp(500, function () {
            $(this).remove();
        });
    }, 4000);
    $("#createAcc").click(function () {
        //sessionStorage.clear();
        localStorage.clear();
    })
    $("#settings-trigger").attr("hidden", true);
    $('.form-horizontal').submit(function () {
        $("#spinner").show();
    });
    $("#forgetAcc").click(function () {
        $("#recoverySetup-tab").click();
    })
    $("#backToLogin").click(function () {
        $("#signIn-tab").click();
    })
    $("#btnUpdatePassword").click(function () {
        let passwdToChange = $("#newpass").val();
        let passwdConfirm = $("#confirmpaswd").val();
        if (passwdToChange === passwdConfirm) {
            return true;
        } else
            return false;
    })
}();

function formatNumber(input) {
    // Remove any existing commas and non-digit characters from the input value
    let rawValue = input.value.replace(/,/g, '').replace(/\D/g, '');

    // Convert the raw value to a number
    let number = parseInt(rawValue, 10);

    // Add commas back to the number
    input.value = number.toLocaleString();
}

function togglePasswordVisibility() {
    var passwordInput = document.getElementById("SUM_USER_PASSWORD");
    var icon = document.querySelector(".password-toggle i");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}
//function showAgreementModal(Text) {
//    Swal.fire({
//        title: 'Terms & Condition',
//        html: select,
//        icon: 'info',
//        confirmButtonText: 'Agree',
//        showCancelButton: true,
//        allowOutsideClick: () => false
//    }).then((result) => {
//        if (result.isConfirmed) {
//            window.location.href = '';
//        }
//    });
//}
//document.addEventListener("DOMContentLoaded", function () {
//    function deleteCookie(cookieName) {
//        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//        // Also, clear the cookie for the current domain and path
//        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
//    }

//    document.querySelector(".sign_out").addEventListener('click', function () {
//        var cookieName = "Session"; // Replace "your_cookie_name" with the actual name of the cookie
//        deleteCookie(cookieName);
//        window.location.href = "/";
//        sessionStorage.clear();
//        localStorage.clear();
//    });
//});

function readURLFront(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imageResultFront')
                .attr('src', e.target.result);
            $('#imageResultFront')
                .addClass('w-50');
        };
        reader.readAsDataURL(input.files[0]);
    }
}
function readURLBack(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imageResultBack')
                .attr('src', e.target.result);
            $('#imageResultBack')
                .addClass('w-50');
        };
        reader.readAsDataURL(input.files[0]);
    }
}
function readURLPrsnl(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imageResultPrsnl')
                .attr('src', e.target.result);
            $('#imageResultPrsnl')
                .addClass('w-50');
        };
        reader.readAsDataURL(input.files[0]);
    }
}
function openGuardianInfo(Val) {
    if (Val < 18) {
        $("#guardian_infoRow").removeAttr("hidden", true);
        //$("#guardian_name").attr("required",true);
        //$("#guardian_cnic").attr("required", true);
        //$("#guardian_age").attr("required", true);
    }
    else {
        $("#guardian_infoRow").attr("hidden", true);
        $("#guardian_name").val("");
        $("#guardian_cnic").val("");
        $("#guardian_age").val("");
    }
}
const formData = new FormData();
let nf = new Intl.NumberFormat('en-US');

let objDmsHdr = {
    FPDH_POLICY_NO: null,
    FPDH_DMSCUS_CNIC: null,
    FPDH_DESCRIPTION: "Cash Slip",
    FPDH_SHORT_DESCR: "Cash Slip",
    FPDH_APPROVED_YN: 'Y',
    FPDH_STATUS: 'Y'
}
if (sessionStorage.getItem("cnic.") != null) {
    objDmsHdr.FPDH_DMSCUS_CNIC = sessionStorage.getItem("cnic.");
}
//else {
//    objDmsHdr.FPDH_DMSCUS_CNIC = sessionStorage.getItem("DocCNIC").replaceAll("-", "");
//}

function PaymentByCash(PolicyNum) {
    //objDmsHdr = JSON.parse(objDmsHdr)
    //    alert($(".ContribAmtoPay").html())
    let paymentAmount = '';
    if ($(".ContribAmtoPay").html() != undefined) {
        paymentAmount = $(".ContribAmtoPay").html();
        if ($("#FPDM_POLICY_NO").val() != "") {
            PolicyNum = $("#FPDM_POLICY_NO").val();
            objDmsHdr.FPDH_POLICY_NO = PolicyNum;
        }
    }
    else {
        if ($("#TOTAL_AMOUNT").val() != "" || $("#TOTAL_AMOUNT").val() != undefined) {
            if ($("#FPDM_POLICY_NO").val() != "") {
                PolicyNum = $("#FPDM_POLICY_NO").val();
                objDmsHdr.FPDH_POLICY_NO = PolicyNum;
            }
            paymentAmount = $("#TOTAL_AMOUNT").val();
        } else {
            paymentAmount = sessionStorage.getItem("CONTRIB_AMOUNT_DMS");
        }
    }
    objDmsHdr = JSON.stringify(objDmsHdr);

    Swal.fire({
        title: 'Cash/ Cheque',
        html: `
        <h4 class="mt-3 line-height-2">Dear customer, you have to pay amount PKR ${paymentAmount}, after paying the contribution amount please upload your slip here</p>
        <input type="file" id="fileUpload" name="FPDD_PATH" class="swal2-input mb-2">`,
        confirmButtonText: 'Submit',
        showCancelButton: true,
        preConfirm: () => {
            //const selectedOption = select.value;
            //const bankName = document.getElementById('bankName').value;
            const fileUpload = document.getElementById('fileUpload').files[0];
            formData.append('file', fileUpload);

            //if (selectedOption === '') {
            //    Swal.showValidationMessage('Please select your proposal number');
            //}
            //    if (bankName === '') {
            //        Swal.showValidationMessage('Please enter the bank name');
            //}
            if (!fileUpload) {
                Swal.showValidationMessage('Please upload a file');
            } else {
                return {
                    //selectedOption: selectedOption,
                    //bankName: bankName,
                    fileUpload: fileUpload
                }
            }
        },
        allowOutsideClick: () => false
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                "crossDomain": true,
                url: Result_API + "/API/DMS/POST_DMS_HDR",
                type: "POST",
                headers: {
                    //'Content-Type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': Result_API,
                    'Access-Control-Allow-Methods': 'POST, GET',
                    'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                    'Authorization': 'Bearer ' + getsession
                },
                contentType: "application/json; charset=utf-8",
                datatype: JSON,
                data: objDmsHdr,
                success: function (result) {
                    let dmsHdrId = result[0].NEW_DMSHDR_ID;
                    $.ajax({
                        url: '/User/uploadFile',
                        type: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function (result) {
                            let objDmsDtls = {
                                FPDH_DMSHDR_ID: dmsHdrId,
                                FPDD_PATH: result,
                            }
                            objDmsDtls = JSON.stringify(objDmsDtls);
                            $.ajax({
                                "crossDomain": true,
                                url: Result_API + "/API/DMS/POST_DMS_DETAILS",
                                type: "POST",
                                headers: {
                                    //'Content-Type': 'application/x-www-form-urlencoded',
                                    'Access-Control-Allow-Origin': Result_API,
                                    'Access-Control-Allow-Methods': 'POST, GET',
                                    'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                                    'Authorization': 'Bearer ' + getsession
                                },
                                contentType: "application/json; charset=utf-8",
                                datatype: JSON,
                                data: objDmsDtls,
                                success: function (result) {
                                    if (result[0].NEW_DMSDTL_ID != null) {
                                        Swal.fire({
                                            text: 'Thanks for paying the contribution',
                                            icon: 'success'
                                        }).then((result) => {
                                            if (result.isConfirmed) {
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
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 401) {
                    }
                }
            });
        }
    });
}
function PolicyNumberSelection() {
    let thisCustCNIC = sessionStorage.getItem("cnic.");
    if (thisCustCNIC[5] != "-" && thisCustCNIC[13] != "-") {
        let n1 = thisCustCNIC.substring(0, 5);
        let n2 = thisCustCNIC.substring(5, 12);
        let addn = n1 + "-" + n2 + "-" + thisCustCNIC[thisCustCNIC.length - 1]
        thisCustCNIC = addn;
    }
    let PolicyNumbers = sessionStorage.getItem("policyResult").split(",");

    const select = document.createElement('select');
    const optionselect = document.createElement('option');
    optionselect.textContent = 'Select';
    optionselect.value = '';
    select.appendChild(optionselect);

    //select.className = "form-control";
    // Generate the options dynamically
    PolicyNumbers.forEach((policyNo) => {
        const option = document.createElement('option');
        option.textContent = policyNo;
        option.value = policyNo;
        select.appendChild(option);
    });
    Swal.fire({
        title: 'Please select your Policy Number:',
        html: select,
        confirmButtonText: 'Submit',
        showCancelButton: true,
        preConfirm: () => {
            const selectedOption = select.value;
            if (selectedOption === '') {
                Swal.showValidationMessage('Please select your policy number');
            } else {
                return selectedOption;
            }
        },
        allowOutsideClick: () => false
    }).then((result) => {
        if (result.isConfirmed) {
            const selectedPolicy = result.value;
            $(".serviceProcess").removeAttr("hidden", true);
            $(".service-policy").removeAttr("hidden", true);
            $(".policy_no").html(selectedPolicy);
            $("#FSSH_POL_CODE").val(selectedPolicy);
            $.ajax({
                "crossDomain": true,
                url: Global_API + "/api/Inquiry/GetInquiryByUsername/" + thisCustCNIC,
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
                        if (this.FPDM_POLICY_NO == selectedPolicy) {
                            ProposalCashValues(this.FPDM_PROPOSAL_NO, this.FPDM_APPROVED, this.FCDM_PLAN_CONTRIB);
                        }
                    })
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 401) {
                    }
                }
            });

            // Perform your desired action with the selected policy value
            // For example, update the HTML content with the selected policy
        }
    });
}

function ProposalCashValues(selectdProposalNo, status, contribAmount) {
    $("#FPDM_PROPOSAL_NO").val(selectdProposalNo);
    let thisCustCNIC = sessionStorage.getItem("cnic.");
    thisCustCNIC = thisCustCNIC.replace(/^(\d{5})(\d{7})(\d)$/, "$1-$2-$3");
    let nf = new Intl.NumberFormat('en-US');
    let getsession = sessionStorage.getItem("tokenIndex");
    //let proposal_no = sessionStorage.getItem("Proposal_NoF");
    //if (proposal_no == null) {
    //    proposal_no = selectdProposalNo;
    //}
    $.ajax({
        "crossDomain": true,
        url: Global_API + "/API/NEW_BUSINESS/GET_CUSTOMER_PROP_FUND/" + selectdProposalNo + "/Y/" + status,
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
            $(".refund_amount").html(nf.format(contribAmount));
            $(".contrib_paid").html("<p class='text-center'>Total Takaful Contribution Paid</p><p class='text-center'>PKR " + nf.format(contribAmount) + "</p>");
            $("#FSSH_SRNDR_AMT").val(contribAmount);
            $("#FSSH_FREELOOK_AMT").val(contribAmount);

            $(result).each(function () {
                let cashValue = this.FPDF_CASHVALUE_BC;
                if (cashValue == null) {
                    cashValue = contribAmount;
                }
                let units = this.FPDF_UNITS_END;
                if (units == null) {
                    units = "N/A";
                    $(".text-cash").removeAttr("hidden", true);
                }
                let bidPrice = this.FPDF_BIDPRICE;
                if (bidPrice == null) {
                    bidPrice = "N/A";
                    $(".text-cash").removeAttr("hidden", true);
                }
                let residualVal = (10 / 100) * (cashValue);
                $(".currentCashValue").html("<p class='text-center'>Current Cash Value</p><p class='text-center'>PKR " + nf.format(cashValue) + "</p>");
                $(".residual_val").html("<p class='text-center'>Residual Value (10%)</p><p class='text-center'>PKR " + nf.format(residualVal) + "</p>")
                let withdrwlAmount = cashValue - residualVal;
                sessionStorage.setItem("withdrwlAmount", withdrwlAmount);
                $(".withdrwlAmount").html(nf.format(withdrwlAmount) + " only");
                $(".withdrwlText").removeAttr("hidden", true);
                $("#FSSH_PW_AMT").attr("max", withdrwlAmount);
            })
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401) {
            }
        }
    });
    //$.ajax({
    //    "crossDomain": true,
    //    url: Result_API + "/api/DcmntNominee/GetPrpslDetails/" + selectdProposalNo + "/Y",
    //    type: "GET",
    //    contentType: "application/json; charset=utf-8",
    //    headers: {
    //        'Content-Type': 'application/x-www-form-urlencoded',
    //        'Access-Control-Allow-Origin': Result_API,
    //        'Access-Control-Allow-Methods': 'POST, GET',
    //        'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
    //        'Authorization': 'Bearer ' + getsession
    //    },
    //    datatype: 'jsonp',
    //    success: function (result) {
    //        $(result).each(function () {
    //            $(".refund_amount").html(nf.format(this.CONTRIB_AMOUNT));
    //            $(".contrib_paid").html("<p class='text-center'>Total Takaful Contribution Paid</p><p class='text-center'>PKR " + nf.format(this.CONTRIB_AMOUNT) + "</p>");
    //            $("#FSSH_SRNDR_AMT").val(this.CONTRIB_AMOUNT);
    //            $("#FSSH_FREELOOK_AMT").val(this.CONTRIB_AMOUNT);
    //        })
    //    },
    //    error: function (jqXHR, textStatus, errorThrown) {
    //        if (jqXHR.status === 401) {
    //        }
    //    }
    //});
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
                $("#SUM_FULL_NAME").val(this.SUM_FULL_NAME);
                $("#SUM_CUST_CONTPHONE").val(this.SUM_CUST_CONTPHONE)
                $("#SUM_USER_EMAIL_ADDR").val(this.SUM_USER_EMAIL_ADDR)
            })
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401) {
            }
        }
    });
    $.ajax({
        "crossDomain": true,
        url: "" + Global_API + "/API/CUSTOMER/SEARCH_CUSTOMER/" + thisCustCNIC,
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
                $("#FSCU_CUSTOMER_CODE").val(this.FSCU_CUSTOMER_CODE);
                $.ajax({
                    "crossDomain": true,
                    url: "" + Global_API + "/API/CUSTOMER_BANK_DETL/GET_CUST_BANK_DETAILS/" + this.FSCU_CUSTOMER_CODE,
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
                        if (result.length != 0) {
                            $(result).each(function () {
                                $("#FSBK_BANK_NAME").val(this.FSBK_BANK_NAME);
                                $("#FSCB_BRANCH_NAME").val(this.FSCB_BRANCH_NAME);
                                $("#FSCB_ACCOUNT_TITLE").val(this.FSCB_ACCOUNT_TITLE);
                                $("#FSCB_ACCOUNT_NO").val(this.FSCB_ACCOUNT_NO);
                            })
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if (jqXHR.status === 401) {
                        }
                    }
                });
            })
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401) {
            }
        }
    });

    $("#btnProceedWthdrw").click(function () {
        if ($("#SUM_CUST_CONTPHONE").val() != null && $("#FSSH_POL_CODE").val() != null && $("#FSSH_PW_AMT").val() != "" && $("#FSSH_PW_AMT").val() <= Number(sessionStorage.getItem("withdrwlAmount"))) {
            Swal.fire({
                title: 'Please Confirm',
                confirmButtonText: 'I want to proceed',
                showCancelButton: true,
                cancelButtonText: 'Change my Mind',
                allowOutsideClick: () => false
            }).then((result) => {
                if (result.isConfirmed) {
                    AgreeFinService();
                }
            });
        }
    })
    $("#btnProceedFreeLook").click(function () {
        if ($("#SUM_CUST_CONTPHONE").val() != null && $("#FSSH_POL_CODE").val() != null) {
            Swal.fire({
                title: 'Please Confirm',
                confirmButtonText: 'I want to proceed',
                showCancelButton: true,
                cancelButtonText: 'Change my Mind',
                allowOutsideClick: () => false
            }).then((result) => {
                if (result.isConfirmed) {
                    AgreeFinService();
                }
            });
        }
    })

    $("#verifyOTP").click(function () {
        let digitsArray = [];
        let codeNumbersLi = document.getElementsByClassName("code-number")
        for (let i = 0; i < codeNumbersLi[0].children.length; i++) {
            digitsArray.push(codeNumbersLi[0].children[i].children[0].value)
        }
        let CodeDigits = digitsArray.join("");
        if (digitsArray.length == 6) {
            if (CodeDigits == sessionStorage.getItem("code")) {
                $(".alert-otp").removeAttr("hidden", true);
                window.setTimeout(function () {
                    $(".alert-otp").attr("hidden", true);
                    $("#VerifyModal").modal("hide");
                    $("#custBankDtls").modal("show");
                }, 2500);
            }
        }
    })
    $("#closeRequest").click(function () {
        sessionStorage.removeItem("code");
        $("#custBankDtls").modal("hide");
    })
}

function sendCode(transactionID, cust_number, cust_name, cust_email) {
    $.ajax({
        url: "https://api.itelservices.net/send.php?transaction_id=" + transactionID + "&user=salaamtakaf&pass=kdPre&number=" + cust_number + "&text=Dear " + cust_name + ", your OTP verification code is " + (transactionID).slice(0, 6) + "&from=44731&type=sms",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        datatype: JSON,
        success: function (result) {
        },
        error: function (data2) { }
    });
    transactionID = (transactionID).slice(0, 6);
    $.ajax({
        type: "POST",
        url: "/User/SendEmailMsg",
        data: { username: cust_name, messageEmail: "<p>Your OTP verification code is " + transactionID + "</p>", emailAddress: cust_email, subject: "OTP" }
    }).done(function (msg) {
    });
}
function AgreeFinService() {
    $("#AgreementModal").modal("hide");
    let cust_number = ($("#SUM_CUST_CONTPHONE").val()).slice(1);
    let cust_name = $("#SUM_FULL_NAME").val();
    let cust_email = $("#SUM_USER_EMAIL_ADDR").val();
    let digits = "0123456789";
    let transactionID = '';
    for (let i = 0; i < 8; i++) {
        transactionID += digits[Math.floor(Math.random() * 10)]
    }
    sessionStorage.setItem("code", (transactionID).slice(0, 6));
    sendCode(transactionID, cust_number, cust_name, cust_email);
    $("#VerifyModal").modal("show");
    $("#firstDigit").keyup(function () {
        if ($(this).val() != "") {
            $("#secondDigit").focus();
        }
    })
    $('#secondDigit').keyup(function (e) {
        if ($(this).val() != "") {
            $("#thirdDigit").focus();
        }
    });
    $('#thirdDigit').keyup(function (e) {
        if ($(this).val() != "") {
            $("#fourthDigit").focus();
        }
    });
    $('#fourthDigit').keyup(function (e) {
        if ($(this).val() != "") {
            $("#fifthDigit").focus();
        }
    });
    $('#fifthDigit').keyup(function (e) {
        if ($(this).val() != "") {
            $("#sixthDigit").focus();
        }
    });
    $("#resendCode").click(function (e) {
        let transactionID2 = '';
        for (let i = 0; i < 8; i++) {
            transactionID2 += digits[Math.floor(Math.random() * 10)]
        }
        sessionStorage.removeItem("code");
        sessionStorage.setItem("code", (transactionID2).slice(0, 6));
        sendCode(transactionID2, cust_number, cust_name, cust_email);
    })
}
const VerifyContact = () => {
    setTimeout(function () {
        $(".validation-alert").fadeTo(500, 0).slideUp(500, function () {
            $(this).remove();
        });
    }, 3000);
    let userID = document.getElementById("usercode").value;
    let contactNo = document.getElementById("contact").value;
    if (userID == "") {
        $("#recoverySetup").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-12 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Please enter your user ID</div></div></div>")
    }
    else if (contactNo == "" || contactNo.length != 13) {
        $("#recoverySetup").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-12 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Please enter your phone number in +92 XXXXXXXXXX format</div></div></div>")
    }
    else if (userID != "" && contactNo != "" && contactNo.length == 13) {
        $("#spinner").show();
        $.post("/User/authorizePOSAcc", function (token) {
            $.ajax({
                "crossDomain": true,
                url: Result_API + "/api/PosUser/GetUserByUserCd/" + userID,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': Result_API,
                    'Access-Control-Allow-Methods': 'POST, GET',
                    'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                    'Authorization': 'Bearer ' + token
                },
                datatype: 'jsonp',
                success: function (result) {
                    const min = 100000;
                    const max = 999999;
                    const DigitCode = Math.floor(Math.random() * (max - min + 1)) + min;
                    $(result).each(function () {
                        let email = this.SUM_USER_EMAIL_ADDR;
                        if (this.SUM_CUST_CONTPHONE == contactNo) {
                            $.ajax({
                                type: "POST",
                                url: "/User/SendSMS",
                                data: {
                                    username: "customer", Txtmessage: ", your OTP verification Code for SFTL application is " + DigitCode, phoneNumber: contactNo
                                }
                            }).done(function (msg) {
                            });
                            $.ajax({
                                type: "POST",
                                url: "/User/SendEmail",
                                data: { username: "customer", messageEmail: "<p>Your OTP verification Code for SFTL application is " + DigitCode + "</p>", emailAddress: email, subject: "OTP" }
                            }).done(function (msg) {
                            });
                            $("#spinner").hide();
                            Swal.fire({
                                title: 'Enter the verification code sent to your contact number or email address',
                                html: `<ul class="code-number">
                                <li><input id="firstDigit" class="border-0 bg-transparent w-50" placeholder="1" maxlength="1" /></li>
                                <li><input id="secondDigit" class="border-0 bg-transparent w-50" placeholder="0" maxlength="1" /></li>
                                <li><input id="thirdDigit" class="border-0 bg-transparent w-50" placeholder="5" maxlength="1" /></li>
                                <li><input id="fourthDigit" class="border-0 bg-transparent w-50" placeholder="3" maxlength="1" /></li>
                                <li><input id="fifthDigit" class="border-0 bg-transparent w-50" placeholder="9" maxlength="1" /></li>
                                <li><input id="sixthDigit" class="border-0 bg-transparent w-50" placeholder="2" maxlength="1" /></li>
                            </ul>`,
                                confirmButtonText: 'Submit',
                                showCancelButton: true,
                                preConfirm: () => {
                                    const digit1 = document.getElementById('firstDigit').value
                                    const digit2 = document.getElementById('secondDigit').value
                                    const digit3 = document.getElementById('thirdDigit').value
                                    const digit4 = document.getElementById('fourthDigit').value
                                    const digit5 = document.getElementById('fifthDigit').value
                                    const digit6 = document.getElementById('sixthDigit').value
                                    if (digit1 === '') {
                                        Swal.showValidationMessage('Please enter the code');
                                    }
                                    if (digit2 === '') {
                                        Swal.showValidationMessage('Please enter the code');
                                    }
                                    if (digit3 === '') {
                                        Swal.showValidationMessage('Please enter the code');
                                    }
                                    if (digit4 === '') {
                                        Swal.showValidationMessage('Please enter the code');
                                    }
                                    if (digit5 === '') {
                                        Swal.showValidationMessage('Please enter the code');
                                    }
                                    if (digit6 === '') {
                                        Swal.showValidationMessage('Please enter the code');
                                    } else {
                                        code = digit1 + digit2 + digit3 + digit4 + digit5 + digit6
                                        if (code == DigitCode) {
                                            return code;
                                        } else
                                            Swal.showValidationMessage('Please enter correct code');
                                    }
                                },
                                allowOutsideClick: () => false
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    $("#userCode").val(userID);
                                    $("#SUM_USER_EMAIL_ADDR").val(email);
                                    $("#confirmRecovery-tab").click();
                                }
                            });
                        } else
                            Swal.fire({
                                icon: 'error',
                                text: 'Please enter your registered contact number',
                            }).then((result) => {
                            });
                    })
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 401) {
                    }
                }
            });
        });
    }
}