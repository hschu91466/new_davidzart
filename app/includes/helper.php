<?php
// Turn on error reporting locally (remove in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Derive base URL dynamically (works for :81 and subfolders)
$scheme   = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host     = $_SERVER['HTTP_HOST']; // includes :81
$subdir   = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\'); // e.g., /sites/site_backups/davidschu_new/public
$BASE_URL = $scheme . '://' . $host . $subdir;

function getBaseURL()
{
    global $BASE_URL;
    return $BASE_URL;
}

// echo "<!-- What is BASE_URL? " . $BASE_URL . " -->\n";

// Safe join: BASE_URL + /path
function base_url(string $path = ''): string
{
    $base = rtrim(getBaseURL(), '/');       // you already have getBaseURL()
    $path = '/' . ltrim($path, '/');
    return $base . $path;
}


// app/includes/helper.php
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

function csrf_token(): string
{

    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function csrf_validate(?string $token, bool $rotateOnSuccess = false): bool
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
    $sessionToken = $_SESSION['csrf_token'] ?? '';
    if (!$token || !$sessionToken) {
        return false;
    }
    $ok = hash_equals($sessionToken, $token);
    if ($ok && $rotateOnSuccess) {
        // rotate to reduce replay
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $ok;
}

function h(?string $s): string
{
    return htmlspecialchars($s ?? '', ENT_QUOTES, 'UTF-8');
}

/**
 * Normalize a stored file path into a project-relative web URL:
 *  - Keeps http(s) URLs as-is
 *  - Strips known server/webroot prefixes like /sites/.../public/
 *  - Returns 'assets/images/...'
 *  - Collapses accidental double slashes
 */
if (!function_exists('web_path')) {
    function web_path(string $path): string
    {
        if ($path === '') return '';

        // Keep full URLs
        if (preg_match('#^https?://#i', $path)) {
            return $path;
        }

        // Strip known server/webroot prefixes (add more here if needed)
        $prefixes = [
            '/sites/production/davidschu_new/public/',
        ];

        foreach ($prefixes as $prefix) {
            // PHP 8+: str_starts_with; PHP 7 fallback to strpos
            if (function_exists('str_starts_with')) {
                if (str_starts_with($path, $prefix)) {
                    $path = substr($path, strlen($prefix));
                    break;
                }
            } else {
                if (strpos($path, $prefix) === 0) {
                    $path = substr($path, strlen($prefix));
                    break;
                }
            }
        }

        // Make project-relative (no leading slash)
        $path = ltrim($path, '/');

        // If it's only a filename or outside assets/images, map it under assets/images
        $startsWith = function (string $haystack, string $needle): bool {
            return function_exists('str_starts_with') ? str_starts_with($haystack, $needle) : strpos($haystack, $needle) === 0;
        };

        if (!$startsWith($path, 'assets/images/')) {
            $path = 'assets/images/' . basename($path);
        }

        // Collapse accidental double slashes
        $path = preg_replace('#/{2,}#', '/', $path);

        return $path; // e.g., assets/images/galleries/gallery-one/art-img12.jpg
    }
}


function normalize_to_assets(string $raw): string
{
    $raw = trim($raw);
    if ($raw === '') return '';

    // Leave absolute URLs / data URIs as-is
    if (preg_match('~^(?:https?:)?//|^data:~i', $raw)) {
        return $raw;
    }

    // Normalize separators
    $p = str_replace('\\', '/', $raw);

    // If the path contains '/public/', strip everything up to and including it
    $posPublic = stripos($p, '/public/');
    if ($posPublic !== false) {
        $p = substr($p, $posPublic + strlen('/public/')); // e.g., 'assets/images/...'
    }

    // If it contains '/assets/', trim to that
    $posAssets = stripos($p, '/assets/');
    if ($posAssets !== false) {
        $p = substr($p, $posAssets + 1); // remove the leading slash to get 'assets/...'
    }

    // Ensure no leading slash for now
    $p = ltrim($p, '/');

    // If it doesn't start with assets/, map to assets/images/
    if (stripos($p, 'assets/') !== 0) {
        // If it's just a filename -> assets/images/filename
        if (strpos($p, '/') === false) {
            $p = 'assets/images/' . $p;
        } else {
            // It has subfolders but not under assets/
            $p = 'assets/images/' . $p;
        }
    }

    // Collapse duplicate slashes and add a single leading slash to make it web-root absolute
    $p = preg_replace('~/{2,}~', '/', $p);
    return '/' . ltrim($p, '/'); // '/assets/...'
}


/**
 * Optional helper: join base URL and a project-relative path to make an absolute URL.
 * Example: url_join(getBaseURL(), 'assets/images/foo.jpg') -> http(s)://host[:port]/subdir/assets/images/foo.jpg
 */
if (!function_exists('url_join')) {
    function url_join(string $base, string $rel): string
    {
        $base = rtrim($base, '/');
        $rel  = ltrim($rel, '/');
        return $base . '/' . $rel;
    }
}


function img_src(string $raw, bool $absolute = false): string
{
    $webPath = normalize_to_assets($raw);
    if ($webPath === '') return '';
    if (preg_match('~^(?:https?:)?//|^data:~i', $webPath)) {
        return $webPath; // already absolute URL or data URI
    }
    return $absolute ? base_url($webPath) : $webPath;
}


// app/includes/helper.php
function render_404(string $message = 'Not found'): void
{
    http_response_code(404);
    $ROOT = dirname(__DIR__);
    require_once $ROOT . '/includes/header.php';
    require_once $ROOT . '/includes/nav.php';
    echo "<main class='container py-5'><h2>" . h($message) . "</h2></main>";
    require_once $ROOT . '/includes/footer.php';
}
