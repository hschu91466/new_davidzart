<?php

// public/upload.php
declare(strict_types=1);
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
if (headers_sent($file, $line)) {
    error_log("HEADERS ALREADY SENT at $file:$line");
}
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_error.log');
error_log("Testing error log write...");
error_log('--- CSRF DEBUG START ---');
error_log('POST KEYS: ' . implode(',', array_keys($_POST)));
error_log('POST csrf_token (raw): ' . (isset($_POST['csrf_token']) ? '[' . $_POST['csrf_token'] . ']' : '[missing]'));
error_log('FILES KEYS: ' . implode(',', array_keys($_FILES)));
error_log('Content-Type: ' . ($_SERVER['CONTENT_TYPE'] ?? '[none]'));
error_log('Content-Length: ' . ($_SERVER['CONTENT_LENGTH'] ?? '[none]'));
error_log('--- CSRF DEBUG END ---');





if ($_SERVER['REQUEST_METHOD'] === 'POST' && empty($_POST) && !empty($_FILES)) {
    error_log("POST BODY DROPPED: POST empty but FILES present");
}

if (!empty($_POST) && empty($_FILES)) {
    error_log("POST BODY DROPPED: FILES empty but POST present");
}

require_once dirname(__DIR__) . '/app/config/bootstrap.php';

$errors = [];
$successMsg = null;

try {
    // Fetch galleries for dropdown
    $galleries = GalleryModel::getAllForUploadIncludingEmpty($pdo);

    error_log('Galleries loaded: ' . count($galleries));
    foreach (array_slice($galleries, 0, 10) as $gx) {
        error_log(sprintf(
            'Gallery: id=%s title=%s slug=%s active=%s has_images=%s',
            $gx['gallery_id'] ?? 'n/a',
            $gx['title'] ?? 'n/a',
            $gx['slug'] ?? 'n/a',
            $gx['is_active'] ?? 'n/a',
            $gx['has_images'] ?? 'n/a'
        ));
    }

    // Initialize form values (persist after errors)
    $galleryId   = isset($_POST['gallery_id']) ? (int)$_POST['gallery_id'] : (int)($_GET['gallery_id'] ?? 0);
    $title       = trim($_POST['title'] ?? '');
    $caption     = trim($_POST['caption'] ?? '');
    $priceInput  = trim($_POST['price'] ?? '');
    $yearCreated = trim($_POST['year_created'] ?? '');
    $medium      = trim($_POST['medium'] ?? '');
    $dimensions  = trim($_POST['dimensions'] ?? '');
    $orientation = trim($_POST['orientation'] ?? '');
    $isPublished = isset($_POST['is_published']) ? 1 : 0;
    $isSold      = isset($_POST['is_sold']) ? 1 : 0;

    // Display-only allowed label (your service has a private $allowed)
    $allowedLabel = 'JPG, PNG, GIF, WEBP';

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && empty($_POST) && empty($_FILES)) {
        $errors[] = 'Your upload was rejected because it exceeded the server limits. Please try a smaller file.';
        error_log("POST BODY DROPPED: POST empty but FILES present");
    }


    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // CSRF

        // Choose whichever token name arrived
        $incomingToken = $_POST['csrf_token'] ?? $_POST['_csrf'] ?? $_POST['csrf'] ?? '';
        if (!csrf_validate($incomingToken, true)) {
            $errors[] = 'Invalid form token. Please try again.';
        }

        // Validate gallery selection (service revalidates slug from DB)
        if ($galleryId <= 0) {
            $errors[] = 'Please choose a gallery.';
        }

        // Check file presence (service will do deeper checks)
        if (!isset($_FILES['image']) || !is_array($_FILES['image'])) {
            $errors[] = 'Please choose an image file to upload.';
        }


        error_log('SESSION CSRF: ' . ($_SESSION['csrf_token'] ?? '[none]'));
        error_log('POST    CSRF: ' . ($_POST['csrf_token'] ?? '[none]'));


        // Convert price to cents
        $priceCents = 0;
        if ($priceInput !== '') {
            $normalized = preg_replace('/[^\d.]/', '', $priceInput);
            $priceCents = (int) round(((float)$normalized) * 100);
            if ($priceCents < 0) {
                $priceCents = 0;
            }
        }

        // Year range (optional)
        if ($yearCreated !== '') {
            $yc = (int)$yearCreated;
            $thisYear = (int)date('Y');
            if ($yc < 1800 || $yc > $thisYear) {
                $errors[] = 'Year created must be between 1800 and ' . $thisYear . '.';
            }
        }

        if (empty($errors)) {
            // Services
            $storage = new ImageStorage(__DIR__);           // __DIR__ is /public
            $service = new ImageUploadService($pdo, $storage);

            try {
                $result = $service->handle($galleryId, $_FILES['image'], [
                    'title'        => $title !== '' ? $title : null,
                    'caption'      => $caption !== '' ? $caption : null,
                    'price_cents'  => $priceCents,
                    'year_created' => ($yearCreated !== '') ? (int)$yearCreated : null,
                    'medium'       => $medium !== '' ? $medium : null,
                    'dimensions'   => $dimensions !== '' ? $dimensions : null,
                    'orientation'  => $orientation !== '' ? $orientation : null,
                    'is_published' => $isPublished,
                    'is_active'    => 1,
                    'is_sold'      => $isSold,
                    // sort_order is computed in the service
                ]);

                $successMsg  = 'Image uploaded successfully.';
                // Reset most fields; keep gallery selected for quick batch uploads
                $title = $caption = $priceInput = $yearCreated = $medium = $dimensions = $orientation = '';
                $isPublished = 1;
                $isSold = 0;

                // Optional PRG:
                // $_SESSION['flash_success'] = $successMsg;
                // header('Location: /upload.php?gallery_id=' . $galleryId);
                // exit;

            } catch (RuntimeException $ex) {
                $errors[] = $ex->getMessage();
            } catch (Throwable $ex) {
                $errors[] = 'Unexpected error during upload: ' . $ex->getMessage();
            }
        }
    }
} catch (Throwable $e) {
    $errors[] = 'Unexpected error: ' . $e->getMessage();
}

// Page HTML
require_once __DIR__ . '/../app/includes/header.php';
require_once __DIR__ . '/../app/includes/nav.php';
?>
<main class="container" style="max-width: 800px; margin: 2rem auto;">
    <h1>Upload Image</h1>

    <?php if (!empty($errors)): ?>
        <div class="alert alert-danger">
            <ul><?php foreach ($errors as $err) echo '<li>' . h($err) . '</li>'; ?></ul>
        </div>
    <?php endif; ?>

    <?php if (!empty($_SESSION['flash_success'])): ?>
        <div class="alert alert-success"><?php echo h($_SESSION['flash_success']);
                                            unset($_SESSION['flash_success']); ?></div>
    <?php elseif ($successMsg): ?>
        <div class="alert alert-success"><?php echo h($successMsg); ?></div>
    <?php endif; ?>

    <form method="post" enctype="multipart/form-data" novalidate>
        <input type="hidden" name="_csrf" value="<?php echo h(csrf_token()); ?>">

        <div class="form-group">
            <label for="gallery_id">Gallery</label>
            <?php
            // Fetch with your new method (or the LEFT JOIN version you added)
            $allGalleries = GalleryModel::getAllForUploadIncludingEmpty($pdo);

            // Debug — print what PHP will attempt to render for the select
            echo "<!-- DROPDOWN PREVIEW (server-side): count=" . count($allGalleries) . " -->\n";
            foreach ($allGalleries as $gx) {
                echo "<!-- " . h($gx['title']) . " | has_images=" . (int)$gx['has_images'] . " | id=" . (int)$gx['gallery_id'] . " -->\n";
            }
            ?>
            <select id="gallery_id" name="gallery_id" class="form-control" required>
                <option value="">— Choose a gallery —</option>
                <?php foreach ($allGalleries as $g): ?>
                    <option value="<?php echo (int)$g['gallery_id']; ?>"
                        <?php echo ($galleryId && (int)$g['gallery_id'] === (int)$galleryId) ? 'selected' : ''; ?>>
                        <?php
                        $label = $g['title'];
                        if (isset($g['has_images']) && (int)$g['has_images'] === 0) {
                            $label .= ' (empty)';
                        }
                        echo h($label);
                        ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>

        <div class="form-group" style="margin-top: 1rem;">
            <label for="image">Image File</label>
            <input id="image" name="image" type="file" accept="image/*" class="form-control" required>
            <small>Allowed: <?php echo h($allowedLabel); ?>. Max 10 MB.</small>
        </div>

        <div class="form-group" style="margin-top: 1rem;">
            <label>Title</label>
            <input type="text" name="title" class="form-control" value="<?php echo h($title ?? ''); ?>">
        </div>

        <div class="form-group" style="margin-top: 1rem;">
            <label>Caption</label>
            <textarea name="caption" class="form-control" rows="3"><?php echo h($caption ?? ''); ?></textarea>
        </div>

        <div class="form-group" style="margin-top: 1rem;">
            <label>Orientation</label>
            <input type="text" name="orientation" class="form-control" placeholder="e.g., landscape, portrait" value="<?php echo h($orientation ?? ''); ?>">
        </div>

        <div class="form-row" style="display:flex; gap: 1rem; margin-top: 1rem;">
            <div class="form-group" style="flex:1;">
                <label>Price (USD)</label>
                <input type="text" name="price" class="form-control" placeholder="e.g., 125.00" value="<?php echo h($priceInput ?? ''); ?>">
            </div>
            <div class="form-group" style="flex:1;">
                <label>Year Created</label>
                <input type="number" name="year_created" class="form-control" min="1800" max="<?php echo date('Y'); ?>" value="<?php echo h($yearCreated ?? ''); ?>">
            </div>
        </div>

        <div class="form-row" style="display:flex; gap: 1rem; margin-top: 1rem;">
            <div class="form-group" style="flex:1;">
                <label>Medium</label>
                <input type="text" name="medium" class="form-control" placeholder="Oil on canvas" value="<?php echo h($medium ?? ''); ?>">
            </div>
            <div class="form-group" style="flex:1;">
                <label>Dimensions</label>
                <input type="text" name="dimensions" class="form-control" placeholder='e.g., "12 × 16 in"' value="<?php echo h($dimensions ?? ''); ?>">
            </div>
        </div>

        <div class="form-row" style="display:flex; gap: 2rem; margin-top: 1rem; align-items:center;">
            <label>
                <input type="checkbox" name="is_published" <?php echo !empty($isPublished) ? 'checked' : ''; ?>>
                Published
            </label>
            <label>
                <input type="checkbox" name="is_sold" <?php echo !empty($isSold) ? 'checked' : ''; ?>>
                Mark as Sold
            </label>
        </div>

        <div style="margin-top: 1.5rem;">
            <button type="submit" class="btn btn-primary">Upload</button>
        </div>
    </form>
</main>
<?php require_once __DIR__ . '/../app/includes/footer.php'; ?>