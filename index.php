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
            <button type="button" class="btn btn-default btn-decrypt">Decrypt</button>

        </form>
    </div>
</div>

<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script src="node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="node_modules/crypto-js/crypto-js.js"></script>

<script src="js/filecrypt.util.js"></script>
<script src="js/filecrypt.workercollection.js"></script>
<script src="js/filecrypt.partcollection.js"></script>
<script src="js/filecrypt.js"></script>

<script>

    // https://github.com/STRML/securesha.re-client/blob/master/jquery-spaghetti/app/crypto.js

    // Constants.
    var CHUNK_SIZE = 1024 * 1024;
    var CHUNK_DELIMITER = "/--delimiter--/";
    var FILE_SIZE_LIMIT = CHUNK_SIZE * 2000;

    var strFileName;
    var strEncryptedFile;
    var strFileContentType;

    var objFileCrypt;

    $('input[type="file"]').on('change', function (e) {

        var objFile = e.target.files[0];

        if (objFile.size > FILE_SIZE_LIMIT) {
            return alert(
                "File is too big. Please choose a file under " +
                FileSharer.convertFileSize(FILE_SIZE_LIMIT)
                + "MB."
            );
        }

        //objFileCrypt = new FileCrypt({
        //    file: e.target.files[0],
        //    password: 'Some Password',
        //    delimiter: '/--delimiter--/'
        //});

        objFileCrypt = FileCrypt.factory(
            e.target.files[0],
            'Some Password'
        );

        // debugger;

//        strFileName = objFile.name;
//        strFileContentType = objFile.type;
//        strEncryptedFile = FileSharer.encrypt(
//            FileSharer.sliceFile(e.target.files[0]),
//            passphrase // must be dynamic
//        );

    });

    $('.btn-crypt').on('click', function (e) {

        debugger;

        objFileCrypt.save({
            url: 'upload.php'
        });

//        $.ajax({
//            url: 'upload.php',
//            type: 'POST',
//            //xhr: function() { // custom xhr
//            //    var myXhr = $.ajaxSettings.xhr();
//            //    if(myXhr.upload) { // check if upload property exists
//            //        myXhr.upload.addEventListener('progress', progressHandler, false); // for handling the progress of the upload
//            //    }
//            //    return myXhr;
//            //},
//            contentType: 'text/plain',
//            // success: successHandler,
//            // error: errorHandler,
//
//            // Form data
//            headers: {
//                // 'X-File-Expiration-Days' : 10,
//                // 'X-File-Max-Views': 15,
//                'X-File-Content-Type': strFileContentType,
//                'X-File-Name': strFileName
//            },
//            data: strEncryptedFile,
//            processData: false,
//            cache: false
//        });
    });

    $('.btn-decrypt').on('click', function (e) {
        // alert('decrypt');

        debugger;

        // FileCrypt.load('http://filecrypt.tut/securesha/dump.sql');

    });

</script>
</body>
</html>