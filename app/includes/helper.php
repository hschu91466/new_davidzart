<?php
// Turn on error reporting locally (remove in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Derive base URL dynamically (works for :81 and subfolders)
$scheme   = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host     = $_SERVER['HTTP_HOST']; // includes :81
$subdir   = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\'); // e.g., /sites/site_backups/davidschu_new/public
$BASE_URL = $scheme . '://' . $host . $subdir;

function getBaseURL() {
    global $BASE_URL;
    return $BASE_URL;
}