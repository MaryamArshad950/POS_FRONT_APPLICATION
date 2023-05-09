!function () {
    $(document).ready(function () {
        let thisCustCNIC = sessionStorage.getItem("cnic.");
        thisCustCNIC = thisCustCNIC.replace(/^(\d{5})(\d{7})(\d)$/, "$1-$2-$3");
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
                    $(".SUM_FULL_NAME").html(this.SUM_FULL_NAME);
                    $("#SUM_FULL_NAME").val(this.SUM_FULL_NAME);
                    $("#SUM_CUST_CONTPHONE").val(this.SUM_CUST_CONTPHONE);
                    $("#cnic").html(thisCustCNIC);
                    $("#status").html("Active")
                    $("#emailAddress").val(this.SUM_USER_EMAIL_ADDR);
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
                        url: "" + Global_API + "/API/CUSTOMER_ADDRESS/GET_CUST_ADDRESS_DETAILS/" + this.FSCU_CUSTOMER_CODE + "/" + "P",
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
                                $(".FSCA_ADDRESS1").html(this.FSCA_ADDRESS1);
                                $("#FSCA_ADDRESS_TYPE").val(this.FSCA_ADDRESS_TYPE);
                                $.ajax({
                                    "crossDomain": true,
                                    url: Result_API + "/API/CITY/GET_CITY_LIST",
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
                                        $("#FSCT_CITY_ID").empty();
                                        $("#FSCT_CITY_ID").append($("<option value=''>Select</option>"));

                                        for (let i = 0; i < result.length; i++) {
                                            $.ajax({
                                                "crossDomain": true,
                                                url: "" + Global_API + "/API/PROVINCE/GET_PROVINCE_DETAILS_BY_CONT/" + result[i].FSSC_COUNTRY_ID,
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
    })
}()
function setProvince() {
    $.ajax({
        "crossDomain": true,
        url: Result_API + "/API/CITY/GET_CITY_DETAILSBY_ID/" + $("#FSCT_CITY_ID").val(),
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