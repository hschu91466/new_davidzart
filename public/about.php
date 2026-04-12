<?php

declare(strict_types=1);
require_once dirname(__DIR__) . '/app/config/bootstrap.php';
include_once __DIR__ . '/../app/includes/header.php';
include_once __DIR__ . '/../app/includes/nav.php';
?>
<main class="container py-5">
    <section class="section text-center">
        <h3 class="section-label">About</h3>
        <p class="bio">This is the about page. Header, nav, CSS, and scripts are loading correctly if you can see this with styling and the navbar toggles on mobile.</p>
    </section>
</main>
<?php include_once __DIR__ . '/../app/includes/footer.php';
