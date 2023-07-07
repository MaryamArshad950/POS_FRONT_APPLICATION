!function () {
    $(document).ready(function () {
        $("#successRequest").modal("show");
        let thisCustCNIC = sessionStorage.getItem("cnic.");
        if (thisCustCNIC == null) {
            window.location.href = "/";
            localStorage.clear();
            sessionStorage.clear();
        } else {
            if (sessionStorage.getItem("successFreelook") != '') {
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

            //    thisCustCNIC = thisCustCNIC.replace(/^(\d{5})(\d{7})(\d)$/, "$1-$2-$3");
            //    let nf = new Intl.NumberFormat('en-US');
            //    let getsession = sessionStorage.getItem("tokenIndex");
            //    let proposal_no = sessionStorage.getItem("Proposal_NoF");
            //    let grossContrib = sessionStorage.getItem("GROSS_AMT");
            //    $(".contrib_paid").html("<p class='text-center'>Total Takaful Contribution Paid</p><p class='text-center'>PKR " + nf.format(grossContrib) + "</p>")
            //    $(".refund_amount").html(nf.format(grossContrib));
            //    $.ajax({
            //        "crossDomain": true,
            //        url: Global_API + "/API/NEW_BUSINESS/GET_CUSTOMER_PROP_FUND/" + proposal_no + "/Y/Y",
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
            //                $("#inputWithdrawal").attr("max", withdrwlAmount);
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
            //    $("#btnProceedFreeLook").click(function () {
            //        if ($("#SUM_CUST_CONTPHONE").val() != null) {
            //            $("#AgreementModal").modal("show");
            //        }
            //    })
            //    $("#btnAgreeTermsCond").click(function () {
            //        $("#AgreementModal").modal("hide");
            //        $("#custBankDtls").modal("show");

            //    })
            //    $("#btnDisAgreeTerms").click(function () {
            //        $("#AgreementModal").modal("hide");
            //    });

            //    $("#closeRequest").click(function () {
            //        $("#custBankDtls").modal("hide");
            //    })
            //    $(".closeRequestSuccess").click(function () {
            //        $("#successRequest").modal("hide");
            //    })
        }
    })
}()