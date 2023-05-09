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
                    $("#SUM_SYS_USER_ID").val(this.SUM_SYS_USER_ID);
                    $(".SUM_FULL_NAME").html(this.SUM_FULL_NAME);
                    $("#SUM_FULL_NAME").val(this.SUM_FULL_NAME);
                    $("#SUM_CUST_CONTPHONE").val(this.SUM_CUST_CONTPHONE);
                    $("#cnic").html(thisCustCNIC);
                    $("#status").html("Active")
                    $(".SUM_USER_EMAIL_ADDR").html(this.SUM_USER_EMAIL_ADDR)
                })
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 401) {
                }
            }
        });
    })
}()