<?php

declare(strict_types=1);

require_once __DIR__ . '/Router.php';

// Controllers
require_once __DIR__ . '/../controllers/GalleryApiController.php';

// You can include other controllers as you add them…

$router = new Router(
    basePath: '' // If app is deployed under a subdirectory, set it here (e.g., '/sites/production/davidschu_new/public')
);

// Home page (render your existing homepage view)
$router->get('/', function () {
    // If you currently use a public/index.php markup, you can include a template here:
    require __DIR__ . '/../includes/header.php';
    // your homepage content or a dedicated view file
    require __DIR__ . '/../includes/footer.php';
});

// Optional: pretty routes for your existing pages
$router->get('/about', function () {
    require __DIR__ . '/../../public/about.php';
});
$router->get('/galleries', function () {
    require __DIR__ . '/../../public/galleries.php';
});
$router->get('/gallery/{slug}', function ($slug) {
    // You can keep using public/gallery.php or move to a controller
    $_GET['slug'] = $slug; // if your page expects it
    require __DIR__ . '/../../public/gallery.php';
});

// API endpoint (uses your controller + models + PDO)
$router->get('/api/gallery-images', function () {
    // Bootstrap config/DB
    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../config/database.php'; // should create $pdo

    $controller = new GalleryApiController($pdo);
    $controller->images(); // echoes JSON + headers
});

// 404 fallback
$router->notFound(function () {
    http_response_code(404);
    require __DIR__ . '/../includes/header.php';
    echo "<main style='padding:2rem'><h1>404</h1><p>Page not found.</p></main>";
    require __DIR__ . '/../includes/footer.php';
});

return $router;
