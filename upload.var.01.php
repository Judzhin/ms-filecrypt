<?php

/** @var array $data */
$data = $_POST;

/** @var mixed $file */
$file = $_FILES['data'];

if ($file && 0 == $file['error']) {

    /** @var string $file */
    $file = $file['tmp_name'];

    /** @var string $path */
    $path = "./uploads/{$data['name']}";

    if (!$data['part']) {
        copy($file, $path);
    } else {
        /** @var string $tmp */
        $tmp = $path . ".{$data['part']}.tmp";
        copy($file, $tmp);

        /** @var string $content */
        $content = file_get_contents($tmp);
        file_put_contents($path, $content, FILE_APPEND);

        unlink($tmp);

        echo json_encode([
            'success' => true
        ], JSON_UNESCAPED_UNICODE);
    }
    exit;
}