<?php
// public/gallery.php
declare(strict_types=1);

require_once dirname(__DIR__) . '/app/config/bootstrap.php';

// Read slug
$slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';
if ($slug === '') {
    render_404('Gallery not found.');
    return;
}

// Fetch gallery via model
$gallery = GalleryModel::getBySlug($pdo, $slug);
if (!$gallery) {
    render_404('Gallery not found.');
    return;
}

// Fetch images via model
$images = ImageModel::getByGallery($pdo, (int)$gallery['gallery_id']);

// Shared header + nav
require_once $ROOT . '/includes/header.php';
require_once $ROOT . '/includes/nav.php';
?>

<main class="container py-4">
    <header class="mb-3">
        <h2 class="mb-2"><?= h($gallery['title']) ?></h2>
        <?php if (!empty($gallery['description'])): ?>
            <p class="text-muted"><?= nl2br(h($gallery['description'])) ?></p>
        <?php endif; ?>
    </header>
    <?php if (empty($images)): ?>
        <p>No images in this gallery yet.</p>
    <?php else: ?>
        <div class="row gallery g-3" id="galleryGrid">
            <?php foreach ($images as $img): ?>
                <?php
                // Title & alt fallbacks
                $title   = $img['caption'] ?? $img['title'] ?? '';
                $alt     = $img['title'] ?? 'Artwork';
                $orient  = $img['orientation'] ?? '';

                // Build a web-safe URL for the image
                // If you implemented img_src(): use it; otherwise keep your web_path() + BASE joiner.
                $src  = img_src($img['file_path']);   // e.g., '/assets/images/...'
                $href = $src; // same for lightbox; change later if you add high-res variants
                ?>
                <div class="col-6 col-md-4 col-lg-3">
                    <a href="<?= h($href) ?>" class="lightbox" title="<?= h($title) ?>">
                        <img
                            src="<?= h($src) ?>"
                            class="img-fluid img-frame <?= h($orient) ?>"
                            alt="<?= h($alt) ?>"
                            loading="lazy" decoding="async">
                    </a>
                    <?php if (!empty($img['title'])): ?>
                        <div class="caption mt-2 text-center"><?= h($alt) ?></div>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</main>
<?php require_once $ROOT . '/includes/footer.php'; ?>