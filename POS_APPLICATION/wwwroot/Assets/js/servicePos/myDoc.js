!function () {
    $(document).ready(function () {
        let cnic = sessionStorage.getItem("cnic.");
        if (cnic == null) {
            window.location.href = "/";
            localStorage.clear();
            sessionStorage.clear();
        } else {
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
                    $.each(result, function (index, value) {
                        let frontPath = value.fpdD_PATH;
                        console.log(frontPath)
                        let img_front = "/upload/" + frontPath;
                        $('#document' + (index + 1)).attr("src", img_front);
                        $('#document' + (index + 1)).addClass('w-50 h-50')
                        $('#document' + (index + 1)).val(frontPath);
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 401) {
                    }
                }
            });
        }
    });
}()