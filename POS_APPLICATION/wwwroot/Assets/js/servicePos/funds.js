!function () {
    $(document).ready(function () {
        let thisCustCNIC = sessionStorage.getItem("cnic.");
        if (thisCustCNIC == null) {
            window.location.href = "/";
            localStorage.clear();
            sessionStorage.clear();
        } else {
            thisCustCNIC = thisCustCNIC.replace(/^(\d{5})(\d{7})(\d)$/, "$1-$2-$3");
            let nf = new Intl.NumberFormat('en-US');
            let getsession = sessionStorage.getItem("tokenIndex");
            let proposal_no = sessionStorage.getItem("Proposal_NoF");

            let policy_status = sessionStorage.getItem("PolicyStatusF");

            let policy_no = sessionStorage.getItem("PolicyNo");
            let grossContrib = sessionStorage.getItem("GROSS_AMT");
            $(".contrib_paid").html("<p class='text-center'>Total Takaful Contribution Paid</p><p class='text-center'>PKR " + nf.format(grossContrib) + "</p>")
            $(".policy_no").html(policy_no)
            $.ajax({
                "crossDomain": true,

                url: Global_API + "/API/NEW_BUSINESS/GET_CUSTOMER_PROP_FUND/" + proposal_no + "/Y/" + policy_status,

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
                        $(".currentCashValue").html("<p class='text-center'>Current Cash Value</p><p class='text-center'>PKR " + nf.format(this.FPDF_CASHVALUE_BC) + "</p>")
                        $("#tblMyFunds tbody").append("<tr>" +
                            "<td>" + this.FUND_NAME + "</td>" +
                            "<td>" + this.FPDF_DISTRIBURATE + "%</td>" +
                            "<td>" + units + "</td>" +
                            "<td>" + bidPrice + "</td>" +
                            "<td>PKR " + nf.format(this.FPDF_CASHVALUE_BC) + "</td>" +
                            "</tr>");
                    })
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 401) {
                    }
                }
            });
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
                        $("#SUM_FULL_NAME").html(this.SUM_FULL_NAME);
                        $("#SUM_CUST_CONTPHONE").html(this.SUM_CUST_CONTPHONE)
                        $("#SUM_USER_EMAIL_ADDR").html(this.SUM_USER_EMAIL_ADDR)
                        $("#status").html("Active")
                        $("#cnic").html(thisCustCNIC)
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
                        let customer_code = this.FSCU_CUSTOMER_CODE;
                        $.ajax({
                            "crossDomain": true,
                            url: "" + Global_API + "/API/CUSTOMER_ADDRESS/GET_CUST_ADDRESS_DETAILS/" + customer_code + "/" + "P",
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
                                    $("#FSCA_ADDRESS1").html(this.FSCA_ADDRESS1);
                                })
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
        }
    })
}()