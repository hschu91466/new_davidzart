<?php
include_once __DIR__ . '/helper.php';
$BASE_URL = getBaseURL();
?>

<!doctype html>
<html lang="en">

<head>
    <!-- Basic Page Needs -->
    <meta charset="utf-8" />
    <title>David Schu | Fine Art</title>
    <meta name="description" content="Portfolio" />
    <meta name="author" content="Holly Schu" />

    <!-- Mobile Specific Metas -->
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <!-- Google Fonts (load once) -->
    <link href="https://fonts.googleapis.com/css?family=Abel&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css?family=Permanent+Marker&display=swap" rel="stylesheet" />

    <!-- Bootstrap 5 CSS (one version only) -->
    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
        crossorigin="anonymous" />
    <!-- Splide CSS  -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4/dist/css/splide.min.css">

    <!-- Magnific Popup CSS -->
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/magnific-popup.min.css"
        crossorigin="anonymous"
        referrerpolicy="no-referrer" />

    <!-- Your mobile-first, variable-driven styles (load last so you can override vendors) -->
    <link rel="stylesheet" href="<?= $BASE_URL ?>/assets/css/style.css" />

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="<?= $BASE_URL ?>/assets/images/favicon.png" />
</head>

<body>