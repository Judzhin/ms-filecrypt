<?php

/** @var array $data */
$data = $_POST;

/** @var mixed $file */
$file = $_FILES['objFile'];

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
    }


    // file_put_contents($path . '_complete', ' ');

//    self::savePartition($objFile, $current_index, $session_id, $upload_id);
//    self::checkReady($session_id, $upload_id, $cnt_all);
//    header('Content-type: application/json; charset=utf-8');
////    echo json_encode([
////        'result'         => 'partition',
////        'session_id'     => $session_id,
////        'upload_id'      => $upload_id,
////        'cnt_partitions' => $cnt_all
////    ], JSON_UNESCAPED_UNICODE);
    exit;
}