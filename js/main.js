$(document).ready(function() {
    var $name = $('#inputName');
    var $email = $('#inputEmail');
    var $message = $('#inputMessage');
    var $form = $('#form');
    var $elem;

    function validateEmail(email) { 
        var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    } 

    function fadeIn() {
        $elem.hide();
        $form.append($elem);
        $elem.fadeIn();
    }
    

    function clearResponse() {
        if ($elem) {
            $elem.remove();
        }
    }


    function submit() {
        var name = $name.val(), email = $email.val(), message = $message.val();

        clearResponse();
        
        if (message === "") {
            $elem = $('<div id="error">Ange ett meddelande!</div>');
            fadeIn();

        } else if (name === "") {
            $elem = $('<div id="error">Ange ett namn</div>');
            fadeIn();
        }
        else if (!validateEmail(email)) {
            clearResponse();
            $elem = $('<div id="error">Ange en giltig epostadress</div>');
            fadeIn();
        } else {

            $.post('send.php', {
                name: name,
                email: email,
                message: message
            }, function(response) {
                $elem = $(response);
                fadeIn();
                $name.val("");
                $email.val("");
                $message.val("");
                
            });
        }
    };
    
    $('#inputSubmit').click(function(event) {
        submit();
        event.preventDefault();
        event.stopPropagation();
        return false;
    });               

    $name.keyup(clearResponse);
    $email.keyup(clearResponse);
    $message.keyup(clearResponse);

});
