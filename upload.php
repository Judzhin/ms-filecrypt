<?php

ini_set('always_populate_raw_post_data', -1);

/**
 * Return the raw body of the request
 *
 * @return string|false Raw body, or false if not present
 */
function _getRawBody()
{
    $body = file_get_contents('php://input');
    if (strlen(trim($body)) == 0 && isset($GLOBALS['HTTP_RAW_POST_DATA'])) {
        $body = $GLOBALS['HTTP_RAW_POST_DATA'];
    }
    if (strlen(trim($body)) > 0) {
        return $body;
    }
    return false;
}

if (isset ($GLOBALS["HTTP_RAW_POST_DATA"])) {
    //the image file name

    /** @var string $strFileName */
    $strFileName = $_SERVER['HTTP_X_FILE_NAME'];

    // get the binary stream
    $strSteam = _getRawBody();

    //write it
    $fp = fopen("./uploads/{$strFileName}.bin", 'wb');
    fwrite($fp, $strSteam);
    fclose($fp);

    $fm = fopen("./uploads/{$strFileName}.json", 'wb');
    fwrite($fm, json_encode([
        'X-File-Content-Length' => $_SERVER['HTTP_X_FILE_CONTENT_LENGTH'],
        'X-File-Name' => $_SERVER['HTTP_X_FILE_NAME'],
        'X-File-Content-Type' => $_SERVER['HTTP_X_FILE_CONTENT_TYPE']
    ]));
    fclose($fm);
}