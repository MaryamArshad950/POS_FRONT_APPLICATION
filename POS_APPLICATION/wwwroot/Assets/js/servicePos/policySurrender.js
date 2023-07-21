!function () {
    $(document).ready(function () {
        $("#successRequest").modal("show");
        let thisCustCNIC = sessionStorage.getItem("cnic.");
        if (thisCustCNIC == null) {
            window.location.href = "/";
            localStorage.clear();
            sessionStorage.clear();
        } else {
            if (sessionStorage.getItem("successFreelook") != '') {
                Swal.fire({
                    text: 'Your Request has been received.',
                    icon: 'success'
                }).then((result) => {
                    if (result.isConfirmed) {
                        PolicyNumberSelection();
                        $(".change-policy-num").click(function () {
                            PolicyNumberSelection();
                        })
                    }
                });
            }
            else {
                PolicyNumberSelection();
                $(".change-policy-num").click(function () {
                    PolicyNumberSelection();
                })
            }
        }
    })
}()