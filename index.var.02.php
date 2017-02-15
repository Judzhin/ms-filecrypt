<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>Bootstrap 101 Template</title>

    <!-- Bootstrap -->
    <link href="node_modules/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">

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
                <a class="help-block" href="#">Download</a>
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
<script src="node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="node_modules/crypto-js/crypto-js.js"></script>
<script src="node_modules/crypto-js/aes.js"></script>

<script>

    var objFile;

    $('input[type="file"]').on('change', function (e) {
        objFile = e.target.files[0];
    });

    $('.btn-crypt').on('click', function () {

        var objReader = new FileReader();

        /**
         *
         * @param e
         */
        objReader.onload = function (e) {

            var arrChuncks = e.target.result.match(/.{1,1048576}/g);

            for(var i = 0; i < arrChuncks.length; ++i) {

                var objPart = CryptoJS.AES.encrypt(
                    arrChuncks[i], "Test Pass"
                );

                var objFormData = new FormData();
                objFormData.append('name', objFile.name);
                objFormData.append('data', objPart.toString());
                objFormData.append('part', i);

                $.ajax({
                    type: 'POST',
                    url: '/upload.var.02.php',
                    data: objFormData,
                    dataType: "json",
                    processData: false,
                    contentType: false,
                    success: function (data) {
                    }
                });
            }

            // var strEncrypted = CryptoJS.AES.encrypt(e.target.result, "Test Pass");
            // $objA.attr('href', 'data:application/octet-stream,' + strEncrypted);
            // $objA.attr('download', objFile.name + '.encrypted');
        };

        objReader.readAsDataURL(objFile);

    });

</script>
</body>
</html>