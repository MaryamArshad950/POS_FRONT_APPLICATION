!function () {
    $(document).ready(function () {
        let thisCustCNIC = sessionStorage.getItem("cnic.");
        if (thisCustCNIC == null) {
            window.location.href = "/";
            localStorage.clear();
            sessionStorage.clear();
        } else {
            //if (sessionStorage.getItem("PolicyNo") != null) {
            //    $(".policy_no").html(sessionStorage.getItem("PolicyNo"));
            //    PartialWithdrawal();
            //} else {
            //    PolicyNumberSelection();
            //    $(".change-policy-num").click(function () {
            //        PolicyNumberSelection();
            //    })
            //}
            if (sessionStorage.getItem("successWithdrawal") != '') {
                Swal.fire({
                    text: 'Your Request has been received.',
                    icon: 'success'
                }).then((result) => {
                    if (result.isConfirmed) {
                        PolicyNumberSelection();
                        $(".change-policy-num").click(function () {
                            PolicyNumberSelection();
                        })
                    }
                });
            }
            else {
                PolicyNumberSelection();
                $(".change-policy-num").click(function () {
                    PolicyNumberSelection();
                })
            }
        }
    })
}()
//function PolicyNumberSelection() {
//    let thisCustCNIC = sessionStorage.getItem("cnic.");

//    if (thisCustCNIC[5] != "-" && thisCustCNIC[13] != "-") {
//        let n1 = thisCustCNIC.substring(0, 5);
//        let n2 = thisCustCNIC.substring(5, 12);
//        let addn = n1 + "-" + n2 + "-" + thisCustCNIC[thisCustCNIC.length - 1]
//        thisCustCNIC = addn;
//    }
//    let PolicyNumbers = sessionStorage.getItem("policyResult").split(",");

//    const select = document.createElement('select');
//    const optionselect = document.createElement('option');
//    optionselect.textContent = 'Select';
//    optionselect.value = '';
//    select.appendChild(optionselect);

//    //select.className = "form-control";
//    // Generate the options dynamically
//    PolicyNumbers.forEach((policyNo) => {
//        const option = document.createElement('option');
//        option.textContent = policyNo;
//        option.value = policyNo;
//        select.appendChild(option);
//    });
//    Swal.fire({
//        title: 'Please select your Policy Number:',
//        html: select,
//        confirmButtonText: 'Submit',
//        showCancelButton: true,
//        preConfirm: () => {
//            const selectedOption = select.value;
//            if (selectedOption === '') {
//                Swal.showValidationMessage('Please select your policy number');
//            } else {
//                return selectedOption;
//            }
//        },
//        allowOutsideClick: () => false
//    }).then((result) => {
//        if (result.isConfirmed) {
//            const selectedPolicy = result.value;
//            $(".partialWthdrwlProcess").removeAttr("hidden", true);
//            $(".partial-wthdrwl-policy").removeAttr("hidden", true);
//            $(".policy_no").html(selectedPolicy);
//            $("#FSSH_POL_CODE").val(selectedPolicy);
//            $.ajax({
//                "crossDomain": true,
//                url: Global_API + "/api/Inquiry/GetInquiryByUsername/" + thisCustCNIC,
//                type: "GET",
//                contentType: "application/json; charset=utf-8",
//                headers: {
//                    'Content-Type': 'application/x-www-form-urlencoded',
//                    'Access-Control-Allow-Origin': Global_API,
//                    'Access-Control-Allow-Methods': 'POST, GET',
//                    'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
//                    'Authorization': 'Bearer ' + getsession
//                },
//                datatype: 'jsonp',
//                success: function (result) {
//                    $(result).each(function () {
//                        if (this.FPDM_POLICY_NO == selectedPolicy) {
//                            PartialWithdrawal(this.FPDM_PROPOSAL_NO);
//                        }
//                    })
//                },
//                error: function (jqXHR, textStatus, errorThrown) {
//                    if (jqXHR.status === 401) {
//                    }
//                }
//            });

//            // Perform your desired action with the selected policy value
//            // For example, update the HTML content with the selected policy
//        }
//    });
//}
//function ProposalCashValues(selectdProposalNo) {
//    let thisCustCNIC = sessionStorage.getItem("cnic.");
//    thisCustCNIC = thisCustCNIC.replace(/^(\d{5})(\d{7})(\d)$/, "$1-$2-$3");
//    let nf = new Intl.NumberFormat('en-US');
//    let getsession = sessionStorage.getItem("tokenIndex");
//    //let proposal_no = sessionStorage.getItem("Proposal_NoF");
//    //if (proposal_no == null) {
//    //    proposal_no = selectdProposalNo;
//    //}
//    $.ajax({
//        "crossDomain": true,
//        url: Global_API + "/API/NEW_BUSINESS/GET_CUSTOMER_PROP_FUND/" + selectdProposalNo + "/Y/Y",
//        type: "GET",
//        contentType: "application/json; charset=utf-8",
//        headers: {
//            'Content-Type': 'application/x-www-form-urlencoded',
//            'Access-Control-Allow-Origin': Global_API,
//            'Access-Control-Allow-Methods': 'POST, GET',
//            'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
//            'Authorization': 'Bearer ' + getsession
//        },
//        datatype: 'jsonp',
//        success: function (result) {
//            $(result).each(function () {
//                let units = this.FPDF_UNITS_END;
//                if (units == null) {
//                    units = "N/A";
//                    $(".text-cash").removeAttr("hidden", true);
//                }
//                let bidPrice = this.FPDF_BIDPRICE;
//                if (bidPrice == null) {
//                    bidPrice = "N/A";
//                    $(".text-cash").removeAttr("hidden", true);
//                }
//                let residualVal = (10 / 100) * (this.FPDF_CASHVALUE_BC);
//                $(".currentCashValue").html("<p class='text-center'>Current Cash Value</p><p class='text-center'>PKR " + nf.format(this.FPDF_CASHVALUE_BC) + "</p>");
//                $(".residual_val").html("<p class='text-center'>Residual Value (10%)</p><p class='text-center'>PKR " + nf.format(residualVal) + "</p>")
//                let withdrwlAmount = this.FPDF_CASHVALUE_BC - residualVal;
//                sessionStorage.setItem("withdrwlAmount", withdrwlAmount);
//                $(".withdrwlAmount").html(nf.format(withdrwlAmount) + " only");
//                $(".withdrwlText").removeAttr("hidden", true);
//                $("#FSSH_PW_AMT").attr("max", withdrwlAmount);
//            })
//        },
//        error: function (jqXHR, textStatus, errorThrown) {
//            if (jqXHR.status === 401) {
//            }
//        }
//    });
//    $.ajax({
//        "crossDomain": true,
//        url: "" + Result_API + "/api/PosUser/GetUserByUserCd/" + sessionStorage.getItem("cnic."),
//        type: "GET",
//        contentType: "application/json; charset=utf-8",
//        headers: {
//            'Content-Type': 'application/x-www-form-urlencoded',
//            'Access-Control-Allow-Origin': Result_API,
//            'Access-Control-Allow-Methods': 'POST, GET',
//            'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
//            'Authorization': 'Bearer ' + getsession
//        },
//        datatype: 'jsonp',
//        success: function (result) {
//            $(result).each(function () {
//                $("#SUM_FULL_NAME").val(this.SUM_FULL_NAME);
//                $("#SUM_CUST_CONTPHONE").val(this.SUM_CUST_CONTPHONE)
//                $("#SUM_USER_EMAIL_ADDR").val(this.SUM_USER_EMAIL_ADDR)
//            })
//        },
//        error: function (jqXHR, textStatus, errorThrown) {
//            if (jqXHR.status === 401) {
//            }
//        }
//    });
//    $.ajax({
//        "crossDomain": true,
//        url: "" + Global_API + "/API/CUSTOMER/SEARCH_CUSTOMER/" + thisCustCNIC,
//        type: "GET",
//        contentType: "application/json; charset=utf-8",
//        headers: {
//            'Content-Type': 'application/x-www-form-urlencoded',
//            'Access-Control-Allow-Origin': Global_API,
//            'Access-Control-Allow-Methods': 'POST, GET',
//            'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
//            'Authorization': 'Bearer ' + getsession
//        },
//        datatype: 'jsonp',
//        success: function (result) {
//            $(result).each(function () {
//                $("#FSCU_CUSTOMER_CODE").val(this.FSCU_CUSTOMER_CODE);
//            })
//        },
//        error: function (jqXHR, textStatus, errorThrown) {
//            if (jqXHR.status === 401) {
//            }
//        }
//    });
//    $("#btnProceedWthdrw").click(function () {
//        if ($("#SUM_CUST_CONTPHONE").val() != null && $("#FSSH_POL_CODE").val() != null && $("#FSSH_PW_AMT").val() != "" && $("#FSSH_PW_AMT").val() <= Number(sessionStorage.getItem("withdrwlAmount"))) {
//            $("#AgreementModal").modal("show");
//        }
//    })
//    $("#btnAgreeTermsCond").click(function () {
//        $("#AgreementModal").modal("hide");
//        $("#VerifyModal").modal("show");
//        let cust_number = ($("#SUM_CUST_CONTPHONE").val()).slice(1);
//        let cust_name = $("#SUM_FULL_NAME").val();
//        let cust_email = $("#SUM_USER_EMAIL_ADDR").val();
//        let digits = "0123456789";
//        let transactionID = '';
//        for (let i = 0; i < 8; i++) {
//            transactionID += digits[Math.floor(Math.random() * 10)]
//        }
//        sessionStorage.setItem("code", (transactionID).slice(0, 6));
//        sendCode(transactionID, cust_number, cust_name, cust_email);
//        $("#VerifyModal").modal("show");
//        $("#firstDigit").keyup(function () {
//            if ($(this).val() != "") {
//                $("#secondDigit").focus();
//            }
//        })
//        $('#secondDigit').keyup(function (e) {
//            if ($(this).val() != "") {
//                $("#thirdDigit").focus();
//            }
//        });
//        $('#thirdDigit').keyup(function (e) {
//            if ($(this).val() != "") {
//                $("#fourthDigit").focus();
//            }
//        });
//        $('#fourthDigit').keyup(function (e) {
//            if ($(this).val() != "") {
//                $("#fifthDigit").focus();
//            }
//        });
//        $('#fifthDigit').keyup(function (e) {
//            if ($(this).val() != "") {
//                $("#sixthDigit").focus();
//            }
//        });
//        $("#resendCode").click(function (e) {
//            let transactionID2 = '';
//            for (let i = 0; i < 8; i++) {
//                transactionID2 += digits[Math.floor(Math.random() * 10)]
//            }
//            sessionStorage.removeItem("code");
//            sessionStorage.setItem("code", (transactionID2).slice(0, 6));
//            sendCode(transactionID2, cust_number, cust_name, cust_email);
//        })
//    });
//    $("#btnDisAgreeTerms").click(function () {
//        $("#AgreementModal").modal("hide");
//    });

//    $("#verifyOTP").click(function () {
//        let digitsArray = [];
//        let codeNumbersLi = document.getElementsByClassName("code-number")
//        for (let i = 0; i < codeNumbersLi[0].children.length; i++) {
//            digitsArray.push(codeNumbersLi[0].children[i].children[0].value)
//        }
//        let CodeDigits = digitsArray.join("");
//        if (digitsArray.length == 6) {
//            if (CodeDigits == sessionStorage.getItem("code")) {
//                $(".alert-otp").removeAttr("hidden", true);
//                window.setTimeout(function () {
//                    $(".alert-otp").attr("hidden", true);
//                    $("#VerifyModal").modal("hide");
//                    $("#custBankDtls").modal("show");
//                }, 2500);
//            }
//        }
//    })
//    $("#closeRequest").click(function () {
//        sessionStorage.removeItem("code");
//        $("#custBankDtls").modal("hide");
//    })
//    //$(".closeRequestSuccess").click(function () {
//    //    sessionStorage.removeItem("code");
//    //    $("#successRequest").modal("hide");
//    //})
//}

