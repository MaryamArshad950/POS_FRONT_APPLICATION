!function () {
    $(document).ready(function () {
        let thisCustCNIC = sessionStorage.getItem("cnic.");
        if (thisCustCNIC == null) {
            window.location.href = "/";
            localStorage.clear();
            sessionStorage.clear();
        }
        else {
            $("#successRequest").modal("show");
            $.ajax({
                "crossDomain": true,
                url: "" + Result_API + "/api/PosUser/GetUserByUserCd/" + thisCustCNIC,
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
            $(".closeRequestSuccess").click(function () {
                sessionStorage.removeItem("code");
                $("#successRequest").modal("hide");
            })
        }
    })
}()
function enableMedDtls() {
    $(".claimStatus").attr("required", true);
}