!function () {
    $(document).ready(function () {
        //
        $("#spinner").hide();
        if ($("#FCDM_DOCUMENT_CODE").val() != "") {
            let document_code = $("#FCDM_DOCUMENT_CODE").val();
            sessionStorage.setItem("DocCODE", document_code)
            sessionStorage.getItem("DocCODE");
        }

        if (sessionStorage.getItem("tokenIndex") == null && sessionStorage.getItem("token") != "" && localStorage.getItem("token1") == null && localStorage.getItem("token3") == null) {
            localStorage.setItem("token3", sessionStorage.getItem("token"));
        }

        let document_code = sessionStorage.getItem("DocCODE");
        var today = new Date();
        today.setDate(today.getDate() + 5);
        var yeartoday = today.getFullYear();
        var monthtoday = String(today.getMonth() + 1).padStart(2, '0');
        var day = String(today.getDate()).padStart(2, '0');
        var finalDate = yeartoday + '-' + monthtoday + '-' + day;
        $.ajax({
            "crossDomain": true,

            url: "" + Result_API + "/api/Partcipant/GetParticipantDetails/" + document_code,
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
            cache: false,
            success: function (data2) {
                console.log(data2)
                for (let i = 0; i <= data2.length - 1; i++) {
                    let cust_dob = (data2[i].DOB).slice(0, 10);
                    sessionStorage.setItem("DocCNIC", data2[i].FCDM_OWCUST_CNIC)
                    sessionStorage.getItem("DocCNIC");
                    let userCreated = sessionStorage.getItem("User");
                    let userName = data2[i].PARTICIPANT_NAME;
                    let user = sessionStorage.getItem("User_");
                    if (user == null) {
                        if (userName.includes(" ")) {
                            userName = userName.split(" ")[0] + (document_code.slice(3));
                        }
                        else {
                            userName = userName + (document_code.slice(3));
                        }
                    }
                    else {
                        userName = user;
                    }
                    sessionStorage.setItem("customer_name", data2[i].PARTICIPANT_NAME);
                    sessionStorage.getItem("customer_name");
                    sessionStorage.setItem("cust_gender", data2[i].GENDER);
                    sessionStorage.getItem("cust_gender");

                    $("#tableBasicInfo tbody").append("<tr>" +
                        "<td hidden><input readonly class='input_custom' style='width:100px;' name='SUM_SYS_USER_ID' id='SUM_SYS_USER_ID' value='" + userCreated + "'></td>" +
                        "<td hidden><input readonly class='input_custom' style='width:200px;' name='SUM_SYS_USER_CODE' id='SUM_SYS_USER_CODE' value='" + (data2[i].FCDM_OWCUST_CNIC).replaceAll("-", "") + "'></td>" +
                        "<td hidden><input readonly class='input_custom' style='width:200px;' name='USER_NAME' id='USER_NAME' value='" + userName + "'></td>" +
                        "<td><input readonly class='input_custom' style='width:200px;' id='PLAN_NAME' value='Flagship Plan'></td>" +
                        "<td><input readonly class='input_custom' style='width:200px;' name='SUM_FULL_NAME' id='SUM_FULL_NAME' value='" + (data2[i].FULL_NAME).replace(/\s{2,}/g, ' ') + "'></td>" +
                        "<td hidden><input readonly class='input_custom' style='width:200px;' name='SUM_CUST_CONTPHONE' id='SUM_CUST_CONTPHONE' value='" + data2[i].FCDM_OWCUST_MOBILENO + "'></td>" +
                        "<td><input readonly class='input_custom' style='width:100px;' name='PROPOSAL_NUMBER' id='PROPOSAL_NUMBER' value='" + data2[i].DOCUMENT_CODE + "'></td>" +
                        "<td><input readonly class='input_custom' style='width:100px;' name='FCDM_PLAN_CONTRIB' id='FCDM_PLAN_CONTRIB' value='" + data2[i].BASIC_CONTRIBUTION + "'></td>" +
                        "<td><input readonly class='input_custom' style='width:50px;' name='FCDM_PAYING_TERM' id='FCDM_PAYING_TERM' value='" + data2[i].MEMBERSHIP_TERM + "'></td>" +
                        "<td><input readonly class='input_custom' style='width:200px;' name='FCDM_FACE_VALUE' id='FCDM_FACE_VALUE' value='" + data2[i].POL_COVGE_SUMASSURD + "'></td>" +
                        "<td><input readonly class='input_custom' type='date' style='width:100px;' name='SUM_CUST_DOB' id='SUM_CUST_DOB' value='" + cust_dob + "'></td>" +
                        "<td hidden><input class='input_custom' style='width:100px;' name='SUM_USER_EMAIL_ADDR' id='SUM_USER_EMAIL_ADDR' value='" + data2[i].FCDM_OWCUST_EMAILADDR + "'></td>" +
                        "<td hidden><input class='input_custom' style='width:100px;' name='FSDS_DESIGN_ID' id='FSDS_DESIGN_ID' value='" + data2[i].FCDM_OW_CUOCP_FSCD_ID + "'></td>" +
                        "</tr>");

                    let birth_date = new Date(data2[i].DOB);
                    let birthMonth = birth_date.getMonth() + 1;
                    if (("" + birthMonth).length == 1) {
                        birthMonth = "0" + birthMonth;
                    }
                    birth_date = birth_date.getDate() + "-" + birthMonth + "-" + birth_date.getFullYear();
                    $("#p_fcdm_document_code").val(data2[i].DOCUMENT_CODE);
                    $("#p_reference_no").val(data2[i].DOCUMENT_CODE);
                    $("#p_commencement_date").val(finalDate)
                    if (data2[i].BASIC_PLAN == '28') {
                        $("#FSPM_PRODUCT_ID").val("Salaam Life & Saving Plan")
                    }
                    if (data2[i].BASIC_PLAN == '19') {
                        $("#FSPM_PRODUCT_ID").val("Salaam Saving(Vanilla2)")
                    }

                    $("#p_PARTICIPANT_NAME").val(data2[i].FULL_NAME.replace(/\s{2,}/g, ' '));
                    if (data2[i].GENDER == '2') {
                        $("#p_GENDER").val("Female")
                    }
                    else {
                        $("#p_GENDER").val("Male")
                    }
                    //if (this.EM_TXT_VALUE == 'Y') {
                    //    $("#extraMortality").val("Applicable")
                    //}
                    //else {
                    //    $("#extraMortality").val("N/A")
                    //}
                    $("#extraMortality").val(data2[i].EM_TXT_VALUE)
                    $("#p_DOB").val(birth_date);
                    $("#p_CONTRIBUTION_FREQUENCY").val(data2[i].CONTRIBUTION_FREQENCY);
                    let BASIC_CONTRIBUTION = data2[i].BASIC_CONTRIBUTION;
                    let nf = new Intl.NumberFormat('en-US');
                    BASIC_CONTRIBUTION = nf.format(BASIC_CONTRIBUTION);

                    let POL_COVGE_SUMASSURD = data2[i].POL_COVGE_SUMASSURD;
                    POL_COVGE_SUMASSURD = nf.format(POL_COVGE_SUMASSURD);

                    $("#p_BASIC_CONTRIBUTION").val("PKR " + BASIC_CONTRIBUTION);
                    $("#p_MEMBERSHIP_TERM").val(data2[i].MEMBERSHIP_TERM);
                    $("#p_COVER_MULTIPLE_TYPE").val(data2[i].COVER_MULTIPLE_TYPE);
                    $("#p_COVER_MULTIPLE").val(data2[i].MEMBERSHIP_TERM);
                    $("#p_CONTRIBUTION_INDEXATION_RATE").val(data2[i].CONTRIBUTION_INDEXATION_RATE);
                    $("#p_SA_INDEXATION_RATE").val(data2[i].SA_INDEXATION_RATE);
                    $("#p_IDENTITY_TYPE").val(data2[i].IDENTITY_TYPE);
                    $("#p_IDENTITY_NO").val(data2[i].IDENTITY_NO);
                    $("#p_NUMBER_OF_PROJECTION_YEARS").val(data2[i].NUMBER_OF_PROJECTION_YEARS + " Years");
                    $("#p_PROPOSAL_NUMBER").val(data2[i].PROPOSAL_NUMBER);
                    $("#p_SA").val("PKR " + POL_COVGE_SUMASSURD);
                    //$(".customer-name").html(this.PARTICIPANT_NAME);
                    if (sessionStorage.getItem("customer_name") == null && sessionStorage.getItem("cust_gender") == null) {
                        sessionStorage.setItem("customer_name", (data2[i][i].FULL_NAME).replace(/\s{2,}/g, ' '));
                        sessionStorage.setItem("cust_gender", data2[i].GENDER)
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 401) {
                }
            }
        });

        //$.ajax({
        //    "crossDomain": true,
        //    url: "" + Result_API + "/api/Partcipant/GetParticipantDetails/" + document_code,
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
        //    //cache: false,
        //    success: function (result) {
        //        $(result).each(function () {
        //        });
        //    },
        //    error: function (jqXHR, textStatus, errorThrown) {
        //        if (jqXHR.status === 401) {
        //        }
        //    }
        //});
        $.ajax({
            "crossDomain": true,
            url: "" + Result_API + "/api/Participant/GET_RIDER_INFO/" + document_code,
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
                    $("#RIDER_NAME").val("N/A");
                }
                else {
                    $(result).each(function () {
                        if (this.FSPM_PRODRDR_ID == '19') {
                            $("#RIDER_NAME").val("Takaful Accidental Death Benefit ")
                        }
                        if (this.FSPM_PRODRDR_ID == '20') {
                            $("#RIDER_NAME").val("Takaful Accidental Death Disability Benefit ")
                        }
                        if (this.FSPM_PRODRDR_ID == '29') {
                            $("#RIDER_NAME").val("Takaful Waiver of Contribution Benefit ")
                        }
                        if (this.FSPM_PRODRDR_ID == '30') {
                            $("#RIDER_NAME").val("Takaful Family Income Benefit ")
                        }
                        if (this.FSPM_PRODRDR_ID == '33') {
                            $("#RIDER_NAME").val("Permanent Total Disability-Accidental ")
                        }
                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 401) {
                }
            }
        });
        //illustrative table
        //9
        let next = 1;
        $.ajax({
            "async": false,
            "crossDomain": true,
            type: "GET",
            url: "" + Result_API + "/api/GET_PROILLUSTRATION/" + document_code + "/6",
            contentType: "application/json; charset=utf-8",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': Result_API,
                'Access-Control-Allow-Methods': 'POST, GET',
                'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                'Authorization': 'Bearer ' + getsession
            },
            datatype: 'jsonp',
            timeout: 2000,
            success: function (data) {
                for (let i = 0; i <= data.length - 1; i++) {
                    $("#tableillustrative tbody").append("<tr id='row_" + next + "'>" +
                        "<td>" + data[i].V_YEAR + "</td>" +
                        "<td>" + data[i].AGE + "</td>" +
                        "<td>PKR " + data[i].CONTRIBUTION + "</td>" +
                        "<td class='p-0'><div class='container-bar pb-1' style='width: " + next + "0%'><div class= 'contrib-bar'></div></div>&nbsp; &nbsp; PKR " + data[i].CUMMUL_CONTRIB + "<br></td>" +
                        "<td>PKR " + data[i].DEATH_BENEFIT + "</td>" +
                        "<td class='p-0'><div class='container-bar pb-1' style='width: " + next + "0%'><div class='cash-bar'></div></div>&nbsp; &nbsp; PKR " + data[i].SURRENDER_VALUE + "<br></td>" +
                        "</tr>");
                    next += 1;
                }
                //11
                let nextUgr11 = 1;
                $.ajax({
                    "async": false,
                    "crossDomain": true,
                    type: "GET",
                    url: "" + Result_API + "/api/GET_PROILLUSTRATION/" + document_code + "/9",
                    contentType: "application/json; charset=utf-8",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Access-Control-Allow-Origin': Result_API,
                        'Access-Control-Allow-Methods': 'POST, GET',
                        'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                        'Authorization': 'Bearer ' + getsession
                    },
                    datatype: 'jsonp',
                    timeout: 3000,
                    success: function (data2) {
                        for (let i = 0; i <= data2.length - 1; i++) {
                            let rowID2 = "#row_" + nextUgr11;
                            $(rowID2).append(
                                "<td>PKR " + data2[i].DEATH_BENEFIT + "</td>" +
                                "<td class='p-0'><div class='container-bar pb-1' style='width: " + nextUgr11 + "0%'><div class= 'cash-bar'></div></div>&nbsp; &nbsp; PKR " + data2[i].SURRENDER_VALUE + "</td>");
                            nextUgr11 += 1;
                        }
                        ////13
                        let nextUgr13 = 1;
                        $.ajax({
                            "async": false,
                            "crossDomain": true,
                            type: "GET",
                            url: "" + Result_API + "/api/GET_PROILLUSTRATION/" + document_code + "/11",
                            contentType: "application/json; charset=utf-8",
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Access-Control-Allow-Origin': Result_API,
                                'Access-Control-Allow-Methods': 'POST, GET',
                                'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                                'Authorization': 'Bearer ' + getsession
                            },
                            datatype: 'jsonp',
                            timeout: 4000,
                            success: function (data3) {
                                for (let i = 0; i <= data3.length - 1; i++) {
                                    let rowID3 = "#row_" + nextUgr13;
                                    $(rowID3).append(
                                        "<td>PKR " + data3[i].DEATH_BENEFIT + "</td>" +
                                        "<td class='p-0'><div class='container-bar pb-1' style='width: " + nextUgr13 + "0%'><div class= 'cash-bar'></div></div>&nbsp; &nbsp; PKR " + data3[i].SURRENDER_VALUE + "</td>");
                                    nextUgr13 += 1;
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                if (jqXHR.status === 401) {
                                }
                            }
                        });
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if (jqXHR.status === 401) {
                        }
                    }
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 401) {
                }
            }
        });

        $(".downloadReport").click(function () {
            let doc_code = sessionStorage.getItem("DocCODE");
            $.ajax({
                url: '/User/GetUrl/',
                type: 'GET',
                data: { Src_CODE: doc_code },
                success: function (pdfUrl) {
                    window.open(pdfUrl);
                },
                error: function (xhr, status, error) {
                    console.log('Error retrieving PDF download URL');
                }
            });
        })
        $("#btnNewQuotation").click(function () {
            window.location.href = "/Onboarding";
        })
        $("#saveIllustration").click(function () {
            //$("#AgreementModal").modal("show");
            let name = sessionStorage.getItem("customer_name");
            let AgreementInfo = '<img src="/Assets/images/investigation_magnify.png" class="notebook_image terms-cond" alt="Agreement"><br>I, <span class="customer-name">' + name + '</span>, accept, studied and understood the above Illustration and Notes carefully and found it according to my needs.<br>I also confirm that no other illustration verbal, written or electronic in contradiction to this illustration has been given to me.<br>I understand in case of any misconduct on part of the takaful operator, the SECP shall have the authority to take any action in light of the Insurance Ordinance 2000.<br/><b>Disclaimer:</b><br>The Participant can cancel the Membership within fourteen (14) days of the receipt of the Participant Membership Document (PMD) by the Participant.<br>In case of cancellation during this free look period(subject to Terms and Conditions), the paid contribution is refundable';
            Swal.fire({
                title: 'Terms & Condition',
                html: AgreementInfo,
                confirmButtonText: 'Agree',
                showCancelButton: true,
                cancelButtonText: 'Disagree',
                customClass: {
                    confirmButton: 'btnAgreeTermsCond',
                },
                allowOutsideClick: () => false
            }).then((result) => {
                if (result.isConfirmed) {
                    if (sessionStorage.getItem("User") != null) {
                        window.location.href = "/Onboarding"
                    }
                    if (sessionStorage.getItem("tokenIndex") != null && sessionStorage.getItem("tokenIndex") != "" && sessionStorage.getItem("User") == null) {
                        window.location.href = "/Onboarding"
                    }
                    if (sessionStorage.getItem("User") == null && sessionStorage.getItem("tokenIndex") == null) {
                        document.getElementById('SummaryData').submit();
                    }
                //    window.location.href = '/Onboarding';
                }
            });
        });
        //$("#btnDisAgreeTerms").click(function () {
        //    $("#AgreementModal").modal("hide");
        //})
    })
}()
$(document).ajaxStart(function () {
    $("#spinner").show();
});

$(document).ajaxStop(function () {
    $("#spinner").hide();
});
const $form = $('.form-horizontal');
$form.submit(function () {
    $("#spinner").show();
});

function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results;
}