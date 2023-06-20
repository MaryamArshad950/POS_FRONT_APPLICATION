!function () {
}()
//function getGlobalSession() {
//    let coreUser = {
//        username: corePos,
//        password: corePos
//    };
//    coreUser = JSON.stringify(coreUser);

//    $.ajax({
//        //"async": false,
//        "crossDomain": true,
//        url: Global_API + "/API/AUTH_CONTROLLER/AUTHENTICATE",
//        type: "POST",
//        contentType: "application/json; charset=utf-8",
//        datatype: JSON,
//        data: coreUser,
//        success: function (result) {
//            sessionStorage.setItem("Global", result.token)
//        },
//        error: function (data) { }
//    });
//}
//function getCoreSessions() {
//    let coreUser = {
//        username: corePos,
//        password: corePos
//    };
//    coreUser = JSON.stringify(coreUser);

//    $.ajax({
//        //"async": false,
//        "crossDomain": true,
//        url: Global_API + "/API/AUTH_CONTROLLER/AUTHENTICATE",
//        type: "POST",
//        contentType: "application/json; charset=utf-8",
//        datatype: JSON,
//        data: coreUser,
//        success: function (result) {
//            sessionStorage.setItem("Global", result.token)
//            let coretoken = result.token;
//            ProcessGlobalCore(coretoken);
//        },
//        error: function (data) { }
//    });
//}
function ProcessGlobalCore(coresession) {
    //$.ajax({
    //    //"async": false,
    //    "crossDomain": true,
    //    url: "" + Global_API + "/API/GLOBALPARAMETERS/GETGLOBALPARAMBYCATEGORY/PFREQ",
    //    type: "GET",
    //    headers: {
    //        'Content-Type': 'application/x-www-form-urlencoded',
    //        'Access-Control-Allow-Origin': Global_API,
    //        'Access-Control-Allow-Methods': 'POST, GET',
    //        'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
    //        'Authorization': 'Bearer ' + coresession
    //    },
    //    datatype: 'jsonp',
    //    contentType: "application/json; charset=utf-8",
    //    success: function (result) {
    //        $("#FCDM_PFREQ_FSCD_ID").empty();
    //        $("#FCDM_PFREQ_FSCD_ID").append($("<option value=''>Select</option>"));
    //        $(result).each(function () {
    //            $("#FCDM_PFREQ_FSCD_ID").append($("<option></option>").val(this.PARAM_VALUE).html(this.PARAM_NAME));
    //        });
    //    },
    //    error: function (data) { }
    //});
    //$.ajax({
    //    //"async": false,
    //    "crossDomain": true,
    //    url: "" + Global_API + "/API/GLOBALPARAMETERS/GETGLOBALPARAMBYCATEGORY/GENDR",
    //    headers: {
    //        'Content-Type': 'application/x-www-form-urlencoded',
    //        'Access-Control-Allow-Origin': Global_API,
    //        'Access-Control-Allow-Methods': 'POST, GET',
    //        'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
    //        'Authorization': 'Bearer ' + coresession
    //    },
    //    datatype: 'jsonp',
    //    type: "GET",
    //    contentType: "application/json; charset=utf-8",
    //    success: function (result) {
    //        $("#FCDM_OW_GENDR_FSCD_ID").empty();
    //        $("#FCDM_OW_GENDR_FSCD_ID").append($("<option value=''>Select</option>"));

    //        for (let i = 0; i < result.length; i++) {
    //            $("#FCDM_OW_GENDR_FSCD_ID").append($("<option></option>").val(result[i].PARAM_VALUE).html(result[i].PARAM_NAME));
    //        }
    //    },
    //    error: function (data) { }
    //});
    $.ajax({
        //"async": false,
        "crossDomain": true,
        url: "" + Global_API + "/API/GLOBALPARAMETERS/GETGLOBALPARAMBYCATEGORY/CUOCP",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': Global_API,
            'Access-Control-Allow-Methods': 'POST, GET',
            'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
            'Authorization': 'Bearer ' + coresession
        },
        datatype: 'jsonp',
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#CUOCP_FSCD_ID").empty();
            $("#CUOCP_FSCD_ID").append($("<option value=''>Select</option>"));
            $(result).each(function () {
                if (!(this.PARAM_VALUE >= '77' && this.PARAM_VALUE <= '111')) {
                    $("#CUOCP_FSCD_ID").append($("<option></option>").val(this.PARAM_VALUE).html(this.PARAM_NAME));
                }
            });
            $(result).each(function () {
                if (this.PARAM_VALUE >= '77' && this.PARAM_VALUE <= '111') {
                    $("#CUOCP_FSCD_ID").append($("<option></option>").val(this.PARAM_VALUE).html(this.PARAM_NAME));
                }
            });
        },
        error: function (data) { }
    });
    $.ajax({
        //"async": false,
        "crossDomain": true,

        url: "" + Global_API + "/API/GLOBALPARAMETERS/GETGLOBALPARAMBYCATTYPE/CHCFG/POS_PROD_ID",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': Global_API,
            'Access-Control-Allow-Methods': 'POST, GET',
            'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
            'Authorization': 'Bearer ' + coresession
        },
        datatype: 'jsonp',
        success: function (result) {
            $("#FSPM_PRODUCT_ID").empty();
            $("#FSPM_PRODUCT_ID").append($("<option value=''>Select</option>"));
            $(result).each(function () {
                $("#FSPM_PRODUCT_ID").append($("<option></option>").val(this.PARAM_CODE_VAL).html(this.PARAM_NAME));
                $("#FSPM_PRODUCT_ID").val(this.PARAM_CODE_VAL);
                //Medical Questions API
                $.ajax({
                    //"async": false,
                    "crossDomain": true,

                    url: "" + Global_API + "/API/PRODUCTQUEST/GET_QUEST_BYPRODUCTID/" + this.PARAM_CODE_VAL,
                    //url: "" + Result_API + "/API/PRODUCTQUEST/GET_QUEST_BYPRODUCTID/18",
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Access-Control-Allow-Origin': Global_API,
                        'Access-Control-Allow-Methods': 'POST, GET',
                        'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                        'Authorization': 'Bearer ' + coresession
                    },
                    datatype: 'jsonp',
                    success: function (result) {
                        if (result.length >= 1) {
                            $("#questionare_section").empty();
                            for (let i = 0; i < result.length; i++) {
                                $("#questionare_section").append(
                                    "<div class='col-md-12 mt-3'>" +
                                    "<input name='FSPQS_QSTNR_FSCD_ID' id='FSPQS_QSTNR_FSCD_ID" + (i + 1) + "' value='" + result[i].FSPQS_QSTNR_FSCD_ID + "' required  hidden/>" +
                                    "<input name='FCUQ_ANSR_YN' id='FCUQ_ANSR_YN" + (i + 1) + "' required  hidden/>" +
                                    "<p class='text-white text-question line-height-2'> " + result[i].FSCD_SYS_CODE_DESCR + " " +
                                    "</p>" +
                                    "<div class='row ml-2'>" +
                                    "<div class='form-check form-check-success mr-3'>" +
                                    "<label for='FSPQS_PRODQESTNR_ID_Y" + (i + 1) + "' class='form-check-label text-white'> Yes" +
                                    "<input class='form-check-input' type='radio' id='FSPQS_PRODQESTNR_ID_Y" + (i + 1) + "' name='FSPQS_PRODQESTNR_ID" + (i + 1) + "' value='Y' onclick='ReturnQuestVal(this.id, this.value), DiseaseAnalysis(this.id)' /><i class='input-helper'></i>" +
                                    "</label>" +
                                    "</div>" +
                                    "<div class='form-check form-check-success'>" +
                                    "<label for='FSPQS_PRODQESTNR_ID_N" + (i + 1) + "' class='form-check-label text-white'> No" +
                                    "<input class='form-check-input' type='radio' id='FSPQS_PRODQESTNR_ID_N" + (i + 1) + "' name='FSPQS_PRODQESTNR_ID" + (i + 1) + "' value='N' onchange='ReturnQuestVal(this.id, this.value)' /><i class='input-helper'></i>" +
                                    "</label>" +
                                    "</div>" +
                                    "</div>" +
                                    "</div>"
                                );
                            }
                        }
                    },
                    error: function (data) { }
                });
            });
        },
        error: function (data) { }
    });
    $.ajax({
        //"async": false,
        "crossDomain": true,
        url: "" + Global_API + "/API/GLOBALPARAMETERS/GETGLOBALPARAMBYCATTYPE/CHCFG/POS_IDENTYPE_ID",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': Global_API,
            'Access-Control-Allow-Methods': 'POST, GET',
            'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
            'Authorization': 'Bearer ' + coresession
        },
        datatype: 'jsonp',
        success: function (result) {
            $("#FCDM_OW_FSNT_IDENTYPE_ID").empty();
            $("#FCDM_OW_FSNT_IDENTYPE_ID").append($("<option value=''>Select</option>"));
            $(result).each(function () {
                $("#FCDM_OW_FSNT_IDENTYPE_ID").append($("<option></option>").val(this.PARAM_CODE_VAL).html(this.PARAM_NAME));
                $("#FCDM_OW_FSNT_IDENTYPE_ID").val(this.PARAM_CODE_VAL);
            });
        },
        error: function (data) { }
    });
    $.ajax({
        //"async": false,
        "crossDomain": true,
        url: "" + Global_API + "/API/GLOBALPARAMETERS/GETGLOBALPARAMBYCATTYPE/CHCFG/POS_PRMFND_ID",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': Global_API,
            'Access-Control-Allow-Methods': 'POST, GET',
            'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
            'Authorization': 'Bearer ' + coresession
        },
        datatype: 'jsonp',
        success: function (result) {
            $(result).each(function () {
                localStorage.setItem("FUNDID", this.PARAM_CODE_VAL);
                localStorage.getItem("FUNDID");
            });
        },
        error: function (data) { }
    });

    $.ajax({
        //"async": false,
        "crossDomain": true,

        url: "" + Global_API + "/API/GLOBALPARAMETERS/GETGLOBALPARAMBYCATTYPE/CHCFG/POS_CVMLT_TYP",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': Global_API,
            'Access-Control-Allow-Methods': 'POST, GET',
            'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
            'Authorization': 'Bearer ' + coresession
        },
        datatype: 'jsonp',
        success: function (result) {
            $("#FCDM_PLAN_CASE_STATUS").empty();
            $("#FCDM_PLAN_CASE_STATUS").append($("<option value=''>Select</option>"));

            $(result).each(function () {
                $("#FCDM_PLAN_CASE_STATUS").append($("<option></option>").val(this.PARAM_CODE_VAL).html(this.PARAM_NAME));
                $("#FCDM_PLAN_CASE_STATUS").val(this.PARAM_CODE_VAL);
            });
        },
        error: function (data) { }
    });
    $.ajax({
        //"async": false,
        "crossDomain": true,

        url: "" + Global_API + "/API/GLOBALPARAMETERS/GETGLOBALPARAMBYCATTYPE/CHCFG/POS_CVMLT_VAL",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': Global_API,
            'Access-Control-Allow-Methods': 'POST, GET',
            'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
            'Authorization': 'Bearer ' + coresession
        },
        datatype: 'jsonp',
        success: function (result) {
            $("#FCDM_COVER_MULTIPLE").empty();
            $("#FCDM_COVER_MULTIPLE").append($("<option value=''>Select</option>"));

            $(result).each(function () {
                $("#FCDM_COVER_MULTIPLE").append($("<option></option>").val(this.PARAM_CODE_VAL).html(this.PARAM_NAME));
                $("#FCDM_COVER_MULTIPLE").val(this.PARAM_CODE_VAL);
            });
        },
        error: function (data) { }
    });
    $.ajax({
        //"async": false,
        "crossDomain": true,

        url: "" + Global_API + "/API/GLOBALPARAMETERS/GETGLOBALPARAMBYCATTYPE/CHCFG/POS_CNTBIDX_RT",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': Global_API,
            'Access-Control-Allow-Methods': 'POST, GET',
            'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
            'Authorization': 'Bearer ' + coresession
        },
        datatype: 'jsonp',
        success: function (result) {
            $("#FCDM_CONTRIB_IDX_RATE").empty();
            $("#FCDM_CONTRIB_IDX_RATE").append($("<option value=''>Select</option>"));

            $(result).each(function () {
                $("#FCDM_CONTRIB_IDX_RATE").append($("<option></option>").val(this.PARAM_CODE_VAL).html(this.PARAM_NAME));
                $("#FCDM_CONTRIB_IDX_RATE").val(this.PARAM_CODE_VAL);
            });
        },
        error: function (data) { }
    });
    $.ajax({
        //"async": false,
        "crossDomain": true,

        url: "" + Global_API + "/API/GLOBALPARAMETERS/GETGLOBALPARAMBYCATTYPE/CHCFG/POS_FCVALIDX_RT",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': Global_API,
            'Access-Control-Allow-Methods': 'POST, GET',
            'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
            'Authorization': 'Bearer ' + coresession
        },
        datatype: 'jsonp',
        success: function (result) {
            $("#FCDM_FACEVAL_IDX_RATE").empty();
            $("#FCDM_FACEVAL_IDX_RATE").append($("<option value=''>Select</option>"));

            $(result).each(function () {
                $("#FCDM_FACEVAL_IDX_RATE").append($("<option></option>").val(this.PARAM_CODE_VAL).html(this.PARAM_NAME));
                $("#FCDM_FACEVAL_IDX_RATE").val(this.PARAM_CODE_VAL);
            });
        },
        error: function (data) { }
    });

    let riderName = '';
    let colSize = '';
    $.ajax({
        //"async": false,
        "crossDomain": true,
        url: "" + Global_API + "/API/CREATE_RIDER/GET_PRODUCT_RIDER_LIST",
        type: "GET",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': Global_API,
            'Access-Control-Allow-Methods': 'POST, GET',
            'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
            'Authorization': 'Bearer ' + coresession
        },
        datatype: 'jsonp',
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            $(".ridersList").empty();
            for (let i = 0; i < result.length; i++) {
                riderName = result[i].FSPM_PRODUCT_NAME;
                if (result[i].FSPM_PRODUCT_ID == '20') {
                    colSize = 'col-md-4'
                }
                else {
                    colSize = 'col-md-3'
                }
                $(".ridersList").append(
                    "<div class='" + colSize + " mb-2'>" +
                    "<div class='input-group btn btn-outline-info p-1 border-1 box-shadow-1' id='rdrGroup" + result[i].FSPM_PRODUCT_ID + "' onclick='AddRdr(this, this.id)'>" +
                    "<div class='input-group-append'>" +
                    "<span class='m-0 pt-3 px-4'>" +
                    riderName +
                    "</span>" +
                    "</div>" +
                    "<div class='input-group-append m-auto'>" +
                    "<input class='form-control checkbox' type='checkbox' id='rdrInput" + result[i].FSPM_PRODUCT_ID + "' />" +
                    "</div>" +
                    "</div>" +
                    "</div>"
                )
            }
        },
        error: function (data) { }
    });
//    if (sessionStorage.getItem("cnic.") != null || sessionStorage.getItem("DocCNIC") != null) {
//        let sessionCNIC = '';
//        //let sessionPos = sessionStorage.getItem("GlobalPos");
//        if (sessionStorage.getItem("cnic.") != null) {
//            sessionCNIC = sessionStorage.getItem("cnic.").replace(/^(\d{5})(\d{7})(\d)$/, "$1-$2-$3");
//            fillCustomerInfo(sessionCNIC, coresession)
//        }
//        else {
//            sessionCNIC = sessionStorage.getItem("DocCNIC");
//            fillCustomerInfo(sessionCNIC, coresession)
//        }
//    }
//    function fillCustomerInfo(CNIC, session) {
//        $(".biodata").attr("hidden", true);
//        $(".gendetails").attr("hidden", true);
//        $(".healthdetails").attr("hidden", true);
//        $.ajax({
//            //"async": false,
//            "crossDomain": true,

//            type: "GET",
//            url: "" + Global_API + "/API/CUSTOMER/SEARCH_CUSTOMER/" + CNIC,
//            contentType: "application/json; charset=utf-8",
//            headers: {
//                'Content-Type': 'application/x-www-form-urlencoded',
//                'Access-Control-Allow-Origin': Global_API,
//                'Access-Control-Allow-Methods': 'POST, GET',
//                'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
//                'Authorization': 'Bearer ' + session
//            },
//            datatype: 'jsonp',
//            timeout: 2000,
//            success: function (data) {
//                $("#CUOCP_FSCD_ID").removeAttr("required", true);

//                if (data.length == 1) {
//                    $(data).each(function () {
//                        let DATEOFBIRTH = (this.FSCU_DATEOFBIRTH).slice(0, 10);
//                        $("#FCDM_OWCUST_FIRSTNAME").val(this.FSCU_FIRST_NAME);
//                        $("#FCDM_OWCUST_MDDLNAME").val(this.FSCU_MIDDLE_NAME);
//                        $("#FCDM_OWCUST_LASTNAME").val(this.FSCU_LAST_NAME);
//                        $("#FCDM_OW_GENDR_FSCD_ID").val(this.FSCU_GENDR_FSCD_DID);
//                        $("#FCDM_OWCUST_DOB").val(DATEOFBIRTH);
//                        $("#FCDM_OWCUST_HEITACT").val(this.FSCU_CUST_HEIGHT);
//                        $("#FCDM_OWCUST_WEITACT").val(this.FSCU_CUST_WEIGHT);
//                        $("#FCDM_OWCUST_BMI").val(this.FSCU_CUST_BMI);
//                        $("#FCDM_OW_CUOCP_FSCD_ID").val(this.FSCU_CUOCP_FSCD_DID);
//                        //    $("#FCDM_OWCUST_MOBILENO").val(this.FSCU_FIRST_NAME);
//                        //    $("#FCDM_OWCUST_EMAILADDR").val(this.FSCU_FIRST_NAME);
//                    })
//                }
//            },
//            error: function (jqXHR, textStatus, errorThrown) {
//                if (jqXHR.status === 401) {
//                    alert("Session timeout");
//                    sessionStorage.clear();
//                    localStorage.clear();
//                    window.location.href = "/"
//                }
//            }
//        });
//        $.ajax({
//            "crossDomain": true,
//            url: "" + Result_API + "/api/Partcipant/GetParticipantAllGenDoc/" + CNIC,
//            type: "GET",
//            contentType: "application/json; charset=utf-8",
//            headers: {
//                'Content-Type': 'application/x-www-form-urlencoded',
//                'Access-Control-Allow-Origin': Result_API,
//                'Access-Control-Allow-Methods': 'POST, GET',
//                'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
//                'Authorization': 'Bearer ' + sessionPos
//            },
//            datatype: 'jsonp',
//            success: function (result) {
//                if (result.length >= 1) {
//                    $("#FCDM_OWCUST_MOBILENO").val(result[0].FCDM_OWCUST_MOBILENO);
//                    $("#FCDM_OWCUST_EMAILADDR").val(result[0].FCDM_OWCUST_EMAILADDR);
//                }
//            },
//            error: function (jqXHR, textStatus, errorThrown) {
//                if (jqXHR.status === 401) {
//                    alert("Session timeout");
//                    sessionStorage.clear();
//                    localStorage.clear();
//                    window.location.href = "/"
//                }
//            }
//        });
//    }
}