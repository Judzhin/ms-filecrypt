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
                <p class="help-block">Example block-level help text here.</p>
            </div>

            <div class="progress">
                <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">
                    0%
                </div>
            </div>

        </form>
    </div>
</div>

<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script src="node_modules/bootstrap/dist/js/bootstrap.min.js"></script>

<script>
    $('input[type="file"]').on('change', function (e) {

        var objFile = e.target.files[0],
            intPartSize = 1024 * 1024,
            intCountParts = Math.ceil(objFile.size / intPartSize);

        for(var intPart = 0; intPart < intCountParts; intPart++) {

            var objBlob = objFile.slice(
                intPart * intPartSize,
                (intPart + 1) * intPartSize
            );

            var objFormData = new FormData();
            objFormData.append('objFile', objBlob);
            objFormData.append('part', intPart);
            objFormData.append('name', objFile.name);

            $.ajax({
                type: 'POST',
                url: '/upload.php',
                data: objFormData,
                dataType: "json",
                processData: false,
                contentType: false,
                success: function (data) {

                }
            });
        }

        // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data#Sending_binary_data
        // var blob = file.slice(start,end)

//        var limitSize = 1024 * 1024; // 1mb
//
//        if (file.size > limitSize) {
//            alert('Please choose files smaller than 1mb, otherwise you may crash your browser. \nThis is a known issue. See the tutorial.');
//            return;
//        }
    });
</script>
</body>
</html>