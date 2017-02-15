<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>Bootstrap 101 Template</title>

    <!-- Bootstrap -->
    <link href="../node_modules/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body>

<div class="container">
    <div class="row">
        <form class="col-md-6 col-lg-offset-3" style="padding: 50px;">
            <div class="form-group">
                <label for="exampleInputFile">File input</label>
                <input type="file" id="exampleInputFile">
                <p class="help-block">Example block-level help text here.</p>
            </div>

            <div class="progress">
                <div class="progress-bar"
                     role="progressbar"
                     aria-valuenow="0"
                     aria-valuemin="0"
                     aria-valuemax="100"
                     style="width: 0%;">
                    0%
                </div>
            </div>

            <button type="button" class="btn btn-default btn-crypt">Crypt</button>

        </form>
    </div>
</div>

<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script src="../node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="../node_modules/crypto-js/crypto-js.js"></script>
<script src="../node_modules/crypto-js/aes.js"></script>

<script>

    // https://github.com/STRML/securesha.re-client/blob/master/jquery-spaghetti/app/crypto.js

    // Constants.
    var CHUNK_SIZE = 1024 * 1024;
    var CHUNK_DELIMITER = "/--delimiter--/";
    var FILE_SIZE_LIMIT = CHUNK_SIZE * 2000;

    // must be dynamic
    var passphrase = "Some File Pass";

    (function ($) {

        // FileSharer prototype object
        var FileSharer = function () {

        };

        FileSharer.prototype = {

            /**
             *
             * @param objFile
             * @returns {Array}
             */
            sliceFile: function (objFile) {
                objFile.slice = objFile.mozSlice || objFile.webkitSlice || objFile.slice; // compatibility
                var intPosition = 0, arrSlices = [];

                while (intPosition < objFile.size) {
                    arrSlices.push(objFile.slice(intPosition, intPosition += CHUNK_SIZE));
                }

                return arrSlices;
            },

            /**
             *
             * @param intSizeInBytes
             * @returns {string}
             */
            convertFileSize: function (intSizeInBytes) {
                var intCounter = -1,
                    arrByteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];

                do {
                    fileSizeInBytes = fileSizeInBytes / 1024;
                    intCounter++;
                } while (fileSizeInBytes > 1024);

                return Math.max(fileSizeInBytes, 0.1).toFixed(1) + arrByteUnits[intCounter];
            },

            /**
             *
             * @param arrBlobs
             * @param strPassphrase
             * @returns {string}
             */
            encrypt: function(arrBlobs, strPassphrase) {

                var arrParts = [];

                for(var intKey = 0; intKey < arrBlobs.length; intKey++) {
                    // var objFileReader = new FileReaderSync();
                    var objFileReader = new FileReader(),
                        objData = objFileReader.readAsBinaryString(arrBlobs[intKey]),
                        objEncrypted = CryptoJS.AES
                        .encrypt(objData, strPassphrase)
                        .toString();
                    // .toString(Latin1Formatter);

                    arrParts.push(objEncrypted);
                }

                return arrParts.join(CHUNK_DELIMITER);
            },

        };

        FileSharer = new FileSharer();
        if (!('FileSharer' in this)) this['FileSharer'] = FileSharer;

    }).call(this, window.jQuery);

    var strFileName;
    var strEncryptedFile;
    var strFileContentType;

    $('input[type="file"]').on('change', function (e) {

        var objFile = e.target.files[0];

        if(objFile.size > FILE_SIZE_LIMIT) {
            return alert(
                "File is too big. Please choose a file under " +
                FileSharer.convertFileSize(FILE_SIZE_LIMIT)
                +"MB."
            );
        }

        strFileName = objFile.name;
        strFileContentType = objFile.type;
        strEncryptedFile = FileSharer.encrypt(
            FileSharer.sliceFile(e.target.files[0]),
            passphrase // must be dynamic
        );

    });

    $('.btn-crypt').on('click', function(e){

        $.ajax({
            url: 'upload.php',
            type: 'POST',
            //xhr: function() { // custom xhr
            //    var myXhr = $.ajaxSettings.xhr();
            //    if(myXhr.upload) { // check if upload property exists
            //        myXhr.upload.addEventListener('progress', progressHandler, false); // for handling the progress of the upload
            //    }
            //    return myXhr;
            //},
            contentType: 'text/plain',
            // success: successHandler,
            // error: errorHandler,

            // Form data
            headers: {
                // 'X-File-Expiration-Days' : 10,
                // 'X-File-Max-Views': 15,
                'X-File-Content-Type': strFileContentType,
                'X-File-Name': strFileName
            },
            data: strEncryptedFile,
            processData: false,
            cache: false
        });
    });

</script>
</body>
</html>