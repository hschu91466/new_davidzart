<?php

declare(strict_types=1);

require_once __DIR__ . '/helper.php';
ensure_base_url_global();

$page_title = $page_title ?? 'David Schu – Fine Art';
$PAGE_SLUG  = $PAGE_SLUG  ?? 'default';

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <!-- Basic Page Needs -->
    <meta charset="utf-8" />
    <title><?= h($page_title) ?></title>
    <meta name="description" content="Portfolio" />
    <meta name="author" content="Holly Schu" />

    <!-- Mobile Specific Metas -->
    <meta name="viewport" content="width=device-width, initial-scale=1" />


    <!-- 1) Expose the base URL for front-end code -->

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

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="<?= h(base_url('assets/images/favicon.png')) ?>"
        </head>

<body data-page="<?= h($PAGE_SLUG) ?>">
    <!--[if lt IE 8]>
        <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="https://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->