$(function () {

    var body = $('body'),
        stage = $('#stage'),
        back = $('a.back'),
        delimiter = '/--delimiter--/';

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
    var file = null;

    $('#step2').on('change', '#encrypt-input', function (e) {

        // Has a file been selected?

        if (e.target.files.length != 1) {
            alert('Please select a file to encrypt!');
            return false;
        }

        file = e.target.files[0];

        if (file.size > 1024 * 1024 * 50) {
            alert('Please choose files smaller than 50mb, otherwise you may crash your browser. \nThis is a known issue. See the tutorial.');
            return;
        }

        step(3);
    });

    $('#step2').on('change', '#decrypt-input', function (e) {

        if (e.target.files.length != 1) {
            alert('Please select a file to decrypt!');
            return false;
        }

        file = e.target.files[0];
        step(3);
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

        if (body.hasClass('encrypt')) {

            // Encrypt the file!

            var worker = new Worker('worker.js');

            worker.postMessage({
                op: 'encrypt',
                file: file,
                password: password,
                delimiter: delimiter
            });

            worker.onmessage = function (msg) {
                if (msg.data.progress == 'complete') { // completed
                    worker.terminate();
                    saveAs(msg.data.ciphertext, file.name + '.encrypted'); // save to file
                    step(4);
                }
            };
        }
        else {

            // Decrypt it!

            var worker = new Worker('worker.js');

            worker.postMessage({
                op: 'decrypt',
                file: file,
                password: password,
                delimiter: delimiter
            });

            worker.onmessage = function (msg) {
                if (msg.data.progress == 'complete') { // completed
                    saveAs(msg.data.plaintext, file.name.replace(/\.encrypted$/, '')); // save to file
                    step(4);
                } else if (msg.data.progress == 'failure') {
                    alert('You have entered an incorrect password');
                }
            };
        }
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