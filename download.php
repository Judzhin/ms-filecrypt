<?php
/** @var string $file */
$file = "./uploads/{$_GET['f']}.bin";

/** @var array $meta */
$meta = json_decode(
    file_get_contents("./uploads/{$_GET['f']}.json"), true
);

if (file_exists($file)) {
    header("X-File-Content-Length: {$meta['X-File-Content-Length']}");
    header("X-File-Content-Type: {$meta['X-File-Content-Type']}");
    header("X-File-Name: {$meta['X-File-Name']}");
    header('Content-Disposition: attachment; filename="' . $meta['X-File-Name'] . '"');

    header('Expires: 0');
    header('Content-Type: application/octet-stream');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    readfile($file);
    exit;
}