<?php

declare(strict_types=1);

header('Content-Type: application/json');

// TEMP: suppress warnings breaking JSON

ini_set('display_errors', 1);
error_reporting(E_ALL);

$ROOT = dirname(__DIR__);

require_once dirname(__DIR__) . '/app/config/bootstrap.php';


$galleries = [];
try {
    // Prefer only galleries that currently have images:
    $galleries = GalleryModel::getActiveWithImages($pdo);
    // If you want all active galleries instead, switch to:
    // $galleries = GalleryModel::getActive($pdo);
    $coverUrl = $galleries[0]['cover_url'] ?? null;
    $orient = $galleries[0]['orientation'] ?? null;
} catch (Throwable $e) {
    $galleries = [];
}
// Detect API request (via proxy path)
// if (isset($_GET['format']) && $_GET['format'] === 'json') {
//     header('Content-Type: application/json');

//     echo json_encode([
//         "galleries" => $galleries
//     ]);

//     exit;
// }

if (isset($_GET['format']) && $_GET['format'] === 'json') {
    header('Content-Type: application/json');

    $slug = $_GET['slug'] ?? null;

    // ✅ CASE 1: return gallery list (no slug)
    if (!$slug) {
        echo json_encode([
            "galleries" => $galleries
        ]);
        exit;
    }

    // ✅ CASE 2: return one gallery + images
    $gallery = GalleryModel::getBySlug($pdo, $slug);
    $images = GalleryModel::getImagesBySlug($pdo, $slug);

    echo json_encode([
        "gallery" => $gallery,
        "images" => $images
    ]);

    exit;
}

require_once $ROOT . '/../app/includes/header.php';
require_once $ROOT . '/../app/includes/nav.php';
?>
<main class="py-4">
    <div class="container">
        <header class="mb-4">
            <h3 class="section-label">Galleries</h3>
            <p class="text-muted mb-0">Browse all available galleries.</p>
        </header>
        <?php if (!empty($galleries)): ?>
            <div class="row g-3">
                <?php foreach ($galleries as $g): ?>
                    <?php
                    $slug = trim((string)($g['slug'] ?? ''));
                    $title = trim((string)($g['title'] ?? ''));
                    if ($slug === '') continue;
                    // $href = $BASE_URL . '/gallery.php?slug=' . rawurlencode($slug);
                    $href = '/galleries/' . rawurlencode($slug);
                    $label = $title !== '' ? $title : $slug;
                    $coverUrl = $g['cover_url'] ?? null;
                    if ($coverUrl === null || trim($coverUrl) === '') {
                        $coverUrl = $BASE_URL . '/assets/images/placeholder.png';
                    }
                    ?>
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                        <div class="card h-100 shadow-sm">
                            <!-- Optional: Add a cover image here if you have a URL -->
                            <img src="<?= h(img_src($coverUrl ?? '', true)) ?>" class="card-img-top <?= h($orient) ?>" alt="">
                            <div class="card-body d-flex flex-column">
                                <h2 class="h6 card-title mb-2"><?= h($label) ?></h2>
                                <div class="mt-auto">
                                    <a class="stretched-link btn btn-outline-primary btn-sm"
                                        href="<?= h($href) ?>">
                                        View gallery
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php else: ?>
            <div class="alert alert-info mb-0">No galleries available yet. Please check back soon.</div>
        <?php endif; ?>
    </div>
</main>
<?php require_once $ROOT . '/../app/includes/footer.php'; ?>