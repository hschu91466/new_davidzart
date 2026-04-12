<?php
require_once dirname(__DIR__) . '/app/config/bootstrap.php';
include_once __DIR__ . '/../app/includes/header.php';
include_once __DIR__ . '/../app/includes/nav.php';
?>
<main class="comments-page">
    <section class="section text-center">


        <?php include_once __DIR__ . '/../app/includes/comment-list.php'; ?>
        <hr>
        <?php include_once __DIR__ . '/../app/includes/comment-form.php'; ?>
    </section>
</main>
<?php include_once __DIR__ . '/../app/includes/footer.php';
