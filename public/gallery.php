<?php

declare(strict_types=1);

$ROOT = dirname(__DIR__);

// 1) Load DB first if nav uses it
require_once $ROOT . '/app/config/database.php';

// 2) Load models
require_once $ROOT . '/app/models/GalleryModel.php';
require_once $ROOT . '/app/models/ImageModel.php';

// 3) Read slug
$slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';
if ($slug === '') {
    http_response_code(404);
    require_once __DIR__ . '/../app/includes/header.php';
    require_once __DIR__ . '/../app/includes/nav.php';
    echo "<main class='container py-5'><h2>Gallery not found</h2></main>";
    require_once __DIR__ . '/../app/includes/footer.php';
    exit;
}

// 4) Fetch gallery
$gStmt = $pdo->prepare("
    SELECT gallery_id, title, description
    FROM galleries
    WHERE slug = ? AND is_active = 1
    LIMIT 1
");
$gStmt->execute([$slug]);
$gallery = $gStmt->fetch();

if (!$gallery) {
    http_response_code(404);
    require_once $ROOT . '/app/includes/header.php';
    require_once $ROOT . '/app/includes/nav.php';
    echo "<main class='container py-5'><h2>Gallery not found</h2></main>";
    require_once $ROOT . '/app/includes/footer.php';
    exit;
}

// 5) Fetch images
$iStmt = $pdo->prepare("
    SELECT file_path, title, caption, orientation
    FROM images
    WHERE gallery_id = ? AND is_active = 1
    ORDER BY sort_order ASC, image_id ASC
");
$iStmt->execute([$gallery['gallery_id']]);
$images = $iStmt->fetchAll();
$orientation = $images[0]['orientation'] ?? null;

// 6) Shared header + nav
require_once $ROOT . '/app/includes/header.php';
require_once $ROOT . '/app/includes/nav.php';
?>
<main class="container py-4">

    <header class="mb-3">
        <h2 class="mb-2"><?= htmlspecialchars($gallery['title']) ?></h2>
        <?php if (!empty($gallery['description'])): ?>
            <p class="text-muted"><?= nl2br(htmlspecialchars($gallery['description'])) ?></p>
        <?php endif; ?>
    </header>

    <?php if (empty($images)): ?>
        <p>No images in this gallery yet.</p>
    <?php else: ?>
        <div class="row gallery g-3">
            <?php foreach ($images as $img): ?>
                <div class="col-6 col-md-4 col-lg-3">
                    <a
                        href="<?= htmlspecialchars($img['file_path'], ENT_QUOTES, 'UTF-8') ?>"
                        class="image-popup"
                        title="<?= htmlspecialchars($img['caption'] ?? $img['title'] ?? '', ENT_QUOTES, 'UTF-8') ?>">
                        <img
                            src="<?= htmlspecialchars($img['file_path'], ENT_QUOTES, 'UTF-8') ?>"
                            class="img-fluid img-frame <?= htmlspecialchars($img['orientation'] ?? '', ENT_QUOTES, 'UTF-8') ?>"
                            alt="<?= htmlspecialchars($img['title'] ?? 'Artwork', ENT_QUOTES, 'UTF-8') ?>"
                            loading="lazy">
                    </a>
                    <?php if (!empty($img['title'])): ?>
                        <div class="caption mt-2 text-center">
                            <?= htmlspecialchars($img['title'], ENT_QUOTES, 'UTF-8') ?>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

</main>
<?php require_once $ROOT . '/app/includes/footer.php'; ?>