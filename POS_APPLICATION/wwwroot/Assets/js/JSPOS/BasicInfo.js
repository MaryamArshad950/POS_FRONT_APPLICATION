!function () {
    $(document).ready(function () {
        var cust_email = '';
        var cust_phone = '';
        $.ajax({
            url: '/User/GetSessionValue',
            type: 'POST',
            data: { key: 'SUM_USER_EMAIL_ADDR' },
            success: function (response) {
                cust_email = response;
            },
            error: function (xhr, status, error) {
            }
        });
        $.ajax({
            url: '/User/GetSessionValue',
            type: 'POST',
            data: { key: 'SUM_CUST_CONTPHONE' },
            success: function (response) {
                cust_phone = response;
            },
            error: function (xhr, status, error) {
            }
        });
        if (sessionStorage.getItem("token") == "null") {
            alert("Your session has been expired!!\nPlease sign in again")
            sessionStorage.clear();
            localStorage.clear();
            window.location.href = "/";
        }
        if (sessionStorage.getItem("tokenIndex") == null && localStorage.getItem("token3") == null && localStorage.getItem("token1") == null) {
            localStorage.setItem("token1", getsession);
        }
        let customer_name = sessionStorage.getItem("customer_name");
        let customer_gender = sessionStorage.getItem("cust_gender");
        if (customer_gender == 1) {
            customer_gender = "Mr.";
        }
        if (customer_gender == 2) {
            customer_gender = "Miss";
        }
        if (customer_gender == null) {
            customer_gender = "";
        }
        if (customer_name != null) {
            $("#cust_name").html(customer_gender + " " + customer_name);
        }

        if (sessionStorage.getItem("tokenIndex") != null && sessionStorage.getItem("tokenIndex") != "" && sessionStorage.getItem("tokenIndex") != "null") {
            $("#processPlan").removeAttr("hidden", true);
            $("#reportPlan").removeAttr("hidden", true);
            $("#servicesDropdown").removeAttr("hidden", true);
        }

        $.ajax({
            "crossDomain": true,
            url: "" + Result_API + "/api/DcmntNominee/GetNomineeByDcmntID/" + Number(sessionStorage.getItem("thisDocID")),
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
                    $("#basicInfo-tab").attr("disabled", true);
                    $("#userIdentification-tab").attr("disabled", true);
                    $("#beneficiary-tab").attr("disabled", true);
                    let propsal_no = sessionStorage.getItem("Prpsl_No");
                    let dcmntPrpslID = sessionStorage.getItem("docIdPrpsl");
                    let document_ID = sessionStorage.getItem("thisDocID");
                    let document_code = 'DOC' + document_ID;
                    $.ajax({
                        "crossDomain": true,
                        url: "" + Result_API + "/api/DcmntNominee/SaveorUpdateDcmntProcessDtls?document_code=" + document_code,
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
                            sessionStorage.setItem("docIdPrpsl", document_code.slice(3));
                            sessionStorage.getItem("docIdPrpsl");
                            $(result).each(function () {
                                sessionStorage.setItem("Prpsl_No", this.NEW_PROPOSAL_NO);
                                let Proposal_No = sessionStorage.getItem("Prpsl_No");
                                $(".proposal_No").html(Proposal_No);
                                let randomNum = Math.floor(Math.random() * 9000000) + 1000000;
                                randomNum = randomNum.toString();
                                $.ajax({
                                    "crossDomain": true,
                                    url: "" + Result_API + "/api/DcmntNominee/GetPrpslDetails/" + this.NEW_PROPOSAL_NO + "/N",
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
                                        if (result.length == 0) {
                                            $("#proposalMesg").attr("hidden", true);
                                            $(".returnToFlagship").removeAttr("hidden", true);
                                        }
                                        $(result).each(function () {
                                            let birth_date = new Date(this.FSCU_DATEOFBIRTH);
                                            let birthMonth = birth_date.getMonth() + 1;
                                            if (("" + birthMonth).length == 1) {
                                                birthMonth = "0" + birthMonth;
                                            }
                                            birth_date = birth_date.getDate() + "-" + birthMonth + "-" + birth_date.getFullYear();

                                            $("#name_gender").html(customer_gender + " " + customer_name);
                                            let CONTRIB_AMOUNT = this.CONTRIB_AMOUNT;
                                            let nf = new Intl.NumberFormat('en-US');
                                            CONTRIB_AMOUNT = nf.format(CONTRIB_AMOUNT);
                                            let FPDP_SUMASSURED = this.FPDP_SUMASSURED;
                                            FPDP_SUMASSURED = nf.format(FPDP_SUMASSURED);

                                            $("#P_DOCUMENT_ID").val(Proposal_No);
                                            $("#HS_TransactionReferenceNumber").val(randomNum);
                                            $("#TransactionReferenceNumber").val(randomNum);
                                            $("#FIPR_COLL_AMOUNT").val(this.CONTRIB_AMOUNT);
                                            sessionStorage.setItem("CONTRIB_AMOUNT_DMS", this.CONTRIB_AMOUNT)
                                            $("#TransactionAmount").val(this.CONTRIB_AMOUNT);
                                            $("#PARTICIPANT_NAME").val(this.FSCU_FULL_NAME);
                                            $("#PARTICIPANT_DOB").val(birth_date);
                                            $("#PLAN_NAME").val(this.FSPM_PRODUCT_NAME);
                                            $("#CONTRIB_AMOUNT").val("PKR " + CONTRIB_AMOUNT);
                                            $("#SA_AMOUNT").val("PKR " + FPDP_SUMASSURED);
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

                    $("#regQuestions-tab").removeAttr("disabled", true);
                    $("#regQuestions-tab").click();
                }
                if (result.length == 0) {
                    let cust_cnic = '';
                    if (sessionStorage.getItem("cnic.") != null) {
                        cust_cnic = sessionStorage.getItem("cnic.");
                        checkDocumentsPosted(cust_cnic);
                    }
                    if (sessionStorage.getItem("DocCNIC") != null) {
                        cust_cnic = sessionStorage.getItem("DocCNIC").replaceAll("-", "");
                        checkDocumentsPosted(cust_cnic);
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 401) {
                }
            }
        });

        $("#settings-trigger").attr("hidden", true);
        $(".sidebar-offcanvas").attr("hidden", true);
        let thisCustCNIC = sessionStorage.getItem("thisCustCNIC");


        if (thisCustCNIC != null) {
            $("#FSCU_IDENTIFICATION_NO").val(thisCustCNIC);
            $(".welcome-div").removeAttr("hidden", true);
            $("#FPDH_DMSCUS_CNIC").val(thisCustCNIC.replaceAll("-", ""));
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
                        sessionStorage.setItem("thisCustomerCode", customer_code);
                        sessionStorage.getItem("thisCustomerCode");
                        $("#FSCU_CUST_ANNUAL_INCOME").val(nf.format(this.FSCU_CUST_ANNUAL_INCOME));
                        if (this.FSCU_IDENTISSUE_DATE != null && this.FSCU_IDENTIEXPIRY_DATE != null) {
                            let FSCU_IDENTISSUE_DATE = this.FSCU_IDENTISSUE_DATE.slice(0, 10);
                            let FSCU_IDENTIEXPIRY_DATE = this.FSCU_IDENTIEXPIRY_DATE.slice(0, 10);
                            $("#FSCU_IDENTISSUE_DATE").val(FSCU_IDENTISSUE_DATE);
                            $("#FSCU_IDENTIEXPIRY_DATE").val(FSCU_IDENTIEXPIRY_DATE);
                        }
                        $("#FSCU_FATHUSB_NAME").val(this.FSCU_FATHUSB_NAME);
                        $("#FSCU_MOTHER_NAME").val(this.FSCU_MOTHER_NAME);
                        $("#FSCU_MRTST_FSCD_DID").val(this.FSCU_MRTST_FSCD_DID);
                        $("#FSSC_COUNTRY_ID").val(this.FSSC_COUNTRY_ID);
                        $("#FSCU_BIRTH_COUNTRY").val(this.FSCU_BIRTH_COUNTRY);
                        $("#FPDH_DMSCUS_CNIC").val((this.FSCU_IDENTIFICATION_NO).replaceAll("-", ""))
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
                                    $("#FSCT_CITY_ID").val(this.FSCT_CITY_ID);
                                    $("#FSCA_ADDRESS1").val(this.FSCA_ADDRESS1);
                                    $("#FSCA_ADDRESS2").val(this.FSCA_ADDRESS2);
                                    $("#FSSP_PROVINCE_ID").val(this.FSSP_PROVINCE_ID)
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
        else {
            let cust_cnic = sessionStorage.getItem("DocCNIC");
            $("#FSCU_IDENTIFICATION_NO").val(cust_cnic);
            $(".welcome-div").removeAttr("hidden", true);
            $("#FPDH_DMSCUS_CNIC").val(cust_cnic.replaceAll("-", ""))
            $.ajax({
                "crossDomain": true,
                url: "" + Global_API + "/API/CUSTOMER/SEARCH_CUSTOMER/" + cust_cnic,
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
                        sessionStorage.setItem("thisCustomerCode", customer_code);
                        sessionStorage.getItem("thisCustomerCode");

                        $("#FSCU_CUST_ANNUAL_INCOME").val(nf.format(this.FSCU_CUST_ANNUAL_INCOME));
                        if (this.FSCU_IDENTISSUE_DATE != null && this.FSCU_IDENTIEXPIRY_DATE != null) {
                            let FSCU_IDENTISSUE_DATE = this.FSCU_IDENTISSUE_DATE.slice(0, 10);
                            let FSCU_IDENTIEXPIRY_DATE = this.FSCU_IDENTIEXPIRY_DATE.slice(0, 10);
                            $("#FSCU_IDENTISSUE_DATE").val(FSCU_IDENTISSUE_DATE);
                            $("#FSCU_IDENTIEXPIRY_DATE").val(FSCU_IDENTIEXPIRY_DATE);
                        }
                        let FSCU_IDENTISSUE_DATE = this.FSCU_IDENTISSUE_DATE.slice(0, 10);
                        let FSCU_IDENTIEXPIRY_DATE = this.FSCU_IDENTIEXPIRY_DATE.slice(0, 10);
                        $("#FSCU_FATHUSB_NAME").val(this.FSCU_FATHUSB_NAME);
                        $("#FSCU_MOTHER_NAME").val(this.FSCU_MOTHER_NAME);
                        $("#FSCU_MRTST_FSCD_DID").val(this.FSCU_MRTST_FSCD_DID);
                        $("#FSSC_COUNTRY_ID").val(this.FSSC_COUNTRY_ID);
                        $("#FSCU_BIRTH_COUNTRY").val(this.FSCU_BIRTH_COUNTRY);
                        $("#FSCU_IDENTISSUE_DATE").val(FSCU_IDENTISSUE_DATE);
                        $("#FSCU_IDENTIEXPIRY_DATE").val(FSCU_IDENTIEXPIRY_DATE);
                        $("#FPDH_DMSCUS_CNIC").val((this.FSCU_IDENTIFICATION_NO).replaceAll("-", ""))
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
                                    $("#FSCT_CITY_ID").val(this.FSCT_CITY_ID);
                                    $("#FSCA_ADDRESS1").val(this.FSCA_ADDRESS1);
                                    $("#FSCA_ADDRESS2").val(this.FSCA_ADDRESS2);
                                    $("#FSSP_PROVINCE_ID").val(this.FSSP_PROVINCE_ID)
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

        $(".sign_out").click(function () {
            // Clear session and local storage
            sessionStorage.clear();
            localStorage.clear();

            // Destroy the "Session" cookie by setting its expiration to a past date and add the secure flag
            document.cookie = "Session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure;";

            // Redirect to the home page
            window.location.href = "/";
        });
        $("#btnPrev").click(function () {
            window.location.href = "/Onboarding";
        })
        $("#btnNextBasic").click(function () {
            let thisCustomerCode = sessionStorage.getItem("thisCustomerCode");
            let father_name = $("#FSCU_FATHUSB_NAME").val();
            let mother_name = $("#FSCU_MOTHER_NAME").val();
            let marital_status = $("#FSCU_MRTST_FSCD_DID").val();
            let current_country = $("#FSSC_COUNTRY_ID").val();
            let cust_cnic = $("#FSCU_IDENTIFICATION_NO").val();
            let annual_income = $("#FSCU_CUST_ANNUAL_INCOME").val();
            annual_income = Number(annual_income.replaceAll(",", ""));
            let cnic_issuedate = $("#FSCU_IDENTISSUE_DATE").val();
            let cnic_expirydate = $("#FSCU_IDENTIEXPIRY_DATE").val();
           
            let today = new Date();
            let todays_date = new Date();
            let todayMonth = todays_date.getMonth() + 1;
            if (todayMonth.toString().length == 1) {
                todayMonth = "0" + todayMonth;
            }
            todays_date = todays_date.getFullYear() + "-" + todayMonth + "-" + todays_date.getDate();
            let cust_address = $("#FSCA_ADDRESS1").val();
            let cust_address2 = $("#FSCA_ADDRESS2").val();
            let cust_city = $("#FSCT_CITY_ID").val();
            let cust_province = $("#FSSP_PROVINCE_ID").val();
            //let custDate = new Date();
            //custDate = custDate.getFullYear() + "-" + custDate.getMonth() + "-" + custDate.getDate();
            //let objCust = {
            //    FSCU_CUSTOMER_CODE: thisCustomerCode,
            //    FSCU_FATHUSB_NAME: father_name,
            //    FSCU_MOTHER_NAME: mother_name,
            //    FSCU_MRTST_FSCD_DID: marital_status,
            //    FSSC_COUNTRY_ID: current_country,
            //    FSCU_IDENTIFICATION_NO: cust_cnic,
            //    FSNT_IDENTYPE_ID: "1",
            //    FSCU_CUST_ANNUAL_INCOME: annual_income,
            //    FSCU_IDENTISSUE_DATE: cnic_issuedate,
            //    FSCU_IDENTIEXPIRY_DATE: cnic_expirydate,
            //    FSCU_CUST_STATUS: "Y",
            //    FSCU_CRUSER: "1",
            //    FSCU_CRDATE: custDate
            //}
            //objCust = JSON.stringify(objCust);


            let objCustAddr = {
                FSCU_CUSTOMER_CODE: thisCustomerCode,
                FSCA_ADDRESS_TYPE: "P",
                FSSC_COUNTRY_ID: current_country,
                FSSP_PROVINCE_ID: cust_province,
                FSCT_CITY_ID: cust_city,
                FSCA_ADDRESS1: cust_address,
                FSCA_ADDRESS2: cust_address2,
                FSCA_EMAIL1: cust_email,
                FSCA_TELNO1: cust_phone,
                FSCA_STATUS: "Y",
                FSCA_ADDR_ISCORSP: "Y",
                FSCA_CRUSER: "1",
                FSCA_CRDATE: todays_date
            }
            objCustAddr = JSON.stringify(objCustAddr);
            if (cust_cnic != "" && father_name != "" && mother_name != "" && marital_status != "" && current_country != "" && cust_cnic != "" && annual_income != "" && cust_address != "" && cnic_issuedate != "" && cnic_expirydate != "") {
                if (cnic_issuedate < cnic_expirydate && cnic_issuedate != cnic_expirydate && new Date(cnic_issuedate).getFullYear() <= today.getFullYear()) {
                    if (cnic_expirydate == todays_date || cnic_expirydate < todays_date) {
                        $(".welcome-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-4 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>" +
                            "Dear Customer, your CNIC submitted has been expired. To avoid any delay in the transaction(s), you are requested to kindly provide renewed CNIC / NADRA CNIC renewal token." +
                            "</div>" +
                            "</div>" +
                            "</div>"
                        );
                        $(window).scrollTop(0);
                        $("#btnNextBasic").attr("disabled", true);
                        $("#userIdentification-tab").attr("disabled", true);
                        $("#beneficiary-tab").attr("disabled", true);

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
                                        let cust_number = (this.SUM_CUST_CONTPHONE).slice(1);
                                        $.ajax({
                                            type: "POST",
                                            url: "/User/SendSMS",
                                            data: {
                                                username: this.SUM_FULL_NAME, Txtmessage: ", Your submitted CNIC for your Takaful application has been expired. To avoid any delay in the transaction(s), you are requested to kindly provide renewed CNIC / NADRA CNIC renewal token. For further assistance, please contact CS@salaamtakaful.com via WhatsApp/UAN at on 021-111-875-111.", phoneNumber: cust_number
                                            }
                                        }).done(function (msg) {
                                        });
                                        if (this.SUM_USER_EMAIL_ADDR != null) {
                                            $.ajax({
                                                type: "POST",
                                                url: "/User/SendEmail",
                                                data: { username: this.SUM_FULL_NAME, messageEmail: "<p>Your submitted CNIC for your Takaful application has been expired.</p><p>To avoid any delay in the transaction(s), you are requested to kindly provide renewed CNIC / NADRA CNIC renewal token.</p><p>For further assistance, please contact CS@salaamtakaful.com via WhatsApp/UAN at on 021-111-875-111.</p>", emailAddress: this.SUM_USER_EMAIL_ADDR, subject: "Alert" }
                                            }).done(function (msg) {
                                            });
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
                                        let cust_number = (this.SUM_CUST_CONTPHONE).slice(1);
                                        $.ajax({
                                            type: "POST",
                                            url: "/User/SendSMS",
                                            data: {
                                                username: this.SUM_FULL_NAME, Txtmessage: ", Your submitted CNIC for your Takaful application has been expired. To avoid any delay in the transaction(s), you are requested to kindly provide renewed CNIC / NADRA CNIC renewal token. For further assistance, please contact CS@salaamtakaful.com via WhatsApp/UAN at on 021-111-875-111.", phoneNumber: cust_number
                                            }
                                        }).done(function (msg) {
                                        });
                                        if (this.SUM_USER_EMAIL_ADDR != null) {
                                            $.ajax({
                                                type: "POST",
                                                url: "/User/SendEmail",
                                                data: { username: this.SUM_FULL_NAME, messageEmail: "<p>Your submitted CNIC for your Takaful application has been expired.</p><p>To avoid any delay in the transaction(s), you are requested to kindly provide renewed CNIC / NADRA CNIC renewal token.</p><p>For further assistance, please contact CS@salaamtakaful.com via WhatsApp/UAN at on 021-111-875-111.</p>", emailAddress: this.SUM_USER_EMAIL_ADDR, subject: "Alert" }
                                            }).done(function (msg) {
                                            });
                                        }
                                    })
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    if (jqXHR.status === 401) {
                                    }
                                }
                            });
                        }
                        return false;
                    }
                    else {
                        $.ajax({
                            "crossDomain": true,

                            //url: Result_API + "/API/CUSTOMER/POST_CUSTOMER",
                            //type: "POST",
                            //headers: {
                            //    'Content-Type': 'application/x-www-form-urlencoded',
                            //    'Access-Control-Allow-Origin': Result_API,
                            //    'Access-Control-Allow-Methods': 'POST, GET',
                            //    'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                            //    'Authorization': 'Bearer ' + getsession
                            //},
                            //contentType: "application/json; charset=utf-8",
                            //datatype: JSON,
                            //data: objCust,
                            url: "" + Result_API + "/API/CUSTOMER/SAVEorUPDATECUSTOMER?cust_code=" + thisCustomerCode + "&father_name=" + father_name + "&mother_name=" + mother_name + "&marital_status=" + marital_status + "&current_country=" + current_country + "&cnic=" + cust_cnic + "&annual_income=" + annual_income + "&cnic_issuedate=" + cnic_issuedate + "&cnic_expirydate=" + cnic_expirydate,
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
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                if (jqXHR.status === 401) {
                                }
                            }
                        });
                        $.ajax({
                            "crossDomain": true,
                            url: Global_API + "/API/CUSTOMER_ADDRESS/POST_CUSTOMER_ADDRESS",
                            type: "POST",
                            headers: {
                                //'Content-Type': 'application/x-www-form-urlencoded',
                                'Access-Control-Allow-Origin': Global_API,
                                'Access-Control-Allow-Methods': 'POST, GET',
                                'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                                'Authorization': 'Bearer ' + getsession
                            },
                            contentType: "application/json; charset=utf-8",
                            datatype: JSON,
                            data: objCustAddr,
                            success: function (result) {
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                if (jqXHR.status === 401) {
                                }
                            }
                        });

                        $("#basicInfo-tab").removeAttr("disabled", true);
                        $("#userIdentification-tab").removeAttr("disabled", true);
                        $("#userIdentification-tab").click();
                        $(window).scrollTop(0);
                    }
                }
                else {
                    setTimeout(function () {
                        $(".validation-alert").fadeTo(500, 0).slideUp(500, function () {
                            $(this).remove();
                        });
                    }, 6500);
                    $(".welcome-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-4 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Please enter correct CNIC issue and expiry dates</div></div></div>")
                    $(window).scrollTop(0);
                    return false;
                }
            }
            else {
                setTimeout(function () {
                    $(".validation-alert").fadeTo(500, 0).slideUp(500, function () {
                        $(this).remove();
                    });
                }, 3500);
                $(".welcome-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-4 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Please fill all the information</div></div></div>")
                $(window).scrollTop(0);
                return false;
            }
        })
        $("#btnPrevIdentify").click(function () {
            $("#basicInfo-tab").removeAttr("disabled", true);
            $("#basicInfo-tab").click();
            $(window).scrollTop(0);
        })
        $("#btnPrevBenef").click(function () {
            $("#userIdentification-tab").click();
            $(window).scrollTop(0);
        })
        $("#btnNextBenef").click(function (e) {
            let sum = 0;
            let sharePercent = document.getElementsByName("FCPND_NMNEE_PERCT");
            for (let i = 0; i < sharePercent.length; i++) {
                sum += Number(sharePercent[i].value);
            }

            let cust_cnic = $("#FSCU_IDENTIFICATION_NO").val();
            let cnicCheck = document.getElementsByName("B_FSCU_IDENTIFICATION_NO");
            for (let i = 0; i < cnicCheck.length; i++) {
                if (cust_cnic == cnicCheck[i].value) {
                    setTimeout(function () {
                        $(".validation-alert").fadeTo(500, 0).slideUp(500, function () {
                            $(this).remove();
                        });
                    }, 6500);
                    $(".beneficiary-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-4 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Please use different CNIC...you can not nominate yourself</div></div></div>")
                    $(window).scrollTop(0);
                    return false;
                }
            }
            if (sum != 100) {
                setTimeout(function () {
                    $(".validation-alert").fadeTo(500, 0).slideUp(500, function () {
                        $(this).remove();
                    });
                }, 6500);
                $(".beneficiary-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-4 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Total Nominations are not 100%. Kindly ensure all beneficiaries to be 100% and try again </div></div></div>")
                $(window).scrollTop(0);
                return false;
            }
            else {
                return true;
            }
        })
        $("#btnPrevRegQuest").click(function () {
            $("#beneficiary-tab").click();
            $(window).scrollTop(0);
        })

        $("#btnNextRegQuest").click(function () {
            if ($("#QUES_AML_YN").val() == "" || $("#QUES_PEP_YN").val() == "") {
                setTimeout(function () {
                    $(".validation-alert").fadeTo(500, 0).slideUp(500, function () {
                        $(this).remove();
                    });
                }, 3500);
                $(".question-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-4 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Please mark your answer</div></div></div>")
                $(window).scrollTop(0);
                return false;
            }
            else {
                $("#AgreementModal").modal("show");
                //let AgreementInfo = '<img src="/Assets/images/investigation_magnify.png" class="notebook_image terms-cond" alt="Agreement"><br>I, <span class="customer-name"></span>, understand and acknowledge that this proposal form, along with any additional documents or information submitted in connection with this application, shall form the basis of the takaful contract between me and Salaam Family Takaful Limited<br/>I hereby declare and confirm, under the principles of utmost good faith, that all the information provided in this proposal form and the accompanying documents is true, accurate, and complete to the best of my knowledge and belief.I understand that any false statement or misrepresentation, whether intentional or unintentional, may result in the rejection of my takaful application, cancellation of my policy, or denial of any future claims < br />By signing this declaration, I also authorize Salaam Family Takaful to obtain relevant information from any necessary sources, including Government Authorities like NADRA, CDC etc.to verify the accuracy and completeness of the information provided in this proposal form.< br />For the underwriting and claim process, I give my permission to any physician or other medical practitioner, hospital, clinic, other medical or medically related facility, takaful / insurance company, or employer to give Salaam Family Takaful Limited or its authorized representative "ALL INFORMATION" on my behalf including copies of records with reference to any sickness, accidental disability, treatment, examination medical investigation, advice or hospitalization underwent.I hereby apply for the Family Takaful coverage under the terms and conditions of the Participant Membership Document(PMD).<br><b>Disclaimer:</b><br>The Participant can cancel the Membership within fourteen (14) days of the receipt of the Participants Membership Document (PMD) by the Participant.<br>In case of cancellation during this free look period(subject to Terms and Conditions), the paid contribution is refundable.';
                //Swal.fire({
                //    title: 'Terms & Condition',
                //    html: AgreementInfo,
                //    confirmButtonText: 'Agree',
                //    showCancelButton: true,
                //    cancelButtonText: 'Disagree',
                //    allowOutsideClick: () => false
                //}).then((result) => {
                //    if (result.isConfirmed) {
                //        $("#policyConfirm-tab").removeAttr("disabled", true);
                //        $("#policyConfirm-tab").click();
                //        $(window).scrollTop(0);
                //        $("#regQuestions-tab").attr("disabled", true);
                //    }
                //});
                let customer_name = sessionStorage.getItem("customer_name");
                $(".customer-name").html(customer_name)
            }
        })
        $("#btnAgreeTermsCond").click(function () {
            $("#AgreementModal").modal("hide");
            $("#policyConfirm-tab").removeAttr("disabled", true);
            $("#policyConfirm-tab").click();
            $(window).scrollTop(0);
            $("#regQuestions-tab").attr("disabled", true);
        })
        $("#btnDisAgreeTerms").click(function () {
            $("#AgreementModal").modal("hide");
            $("#regQuestions-tab").click();
            $(window).scrollTop(0);
        })

        $("#btnPaymentProcess").click(function () {
            let Prpsl_No = sessionStorage.getItem("Prpsl_No");
            sessionStorage.setItem("PayCheck", "ProposalPay");
            $.ajax({
                //"async": false,
                "crossDomain": true,

                url: "" + Result_API + "/api/DcmntNominee/ValidatePrpslNo?prpsl_no=" + Prpsl_No,
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
                        if (this.APP_STS == "Y") {
                            $("#paymentMode-tab").removeAttr("disabled", true);
                            $("#paymentMode-tab").click();
                            $(window).scrollTop(0);
                        }
                        else {
                            let validationMessage = (this.APP_ALTMSG).slice(10);
                            setTimeout(function () {
                                $(".validation-alert").fadeTo(500, 0).slideUp(500, function () {
                                    $(this).remove();
                                });
                            }, 8000);
                            $(window).scrollTop(0);
                            $(".returnToFlagship").removeAttr("hidden", true);
                            $(".confirmationTab").after("<div class='row validation-alert pb-5'><div class='col-md-3 m-auto pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>" + validationMessage + "</div></div></div>");
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
                                            let transactionID = Prpsl_No.slice(3);
                                            let cust_number = (this.SUM_CUST_CONTPHONE).slice(1);
                                            $.ajax({
                                                type: "POST",
                                                url: "/User/SendSMS",
                                                data: {
                                                    username: this.SUM_FULL_NAME, Txtmessage: "," + validationMessage + ". For any further assistance, please contact CS@salaamtakaful.com via WhatsApp/UAN on 021-111-875-111.", phoneNumber: cust_number, transactionID: transactionID
                                                }
                                            }).done(function (msg) {
                                            });
                                            if (this.SUM_USER_EMAIL_ADDR != null) {
                                                $.ajax({
                                                    type: "POST",
                                                    url: "/User/SendEmail",
                                                    data: { username: this.SUM_FULL_NAME, messageEmail: "<p>" + validationMessage + "</p><p>For any further assistance, please contact CS@salaamtakaful.com via WhatsApp/UAN on 021-111-875-111.</p>", emailAddress: this.SUM_USER_EMAIL_ADDR, subject: "Alert" }
                                                }).done(function (msg) {
                                                });
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
                                            let transactionID = Prpsl_No.slice(3);
                                            let cust_number = (this.SUM_CUST_CONTPHONE).slice(1);
                                            $.ajax({
                                                type: "POST",
                                                url: "/User/SendSMS",
                                                data: {
                                                    username: this.SUM_FULL_NAME, Txtmessage: "," + validationMessage + ". For any further assistance, please contact CS@salaamtakaful.com via WhatsApp/UAN on 021-111-875-111.", phoneNumber: cust_number, transactionID: transactionID
                                                }
                                            }).done(function (msg) {
                                            });
                                            if (this.SUM_USER_EMAIL_ADDR != null) {
                                                $.ajax({
                                                    type: "POST",
                                                    url: "/User/SendEmail",
                                                    data: { username: this.SUM_FULL_NAME, messageEmail: "<p>" + validationMessage + "</p><p>For any further assistance, please contact CS@salaamtakaful.com via WhatsApp/UAN on 021-111-875-111.</p>", emailAddress: this.SUM_USER_EMAIL_ADDR, subject: "Alert" }
                                                }).done(function (msg) {
                                                });
                                            }
                                        })
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        if (jqXHR.status === 401) {
                                        }
                                    }
                                });
                            }
                            return false;
                        }
                    })
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 401) {
                    }
                }
            });

            //    if ($("#QUES_AML_YN").val() == "Y" || $("#QUES_PEP_YN").val() == "Y") {
            //        setTimeout(function () {
            //            $(".validation-alert").fadeTo(500, 0).slideUp(500, function () {
            //                $(this).remove();
            //            });
            //        }, 8000);
            //        $(window).scrollTop(0);
            //        $(".returnToFlagship").removeAttr("hidden", true);
            //        $(".confirmationTab").after("<div class='row validation-alert pb-5'><div class='col-md-3 m-auto'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Case Marked Sub-Standard, refer to Underwriter.</div></div></div>");
            //        let userID = sessionStorage.getItem("User");
            //        if (userID != null) {
            //            $.ajax({
            //                //"async": false,
            //                "crossDomain": true,

            //                url: "" + Result_API + "/api/PosUser/GetPOSUserDetails/" + userID,
            //                type: "GET",
            //                contentType: "application/json; charset=utf-8",
            //                headers: {
            //                    'Content-Type': 'application/x-www-form-urlencoded',
            //                    'Access-Control-Allow-Origin': Result_API,
            //                    'Access-Control-Allow-Methods': 'POST, GET',
            //                    'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
            //                    'Authorization': 'Bearer ' + getsession
            //                },
            //                datatype: 'jsonp',
            //                success: function (result) {
            //                    $(result).each(function () {
            //                        //transaction unique code
            //                        let transactionID = Prpsl_No.slice(3);
            //                        let cust_number = (this.SUM_CUST_CONTPHONE).slice(1);
            //                        $.ajax({
            //                            url: "https://api.itelservices.net/send.php?transaction_id=" + transactionID + "&user=salaamtakaf&pass=kdPre&number=" + cust_number + "&text=Dear customer, your case has been marked as Sub-Standard, kindly refer to Underwriter. Thank you for choosing our Life Takaful Product. Please contact us if you have any query https://salaamtakaful.com/" + "&from=44731&type=sms",
            //                            type: "POST",
            //                            contentType: "application/json; charset=utf-8",
            //                            datatype: JSON,
            //                            success: function (result) {
            //                            },
            //                            error: function (data2) { }
            //                        });
            //                        if (this.SUM_USER_EMAIL_ADDR != null) {
            //                            $.ajax({
            //                                type: "POST",
            //                                url: "/User/SendEmailMsg",
            //                                data: { username: this.SUM_FULL_NAME, messageEmail: "<p>Your case has been marked as Sub-Standard, kindly refer to Underwriter.</p><p>Thank you for choosing our Life Takaful Product.</p><p>Please contact us if you have any query https://salaamtakaful.com/ </p>", emailAddress: this.SUM_USER_EMAIL_ADDR, subject: "Alert" }
            //                            }).done(function (msg) {
            //                            });
            //                        }
            //                    })
            //                },
            //                error: function (data2) { }
            //            });
            //        }
            //        if (userID == null) {
            //            $.ajax({
            //                //"async": false,
            //                "crossDomain": true,

            //                url: "" + Result_API + "/api/PosUser/GetUserByUserCd/" + sessionStorage.getItem("cnic."),
            //                type: "GET",
            //                contentType: "application/json; charset=utf-8",
            //                headers: {
            //                    'Content-Type': 'application/x-www-form-urlencoded',
            //                    'Access-Control-Allow-Origin': Result_API,
            //                    'Access-Control-Allow-Methods': 'POST, GET',
            //                    'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
            //                    'Authorization': 'Bearer ' + getsession
            //                },
            //                datatype: 'jsonp',
            //                success: function (result) {
            //                    $(result).each(function () {
            //                        let transactionID = Prpsl_No.slice(3);
            //                        //let cust_name = this.SUM_FULL_NAME;
            //                        let cust_number = (this.SUM_CUST_CONTPHONE).slice(1);
            //                        $.ajax({
            //                            url: "https://api.itelservices.net/send.php?transaction_id=" + transactionID + "&user=salaamtakaf&pass=kdPre&number=" + cust_number + "&text=Dear customer, your case has been marked as Sub-Standard, kindly refer to Underwriter. Thank you for choosing our Life Takaful Product. Please contact us if you have any query https://salaamtakaful.com/" + "&from=44731&type=sms",
            //                            type: "POST",
            //                            contentType: "application/json; charset=utf-8",
            //                            datatype: JSON,
            //                            success: function (result) {
            //                            },
            //                            error: function (data2) { }
            //                        });
            //                        if (this.SUM_USER_EMAIL_ADDR != null) {
            //                            $.ajax({
            //                                type: "POST",
            //                                url: "/User/SendEmailMsg",
            //                                data: { username: this.SUM_FULL_NAME, messageEmail: "<p>Your case has been marked as Sub-Standard, kindly refer to Underwriter.</p><p>Thank you for choosing our Life Takaful Product.</p><p>Please contact us if you have any query https://salaamtakaful.com/ </p>", emailAddress: this.SUM_USER_EMAIL_ADDR, subject: "Alert" }
            //                            }).done(function (msg) {
            //                            });
            //                        }
            //                    })
            //                },
            //                error: function (data2) { }
            //            });
            //        }
            //        return false;
            //    }
            //    else {
            //        $.ajax({
            //            //"async": false,
            //            "crossDomain": true,

            //            url: "" + Result_API + "/api/DcmntNominee/ValidatePrpslNo?prpsl_no=" + Prpsl_No,
            //            type: "POST",
            //            contentType: "application/json; charset=utf-8",
            //            headers: {
            //                'Content-Type': 'application/x-www-form-urlencoded',
            //                'Access-Control-Allow-Origin': Result_API,
            //                'Access-Control-Allow-Methods': 'POST, GET',
            //                'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
            //                'Authorization': 'Bearer ' + getsession
            //            },
            //            datatype: 'jsonp',
            //            success: function (result) {
            //                $(result).each(function () {
            //                    if (this.APP_STS == "Y") {
            //                        $("#paymentMode-tab").removeAttr("disabled", true);
            //                        $("#paymentMode-tab").click();
            //                    }
            //                    else {
            //                        let validationMessage = (this.APP_ALTMSG).slice(10);
            //                        setTimeout(function () {
            //                            $(".validation-alert").fadeTo(500, 0).slideUp(500, function () {
            //                                $(this).remove();
            //                            });
            //                        }, 8000);
            //                        $(window).scrollTop(0);
            //                        $(".returnToFlagship").removeAttr("hidden", true);
            //                        $(".confirmationTab").after("<div class='row validation-alert pb-5'><div class='col-md-3 m-auto'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>" + validationMessage + "</div></div></div>");
            //                        let userID = sessionStorage.getItem("User");
            //                        if (userID != null) {
            //                            $.ajax({
            //                                //"async": false,
            //                                "crossDomain": true,

            //                                url: "" + Result_API + "/api/PosUser/GetPOSUserDetails/" + userID,
            //                                type: "GET",
            //                                contentType: "application/json; charset=utf-8",
            //                                headers: {
            //                                    'Content-Type': 'application/x-www-form-urlencoded',
            //                                    'Access-Control-Allow-Origin': Result_API,
            //                                    'Access-Control-Allow-Methods': 'POST, GET',
            //                                    'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
            //                                    'Authorization': 'Bearer ' + getsession
            //                                },
            //                                datatype: 'jsonp',
            //                                success: function (result) {
            //                                    $(result).each(function () {
            //                                        //transaction unique code
            //                                        let transactionID = Prpsl_No.slice(3);
            //                                        let cust_number = (this.SUM_CUST_CONTPHONE).slice(1);
            //                                        $.ajax({
            //                                            url: "https://api.itelservices.net/send.php?transaction_id=" + transactionID + "&user=salaamtakaf&pass=kdPre&number=" + cust_number + "&text=Dear customer, " + validationMessage + ". Thank you for choosing our Life Takaful Product. Please contact us if you have any query https://salaamtakaful.com/" + "&from=44731&type=sms",
            //                                            type: "POST",
            //                                            contentType: "application/json; charset=utf-8",
            //                                            datatype: JSON,
            //                                            success: function (result) {
            //                                            },
            //                                            error: function (data2) { }
            //                                        });
            //                                        if (this.SUM_USER_EMAIL_ADDR != null) {
            //                                            $.ajax({
            //                                                type: "POST",
            //                                                url: "/User/SendEmailMsg",
            //                                                data: { username: this.SUM_FULL_NAME, messageEmail: "<p>" + validationMessage + "</p><p>Thank you for choosing our Life Takaful Product.</p><p>Please contact us if you have any query https://salaamtakaful.com/ </p>", emailAddress: this.SUM_USER_EMAIL_ADDR, subject: "Alert" }
            //                                            }).done(function (msg) {
            //                                            });
            //                                        }
            //                                    })
            //                                },
            //                                error: function (data2) { }
            //                            });
            //                        }
            //                        if (userID == null) {
            //                            $.ajax({
            //                                //"async": false,
            //                                "crossDomain": true,

            //                                url: "" + Result_API + "/api/PosUser/GetUserByUserCd/" + sessionStorage.getItem("cnic."),
            //                                type: "GET",
            //                                contentType: "application/json; charset=utf-8",
            //                                headers: {
            //                                    'Content-Type': 'application/x-www-form-urlencoded',
            //                                    'Access-Control-Allow-Origin': Result_API,
            //                                    'Access-Control-Allow-Methods': 'POST, GET',
            //                                    'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
            //                                    'Authorization': 'Bearer ' + getsession
            //                                },
            //                                datatype: 'jsonp',
            //                                success: function (result) {
            //                                    $(result).each(function () {
            //                                        let transactionID = Prpsl_No.slice(3);
            //                                        //let cust_name = this.SUM_FULL_NAME;
            //                                        let cust_number = (this.SUM_CUST_CONTPHONE).slice(1);
            //                                        $.ajax({
            //                                            url: "https://api.itelservices.net/send.php?transaction_id=" + transactionID + "&user=salaamtakaf&pass=kdPre&number=" + cust_number + "&text=Dear customer, " + validationMessage + ". Thank you for choosing our Life Takaful Product. Please contact us if you have any query https://salaamtakaful.com/" + "&from=44731&type=sms",
            //                                            type: "POST",
            //                                            contentType: "application/json; charset=utf-8",
            //                                            datatype: JSON,
            //                                            success: function (result) {
            //                                            },
            //                                            error: function (data2) { }
            //                                        });
            //                                        if (this.SUM_USER_EMAIL_ADDR != null) {
            //                                            $.ajax({
            //                                                type: "POST",
            //                                                url: "/User/SendEmailMsg",
            //                                                data: { username: this.SUM_FULL_NAME, messageEmail: "<p>" + validationMessage + "</p><p>Thank you for choosing our Life Takaful Product.</p><p>Please contact us if you have any query https://salaamtakaful.com/ </p>", emailAddress: this.SUM_USER_EMAIL_ADDR, subject: "Alert" }
            //                                            }).done(function (msg) {
            //                                            });
            //                                        }
            //                                    })
            //                                },
            //                                error: function (data2) { }
            //                            });
            //                        }
            //                        return false;
            //                    }
            //                })
            //            },
            //            error: function (data) { }
            //        });
            //    }
        })

        $("#btnNewQuot").click(function (e) {
            window.location.href = "/Onboarding";
        })
        $.ajax({
            "crossDomain": true,
            url: "" + Global_API + "/API/GLOBALPARAMETERS/GETGLOBALPARAMBYCATEGORY/MRTST",
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
                    $("#FSCU_MRTST_FSCD_DID").append($("<option></option>").val(this.PARAM_VALUE).html(this.PARAM_NAME));
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 401) {
                }
            }
        });

        let next = 0;
        $("#btnAddBeneficiary").click(function (e) {
            e.preventDefault();
            let customer_cnic = $("#FSCU_IDENTIFICATION_NO").val();
            let document_ID = sessionStorage.getItem("thisDocID");
            let beneficiary_name = $("#FCPND_NMNEE_NAME").val();
            let beneficiary_cnic = $("#B_FSCU_IDENTIFICATION_NO").val();
            let beneficiary_age = $("#FCPND_AGE").val();
            let guardian_name = $("#FCNGD_GUDAN_NAME").val();
            let guardian_cnic = $("#G_FSCU_IDENTIFICATION_NO").val();
            let guardian_age = $("#FCNGD_AGE").val();
            let beneficiary_relation = $("#FCPND_RELTN_FSCD_ID").val();
            let beneficiary_share = $("#FCPND_NMNEE_PERCT").val();

            if (beneficiary_name == "" && beneficiary_cnic == "" && beneficiary_age == "" && beneficiary_relation == "" && beneficiary_share == "") {
                $("#btnAddBeneficiary").attr("disabled", true);
                setTimeout(function () {
                    $(".validation-alert").fadeTo(500, 0).slideUp(500, function () {
                        $(this).remove();
                    });
                }, 3500);
                $(".beneficiary-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-4 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Please fill all the information</div></div></div>")
                $(window).scrollTop(0);
                return false;
            }
            if (beneficiary_name != "" && beneficiary_cnic != "" && beneficiary_age != "" && beneficiary_relation != "" && beneficiary_share != "") {
                if (beneficiary_age < 18) {
                    setTimeout(function () {
                        $(".validation-alert").fadeTo(500, 0).slideUp(500, function () {
                            $(this).remove();
                        });
                    }, 6500);

                    if (guardian_name != "" && guardian_cnic != "" && guardian_age != "") {
                        if (guardian_cnic == beneficiary_cnic) {
                            $(window).scrollTop(0);
                            $(".beneficiary-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-4 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Alert!! Same CNIC for beneficiary and guardian</div></div></div>")
                            return false;
                        }
                        if (Number(beneficiary_age) >= Number(guardian_age)) {
                            $(window).scrollTop(0);
                            $(".beneficiary-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-4 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Alert!! Guardian age for beneficiary too low</div></div></div>")
                            return false;
                        }
                        if (beneficiary_cnic == customer_cnic) {
                            $(window).scrollTop(0);
                            $(".beneficiary-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-4 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Alert!! You can not nominate yourself</div></div></div>")
                            return false;
                        }
                        let nomineeArray = [];
                        let nomineeCnic = document.getElementsByName("B_FSCU_IDENTIFICATION_NO");
                        for (let i = 0; i < nomineeCnic.length; i++) {
                            nomineeArray.push(nomineeCnic[i].value);
                        }
                        let check = checkDuplicateNmneCNIC(nomineeArray, beneficiary_cnic);
                        if (check == true) {
                            $(window).scrollTop(0);
                            $(".beneficiary-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-4 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Please add different beneficiary...same beneficiary can not be taken again</div></div></div>")
                            return false;
                        }

                        $("#btnNextBenef").removeAttr("disabled", true);
                        $("#FCPND_NMNEE_NAME").val("");
                        $("#B_FSCU_IDENTIFICATION_NO").val("");
                        $("#FCPND_AGE").val("");
                        $("#FCNGD_GUDAN_NAME").val("");
                        $("#G_FSCU_IDENTIFICATION_NO").val("");
                        $("#FCNGD_AGE").val("");
                        $("#FCPND_RELTN_FSCD_ID").val("");
                        $("#FCPND_NMNEE_PERCT").val("");
                        $("#guardian_infoRow").attr("hidden", true);

                        if ($("#tableBeneficiary tbody").length == 0) {
                            $("#tableBeneficiary").append("<tbody></tbody>");
                        }
                        next += 1;
                        var totalRowCount = 0;
                        var rowCount = 0;
                        var table = document.getElementById("tableBeneficiary");
                        var rows = table.getElementsByTagName("tr")
                        for (var i = 0; i < rows.length; i++) {
                            totalRowCount++;
                            if (rows[i].getElementsByTagName("td").length > 0) {
                                rowCount++;
                            }
                        }
                        if (totalRowCount > 0) {
                            next = totalRowCount;
                        }
                        let relation = '';
                        if (beneficiary_relation == 28) {
                            relation = "Father";
                        } if (beneficiary_relation == 29) {
                            relation = "Mother";
                        } if (beneficiary_relation == 30) {
                            relation = "Brother";
                        } if (beneficiary_relation == 3405) {
                            relation = "Sister";
                        } if (beneficiary_relation == 3406) {
                            relation = "Spouse";
                        } if (beneficiary_relation == 3407) {
                            relation = "Son";
                        } if (beneficiary_relation == 3408) {
                            relation = "Daughter";
                        } if (beneficiary_relation == 3409) {
                            relation = "Niece";
                        } if (beneficiary_relation == 3410) {
                            relation = "Nephew";
                        } if (beneficiary_relation == 3411) {
                            relation = "Grand Father";
                        } if (beneficiary_relation == 3412) {
                            relation = "Grand Mother";
                        } if (beneficiary_relation == 3413) {
                            relation = "Other";
                        }
                        $("#tableBeneficiary tbody").append("<tr>" +
                            "<td hidden><input readonly class='form-control2 text-white' style='width:20px;' name='FCDM_DOCUMENT_ID' id='FCDM_DOCUMENT_ID" + next + "' value='" + document_ID + "'></td>" +
                            "<td hidden><input readonly class='form-control2 text-white' style='width:20px;' name='FCPND_PNMNEDTL_ID' id='FCPND_PNMNEDTL_ID" + next + "' value='" + 0 + "'></td>" +
                            "<td><input class='form-control2 text-white' style='width:100px;' name='FCPND_NMNEE_NAME' id='FCPND_NMNEE_NAME" + next + "' value='" + beneficiary_name + "'></td>" +
                            "<td><input readonly class='form-control2 text-white' style='width:150px;' name='B_FSCU_IDENTIFICATION_NO' id='B_FSCU_IDENTIFICATION_NO" + next + "' value='" + beneficiary_cnic + "'></td>" +
                            "<td><input class='form-control2 text-white' style='width:20px;' name='FCPND_AGE' id='FCPND_AGE" + next + "' value='" + beneficiary_age + "'></td>" +
                            "<td readonly class='text-white'><input hidden class='form-control2 text-white' style='width:60px;' name='FCPND_RELTN_FSCD_ID' id='FCPND_RELTN_FSCD_ID" + next + "' value='" + beneficiary_relation + "'>" + relation + "</td>" +
                            "<td><input class='form-control2 text-white' style='width:30px;' name='FCPND_NMNEE_PERCT' id='FCPND_NMNEE_PERCT" + next + "' value='" + beneficiary_share + "'></td>" +
                            "<td class='grdn_info'><input class='form-control2 text-white' style='width:100px;' name='FCNGD_GUDAN_NAME' id='FCNGD_GUDAN_NAME" + next + "' value='" + guardian_name + "'></td>" +
                            "<td class='grdn_info'><input readonly class='form-control2 text-white' style='width:150px;' name='G_FSCU_IDENTIFICATION_NO' id='G_FSCU_IDENTIFICATION_NO" + next + "' value='" + guardian_cnic + "'></td>" +
                            "<td class='grdn_info'><input class='form-control2 text-white' style='width:20px;' name='FCNGD_AGE' id='FCNGD_AGE" + next + "' value='" + guardian_age + "'></td>" +
                            "<td><img src='/Assets/images/delete_benefeciary.png' class='notebook_image cursor BtnDelete' id='BtnDelete" + next + "' />" +
                            "</tr>");
                        next += 1;
                    }
                }
                if (beneficiary_age >= 18) {
                    setTimeout(function () {
                        $(".validation-alert").fadeTo(500, 0).slideUp(500, function () {
                            $(this).remove();
                        });
                    }, 6500);
                    if (beneficiary_cnic == customer_cnic) {
                        $(window).scrollTop(0);
                        $(".beneficiary-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-4 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Alert!! You can not nominate yourself</div></div></div>")
                        return false;
                    }
                    let nomineeArray = [];
                    let nomineeCnic = document.getElementsByName("B_FSCU_IDENTIFICATION_NO");
                    for (let i = 0; i < nomineeCnic.length; i++) {
                        nomineeArray.push(nomineeCnic[i].value);
                    }
                    let check = checkDuplicateNmneCNIC(nomineeArray, beneficiary_cnic);
                    if (check == true) {
                        $(window).scrollTop(0);
                        $(".beneficiary-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-4 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Please add different beneficiary...same beneficiaries can not be taken twice</div></div></div>")
                        return false;
                    }
                    $("#btnNextBenef").removeAttr("disabled", true);
                    $("#FCPND_NMNEE_NAME").val("");
                    $("#B_FSCU_IDENTIFICATION_NO").val("");
                    $("#FCPND_AGE").val("");
                    $("#FCNGD_GUDAN_NAME").val("");
                    $("#G_FSCU_IDENTIFICATION_NO").val("");
                    $("#FCNGD_AGE").val("");
                    $("#FCPND_RELTN_FSCD_ID").val("");
                    $("#FCPND_NMNEE_PERCT").val("");
                    $("#guardian_infoRow").attr("hidden", true);
                    let relation = '';
                    if (beneficiary_relation == 28) {
                        relation = "Father";
                    } if (beneficiary_relation == 29) {
                        relation = "Mother";
                    } if (beneficiary_relation == 30) {
                        relation = "Brother";
                    } if (beneficiary_relation == 3405) {
                        relation = "Sister";
                    } if (beneficiary_relation == 3406) {
                        relation = "Spouse";
                    } if (beneficiary_relation == 3407) {
                        relation = "Son";
                    } if (beneficiary_relation == 3408) {
                        relation = "Daughter";
                    } if (beneficiary_relation == 3409) {
                        relation = "Niece";
                    } if (beneficiary_relation == 3410) {
                        relation = "Nephew";
                    } if (beneficiary_relation == 3411) {
                        relation = "Grand Father";
                    } if (beneficiary_relation == 3412) {
                        relation = "Grand Mother";
                    } if (beneficiary_relation == 3413) {
                        relation = "Other";
                    }
                    if ($("#tableBeneficiary tbody").length == 0) {
                        $("#tableBeneficiary").append("<tbody></tbody>");
                    }
                    next += 1;
                    var totalRowCount = 0;
                    var rowCount = 0;
                    var table = document.getElementById("tableBeneficiary");
                    var rows = table.getElementsByTagName("tr")
                    for (var i = 0; i < rows.length; i++) {
                        totalRowCount++;
                        if (rows[i].getElementsByTagName("td").length > 0) {
                            rowCount++;
                        }
                    }
                    if (totalRowCount > 0) {
                        next = totalRowCount;
                    }
                    $("#tableBeneficiary tbody").append("<tr>" +
                        "<td hidden><input readonly class='form-control2 text-white' style='width:20px;' name='FCDM_DOCUMENT_ID' id='FCDM_DOCUMENT_ID" + next + "' value='" + document_ID + "'></td>" +
                        "<td hidden><input readonly class='form-control2 text-white' style='width:20px;' name='FCPND_PNMNEDTL_ID' id='FCPND_PNMNEDTL_ID" + next + "' value='" + 0 + "'></td>" +
                        "<td><input class='form-control2 text-white' style='width:100px;' name='FCPND_NMNEE_NAME' id='FCPND_NMNEE_NAME" + next + "' value='" + beneficiary_name + "'></td>" +
                        "<td><input readonly class='form-control2 text-white' style='width:150px;' name='B_FSCU_IDENTIFICATION_NO' id='B_FSCU_IDENTIFICATION_NO" + next + "' value='" + beneficiary_cnic + "'></td>" +
                        "<td><input class='form-control2 text-white' style='width:20px;' name='FCPND_AGE' id='FCPND_AGE" + next + "' value='" + beneficiary_age + "'></td>" +
                        "<td readonly class='text-white'><input hidden class='form-control2 text-white' style='width:60px;' name='FCPND_RELTN_FSCD_ID' id='FCPND_RELTN_FSCD_ID" + next + "' value='" + beneficiary_relation + "'>" + relation + "</td>" +
                        "<td><input class='form-control2 text-white' style='width:30px;' name='FCPND_NMNEE_PERCT' id='FCPND_NMNEE_PERCT" + next + "' value='" + beneficiary_share + "'></td>" +
                        "<td class='grdn_info'><input class='form-control2 text-white' style='width:100px;' name='FCNGD_GUDAN_NAME' id='FCNGD_GUDAN_NAME" + next + "' value='" + guardian_name + "'></td>" +
                        "<td class='grdn_info'><input readonly class='form-control2 text-white' style='width:150px;' name='G_FSCU_IDENTIFICATION_NO' id='G_FSCU_IDENTIFICATION_NO" + next + "' value='" + guardian_cnic + "'></td>" +
                        "<td class='grdn_info'><input class='form-control2 text-white' style='width:20px;' name='FCNGD_AGE' id='FCNGD_AGE" + next + "' value='" + guardian_age + "'></td>" +
                        "<td><img src='/Assets/images/delete_benefeciary.png' class='notebook_image cursor BtnDelete' id='BtnDelete" + next + "' />" +
                        "</tr>");
                    next += 1;
                }
            }
        });

        $(document).on('click', '.BtnDelete', function () {
            $(this).closest('tr').remove();
            return false;
        });
        $("#btnCreditCard").click(function () {
            $("#PaymentType").val("CC");
            $("#P_DOCUMENT_ID").attr("required", true);
            $("#FIPR_COLL_AMOUNT").attr("required", true);
            $("#PaymentType").attr("required", true);
            $(".bank_charges").html("2.6%")
            $("#chargesDisclaimer").modal("show");
            sessionStorage.setItem("BNK_CHRGS", "2669");
        })
        $("#btnNIFTPay").click(function () {
            $("#PaymentType").val("NI");
            $("#P_DOCUMENT_ID").attr("required", true);
            $("#FIPR_COLL_AMOUNT").attr("required", true);
            $("#PaymentType").attr("required", true);
            $(".disclaimer-text").html("Free! Zero bank transactional fee on Bank Transfer & Easy Paisa Premium / Loan Payments!")
            //$(".bank_charges").html("Free")
            $("#chargesDisclaimer").modal("show");
        })
        $("#btnJazzCash").click(function () {
            $("#PaymentType").val("JC");
            $("#P_DOCUMENT_ID").attr("required", true);
            $("#FIPR_COLL_AMOUNT").attr("required", true);
            $("#PaymentType").attr("required", true);
            //$(".bank_charges").html("2.6%")
            //$("#chargesDisclaimer").modal("show");
        })
        $("#btnEasyPaisaPay").click(function () {
            $("#PaymentType").val("EP");
            $("#P_DOCUMENT_ID").attr("required", true);
            $("#FIPR_COLL_AMOUNT").attr("required", true);
            $("#PaymentType").attr("required", true);
            //$(".bank_charges").html("2.6%")
            //$("#chargesDisclaimer").modal("show");
        })
        $.ajax({
            "crossDomain": true,
            url: "" + Result_API + "/API/CITY/GET_CITY_LIST",
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
                //$("#FSCT_CITY_ID").empty();
                //$("#FSCT_CITY_ID").append($("<option value=''>Select</option>"));

                for (let i = 0; i < result.length; i++) {
                    $.ajax({
                        "crossDomain": true,
                        url: "" + Global_API + "/API/PROVINCE/GET_PROVINCE_DETAILS_BY_CONT/1",
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
                        success: function (result2) {
                            $(result2).each(function () {
                                if (this.FSSP_PROVINCE_ID == result[i].FSSP_PROVINCE_ID) {
                                    $("#FSCT_CITY_ID").append($("<option></option>").val(result[i].FSCT_CITY_ID).html(result[i].FSCT_CITY_NAME + "-" + this.FSSP_PROVINCE_NAME));
                                }
                            });
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            if (jqXHR.status === 401) {
                            }
                        }
                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 401) {
                }
            }
        });
    })
}()
//function showChrgesDisclaimer(modeID) {
//    if (modeID == 'btnCreditCard') {
//    }
//}

function setProvince() {
    $.ajax({
        "crossDomain": true,
        url: "" + Result_API + "/API/CITY/GET_CITY_DETAILSBY_ID/" + $("#FSCT_CITY_ID").val(),
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
                $("#FSSP_PROVINCE_ID").val(this.FSSP_PROVINCE_ID);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401) {
            }
        }
    });
}

function setNationality(Val) {
    $("#FSCU_BIRTH_COUNTRY").val(Val);
}
function setCNICFormat(custCNIC, ID) {
    if (custCNIC[5] == "-" && custCNIC[13] == "-") {
        console.log("contains");
    }
    if (custCNIC.length == 13 && custCNIC[5] != "-" && custCNIC[13] != "-") {
        let n1 = custCNIC.substring(0, 5);
        let n2 = custCNIC.substring(5, 12);
        let addn = n1 + "-" + n2 + "-" + custCNIC[custCNIC.length - 1]
        $("#" + ID).val(addn);
        return addn;
    }
    if (custCNIC.length != 13 && custCNIC[5] != "-" && custCNIC[13] != "-") {
        $("#" + ID).val("");
    }
    if (custCNIC[5] == "-" || custCNIC[13] == "-") {
        custCNIC = custCNIC.replaceAll("-", "");
        let n1 = custCNIC.substring(0, 5);
        let n2 = custCNIC.substring(5, 12);
        let addn = n1 + "-" + n2 + "-" + custCNIC[custCNIC.length - 1]
        $("#" + ID).val(addn);
        return addn;
    }
}
function isValidInput(inputString) {
    var regex = /^\d{5}-\d{7}-\d$/;
    return regex.test(inputString);
}
function checkDuplicateNmneCNIC(nomineeArray, val) {
    if (val == nomineeArray[nomineeArray.length - 1]) {
        return true;
    } else {
        for (i = 0; i < nomineeArray.length; i++) {
            if (val == nomineeArray[i]) {
                return true;
            }
        }
    }
}
function ReturnAMLVal(ID, Val) {
    $("#QUES_AML_YN").val(Val);
}
function ReturnPepVal(ID, Val) {
    $("#QUES_PEP_YN").val(Val);
}
function checkDocumentsPosted(cnic) {
    $.ajax({
        "crossDomain": true,

        url: "" + Result_API + "/API/DMS/Get_DMS_DTLS/" + cnic,
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
            if (result.length > 1) {
                $(".cnicDocAlert").removeAttr("hidden", true);
                $("#btnNextIdentify").removeAttr("type");
                $("#btnNextIdentify").attr("type", "button");
                $("#basicInfo-tab").removeAttr("disabled", true);
                $("#userIdentification-tab").removeAttr("disabled", true);
                $("#beneficiary-tab").removeAttr("disabled", true);
                $("#beneficiary-tab").click();
                $("#btnNextIdentify").removeAttr("type");
                $("#btnNextIdentify").attr("type", "button");
                $("#btnNextIdentify").click(function () {
                    $("#beneficiary-tab").removeAttr("disabled", true);
                    $("#beneficiary-tab").click();
                    $(window).scrollTop(0);
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401) {
            }
        }
    });
}
function FileUploadOpen(ID) {
    ID = ID.slice(9);
    $(".FPDD_PATH" + ID).click();
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