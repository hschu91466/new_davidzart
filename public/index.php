<?php
// public/index.php
declare(strict_types=1);

require_once dirname(__DIR__) . '/app/config/bootstrap.php';

require_once __DIR__ . '/../app/includes/header.php';
require_once __DIR__ . '/../app/includes/nav.php';
?>

<main class="main container">
    <section class="section text-center">
        <h2>Welcome</h2>

        <div class="splide" id="randomGallery" aria-label="Homepage Image Gallery">
            <div class="splide__track">
                <ul class="splide__list" id="galleryList"></ul>
            </div>
        </div>

        <p class="mt-4">
            Explore my collection of fine art and photography. Each image is a unique expression of creativity and emotion. Click on any photo to view it in full size and discover the story behind it.
        </p>
    </section>
</main>

<?php
require_once __DIR__ . '/../app/includes/footer.php';
