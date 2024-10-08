
function login() {
    const username = $('#username').val();
    const password = $('#password').val();
    $('#login_text').hide();
    $('#login_load').show();

    const data = JSON.stringify({
        'uname': username,  // Keep 'uname'
        'passw': password   // Keep 'passw'
    });

    setTimeout(() => {
        $.ajax({
            type: "POST",
            url: "/post_login",
            data: data,
            dataType: "json",
            contentType: 'application/json',
            success: function (response) {
                const data = response.status

                if (data == "success"){
                    $('#login_text').show();
                    $('#login_load').hide();
                    window.location.href = '/FODCam-cctv'
                }else{
                    $('#login_text').show();
                    $('#login_load').hide();
                    $('#validation_login').show()
                }
            }
        });
    }, 2000);
}
