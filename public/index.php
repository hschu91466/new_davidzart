<?php
// public/index.php
declare(strict_types=1);


require_once dirname(__DIR__) . '/app/config/bootstrap.php';
ensure_base_url_global(); // sets $BASE_URL based on /public root


// These must be set BEFORE including header.php
$page_title = 'Home';
$PAGE_SLUG  = 'home';
$pageId = 'home'; // Used by header.php to target this page from js and CSS
require_once __DIR__ . '/../app/includes/header.php';
require_once __DIR__ . '/../app/includes/nav.php';
?>

<main class="main container flow">
    <section class="section text-center">
        <h1 class="h1">Welcome</h1>
        <div class="splide"
            id="randomGallery"
            aria-label="Homepage Image Gallery"
            data-endpoint="<?= base_url('api/gallery-images.php?limit=15&random=1&lightbox=large') ?>">
            <div class="splide__track">
                <ul class="splide__list" id="galleryList"></ul>
            </div>
        </div>

        <p>
            Explore my collection of fine art and photography. Each image is a unique expression of creativity and emotion. Click on any photo to view it in full size and discover the story behind it.
        </p>
    </section>
</main>

<?php
require_once __DIR__ . '/../app/includes/footer.php';
