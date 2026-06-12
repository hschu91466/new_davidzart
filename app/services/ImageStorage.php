<?php

declare(strict_types=1);

use Aws\S3\S3Client;

function getR2Client(): S3Client
{
    return new S3Client([
        'region' => 'auto',
        'version' => 'latest',

        'endpoint' => $_ENV['ENDPOINT'],

        'credentials' => [
            // ✅ THESE ARE STRINGS — not $_ENV
            'key'    => $_ENV['KEY'],
            'secret' => $_ENV['SECRET'],
        ],
    ]);
}

function uploadToR2(string $tmpFile, string $path): bool
{
    $client = getR2Client();
    $bucket = 'sites';

    try {
        $client->putObject([
            'Bucket' => $bucket,
            'Key' => $path,
            'SourceFile' => $tmpFile,
            'ACL' => 'public-read',
        ]);

        return true;
    } catch (Exception $e) {
        error_log("R2 Upload Error: " . $e->getMessage());
        return false;
    }
}
