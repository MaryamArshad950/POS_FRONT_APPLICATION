!function () {
    $(document).ready(function () {
        let cnic = sessionStorage.getItem("cnic.");
        $.ajax({
            //"async": false,
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
                for (let i = 0; i < result.length; i++) {
                    let frontPath = result[i].FPDD_PATH;
                    let changePath = frontPath.split("\\").pop();
                    let img_front = "/upload/" + changePath;
                    $('#document' + (i + 1)).attr("src", img_front);
                    $('#document' + (i + 1)).addClass('w-50 h-50')
                    $('#document' + (i + 1)).val(changePath);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 401) {
                }
            }
        });
    });
}()