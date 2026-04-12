<?php

declare(strict_types=1);

require_once __DIR__ . '/helper.php';


$pdo = db();
// <<< get a guaranteed PDO
if (!isset($BASE_URL)) {
    $BASE_URL = getBaseURL();
}

try {
    $who = [
        'current_user' => $pdo->query("SELECT CURRENT_USER()")->fetchColumn(),
        'user_func'    => $pdo->query("SELECT USER()")->fetchColumn(),
        'db'           => $pdo->query("SELECT DATABASE()")->fetchColumn(),
    ];
    $probes = [
        'probe_content' => "SELECT 1 FROM schu_art.galleries LIMIT 1",
        // If you have an images DB:
        'probe_media'   => "SELECT 1 FROM schu_art.images LIMIT 1",
    ];

    echo "<!-- CONNECT INFO: current_user={$who['current_user']} user()={$who['user_func']} db={$who['db']} -->\n";

    foreach ($probes as $label => $sql) {
        try {
            $pdo->query($sql)->fetch();
            echo "<!-- {$label}: OK -->\n";
        } catch (Throwable $e) {
            echo "<!-- {$label}: FAIL: " . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8') . " -->\n";
        }
    }
} catch (Throwable $e) {
    echo "<!-- CONNECT INFO ERROR: " . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8') . " -->\n";
}
require_once __DIR__ . '/helper.php';
require_once __DIR__ . '/../models/GalleryModel.php';


if (!isset($BASE_URL)) {
    $BASE_URL = getBaseURL();
}


/* 2) QUICK DB COUNTS (debug) */
try {
    $active   = (int)$pdo->query("SELECT COUNT(*) FROM galleries WHERE is_active = 1")->fetchColumn();
    $withSlug = (int)$pdo->query("SELECT COUNT(*) FROM galleries WHERE is_active = 1 AND TRIM(COALESCE(slug,'')) <> ''")->fetchColumn();
    echo "<!-- DB CHECK: active={$active}, active_with_slug={$withSlug} -->\n";
} catch (Throwable $e) {
    echo "<!-- DB CHECK ERROR: " . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8') . " -->\n";
}

/* 3) HELPERS */
function isActive(string $pathFragment): bool
{
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
    return strpos($uri, $pathFragment) !== false;
}

function isActiveGallery(): bool
{
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
    // Your current route uses gallery.php?slug=...
    if (strpos($uri, '/gallery.php') !== false) {
        return isset($_GET['slug']) && trim((string)$_GET['slug']) !== '';
    }
    // If you later add pretty URLs (/galleries/<slug>), you can extend:
    // if (strpos($uri, '/galleries/') !== false) return true;
    return false;
}

/* 4) FETCH GALLERIES FROM MODEL */
$galleries = [];
try {
    if (isset($pdo) && $pdo instanceof PDO) {
        if (method_exists('GalleryModel', 'getActiveWithImages')) {
            $galleries = GalleryModel::getActiveWithImages($pdo); // only with images (if you created it)
            echo "<!-- USING: getActiveWithImages -->\n";
        } else {
            $galleries = GalleryModel::getActive($pdo); // otherwise all active (filtered in model)
            echo "<!-- USING: getActive -->\n";
        }
    } else {
        echo "<!-- ERROR: $pdo not set or not PDO -->\n";
    }
} catch (Throwable $e) {
    echo "<!-- MODEL ERROR: " . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8') . " -->\n";
    $galleries = [];
}

echo "<!-- GALLERIES COUNT (rendered): " . count($galleries) . " -->\n";
?>
<header class="brand-band site-banner">
    <div class="container band-inner banner-inner">
        <div class="brand-left banner-logo">
            <a href="<?= htmlspecialchars($BASE_URL, ENT_QUOTES, 'UTF-8') ?>/">
                <img
                    src="<?= htmlspecialchars($BASE_URL, ENT_QUOTES, 'UTF-8') ?>/assets/images/site-images/20190518_142021-300x92.png"
                    alt="David Schu signature">
            </a>
        </div>

        <div class="brand-right">
            <p class="banner-scripture">
                Let all that I am praise the Lord; with my whole heart, I will praise His holy name. Psalm 103:1
            </p>
        </div>
    </div>
</header>

<nav class="site-nav" aria-label="Primary navigation">
    <div class="nav-inner">

        <!-- Mobile toggle (optional but preserved) -->
        <button class="nav-toggle"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#primaryNav"
            aria-controls="primaryNav"
            aria-expanded="false"
            aria-label="Toggle navigation">
            ☰
        </button>

        <!-- Navigation links -->
        <div class="collapse show-desktop" id="primaryNav">
            <ul class="nav-list">

                <li>
                    <a class="site-nav-link <?= (isActive('/index.php') || (($_SERVER['REQUEST_URI'] ?? '') === '/')) ? 'is-active' : '' ?>"
                        href="<?= htmlspecialchars($BASE_URL, ENT_QUOTES, 'UTF-8') ?>/index.php">
                        Home
                    </a>
                </li>

                <li>
                    <a class="site-nav-link <?= isActive('/about.php') ? 'is-active' : '' ?>"
                        href="<?= htmlspecialchars($BASE_URL, ENT_QUOTES, 'UTF-8') ?>/about.php">
                        About
                    </a>
                </li>

                <li>
                    <a class="site-nav-link <?= isActive('/comments.php') ? 'is-active' : '' ?>"
                        href="<?= htmlspecialchars($BASE_URL, ENT_QUOTES, 'UTF-8') ?>/comments.php">
                        Comments
                    </a>
                </li>

                <?php
                $isGalleries = isActive('/galleries.php') || isActive('/gallery.php');
                ?>
                <li>
                    <a class=" site-nav-link <?= $isGalleries ? 'is-active' : '' ?>"
                        href="<?= htmlspecialchars($BASE_URL, ENT_QUOTES, 'UTF-8') ?>/galleries.php">
                        Galleries
                    </a>
                </li>

            </ul>
        </div>

    </div>
</nav>