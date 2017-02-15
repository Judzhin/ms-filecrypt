<?php

/** @var string $filename */
$filename = "./uploads/{$_POST['name']}.part{$_POST['part']}.tmp";
file_put_contents($filename, $_POST['data']);

echo json_encode([
    'success' => true
]);