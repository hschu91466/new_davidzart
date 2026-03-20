<?php
require_once dirname(__DIR__) . '/app/config/bootstrap.php';
include_once __DIR__ . '/../app/includes/header.php';
include_once __DIR__ . '/../app/includes/nav.php';
?>
<main class="container py-5">
    <section class="section text-center">
        <!-- <h2>Community Comments</h2> -->

        <?php include_once __DIR__ . '/../app/includes/comment-list.php'; ?>
        <hr>
        <h3>Leave a comment</h3>
        <?php include_once __DIR__ . '/../app/includes/comment-form.php'; ?>
    </section>
</main>
<?php include_once __DIR__ . '/../app/includes/footer.php';
