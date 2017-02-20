$(function () {

    var body = $('body'),
        stage = $('#stage'),
        back = $('a.back');

    /* Step 1 */

    $('#step1 .encrypt').click(function () {
        body.attr('class', 'encrypt');

        // Go to step 2
        step(2);
    });

    $('#step1 .decrypt').click(function () {
        body.attr('class', 'decrypt');
        step(2);
    });


    /* Step 2 */
    $('#step2 .button').click(function () {
        // Trigger the file browser dialog
        $(this).parent().find('input').click();
    });

    // Set up events for the file inputs

    var objFileCrypt = null;

    // $('#encrypt-input').filecrypt({
    //     autoSync: true
    // });

    $('#step2').on('change', '#encrypt-input', function (e) {

        // Has a file been selected?

        // if (e.target.files.length != 1) {
        //     alert('Please select a file to encrypt!');
        //     return false;
        // }
        //
        // file = e.target.files[0];
        //
        // if (file.size > 1024 * 1024) {
        //     alert('Please choose files smaller than 1mb, otherwise you may crash your browser. \nThis is a known issue. See the tutorial.');
        //     return;
        // }

        objFileCrypt = new FileCrypt({
            file: e.target.files[0],
            // passphrase: password,
            // delimiter: delimiter,
            // listeners: {
            //     crypting: function (objOptions) {
            //         progressBar(objOptions.process);
            //     }
            // }
        });

        step(3);
    });

    // $('#step2').on('change', '#decrypt-input', function (e) {
    //
    //     if (e.target.files.length != 1) {
    //         alert('Please select a file to decrypt!');
    //         return false;
    //     }
    //
    //     file = e.target.files[0];
    //     step(3);
    // });

    var objFileDecrypt = null;

    $('.btn-decrypt').on('click', function(e){
        e.preventDefault();

        objFileDecrypt = new FileDecrypt({
            url: 'http://filecrypt.tut/download.php?f=' + $(e.target).attr('data-filename'),
            listeners: {
                downloaded: function() {
                    step(5);
                }
            }
        });
    });

    /* Step 3 */
    $('a.button.process').click(function () {

        var input = $(this).parent().find('input[type=password]'),
            a = $('#step4 a.download'),
            password = input.val();

        input.val('');

        if (password.length < 5) {
            alert('Please choose a longer password!');
            return;
        }

        objFileCrypt.setPassphrase(password);
        objFileCrypt.encrypting({
            crypting: function(objOptions) {
                console.log('in proccess' + objOptions.process);
            },
            crypted: function() {
                objFileCrypt.save({
                    url: 'upload.php',
                    success: function() {
                        $('.btn-decrypt').attr('data-filename', objFileCrypt.getFileName());
                        step(4);
                    }
                });
            }
        });

    });

    $('a.button.decrypting').click(function () {

        var input = $(this).parent().find('input[type=password]'),
            password = input.val();

        input.val('');

        objFileDecrypt.setPassphrase(password);
        objFileDecrypt.decrypting({
            decripted: function(e) {
                $('.btn-download-decript-file').attr(
                    'href', e.target.result
                );
                $('.btn-download-decript-file').attr('download', objFileDecrypt.getFileName());
            }
        });

    });


    /* The back button */


    back.click(function () {

        // Reinitialize the hidden file inputs,
        // so that they don't hold the selection
        // from last time

        $('#step2 input[type=file]').replaceWith(function () {
            return $(this).clone();
        });

        step(1);
    });


    // Helper function that moves the viewport to the correct step div

    function step(i) {

        if (i == 1) {
            back.fadeOut();
        }
        else {
            back.fadeIn();
        }

        // Move the #stage div. Changing the top property will trigger
        // a css transition on the element. i-1 because we want the
        // steps to start from 1:

        stage.css('top', (-(i - 1) * 100) + '%');
    }

});