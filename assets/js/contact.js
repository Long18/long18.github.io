function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

$("#contactForm").on("submit", function(event) {
    event.preventDefault();

    var formData = {
        name: $("#contactForm [name=name]").val(),
        email: $("#contactForm [name=email]").val(),
        subject: $("#contactForm [name=subject]").val(),
        message: $("#contactForm [name=comments]").val(),
    
    };

    console.log(formData)

    var valid = true;
    if (!formData.name) {
        $("#contactForm [name=name]").focus();
        valid = false;
    }

    if (!(formData.email && validateEmail(formData.email))) {
        $("#contactForm [name=email]").focus();
        valid = false;
    }

    if (!formData.message) {
        $("#contactForm [name=comments]").focus();
        valid = false;
    }

    if (valid == false) {
        return;
    }

    console.log(formData)
    sendEmail(formData.name, formData.email ,formData.subject,formData.message);

    $("#contactForm [type=submit]").text("Sending..");
    $.ajax({
        type: $("#contactForm").attr("method"),
        // define the type of HTTP verb we want to use (POST for our form)
        url: $("#contactForm").attr("action"),
        // the url where we want to POST
        data: formData,
        // our data object
    }).done(function(data) {
        $("#contactForm")[0].reset();
        $("#contactForm [type=submit]").text(data);
        setTimeout(function() {
            $("#contactForm [type=submit]").text("Send");
        }, 4000);
    });

    
});

function sendEmail(name, email, subject, message) {
    Email.send({
        Host:"smtp.gmail.com",
        Username: "us.thanhlong18@gmail.com",
        Password: "kblsmjnkxceczpxv",
        To: "us.thanhlong18@gmail.com",
        From: `${email}`,
        Subject: `${subject}`,
        Body: `Name: ${name}, <br/> Email: ${email}, <br/> Message: ${message}`

    }).then($("#contactForm [type=submit]").text("Send")).then((message) => alert("Your email has been sent. But I can receive it. Please contect me as my email is not secure."));
}
//end form submit handler
