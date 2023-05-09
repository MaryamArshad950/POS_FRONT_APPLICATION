!function () {
    $("#spinner").hide();
    $("#btnUserLogin").click(function () {
        if ($("#SUM_SYS_USER_CODE").val() != "" && $("#SUM_USER_PASSWORD").val() != "") {
            sessionStorage.setItem("cnic.", $("#SUM_SYS_USER_CODE").val());
            sessionStorage.getItem("cnic.");
        }
    })
    setTimeout(function () {
        $(".validation-alert").fadeTo(500, 0).slideUp(500, function () {
            $(this).remove();
        });
    }, 4000);
    $("#createAcc").click(function () {
        //sessionStorage.clear();
        localStorage.clear();
    })
    $("#settings-trigger").attr("hidden", true);
    $(".sign_out").click(function () {
        window.location.href = "/";
        sessionStorage.clear();
        localStorage.clear();
    })
}();

$('.form-horizontal').submit(function () {
    $("#spinner").show();
});
function togglePasswordVisibility() {
    var passwordInput = document.getElementById("SUM_USER_PASSWORD");
    var icon = document.querySelector(".password-toggle i");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}

function readURLFront(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#imageResultFront')
                    .attr('src', e.target.result);
                $('#imageResultFront')
                    .addClass('w-50');
            };
            reader.readAsDataURL(input.files[0]);
        }
}
function readURLBack(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imageResultBack')
                .attr('src', e.target.result);
            $('#imageResultBack')
                .addClass('w-50');
        };
        reader.readAsDataURL(input.files[0]);
    }
}
function readURLPrsnl(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imageResultPrsnl')
                .attr('src', e.target.result);
            $('#imageResultPrsnl')
                .addClass('w-50');
        };
        reader.readAsDataURL(input.files[0]);
    }
}
function openGuardianInfo(Val) {    
    if (Val < 18) {
        $("#guardian_infoRow").removeAttr("hidden", true);
        //$("#guardian_name").attr("required",true);
        //$("#guardian_cnic").attr("required", true);
        //$("#guardian_age").attr("required", true);
    }
    else {
        $("#guardian_infoRow").attr("hidden", true);
        $("#guardian_name").val("");
        $("#guardian_cnic").val("");
        $("#guardian_age").val("");
    }
}