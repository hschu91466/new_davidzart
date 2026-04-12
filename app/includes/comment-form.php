<?php
// app/includes/comment-form.php
require_once __DIR__ . '/helper.php';
$csrf = csrf_token();

$contentType = $_GET['content_type'] ?? 'image';
$contentId   = (int)($_GET['content_id'] ?? 0);
$formStartTs = time();
?>

<form id="comment-form" method="post" action="/api/comments-create.php">
    <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrf, ENT_QUOTES); ?>">
    <input type="hidden" name="form_start_ts" value="<?php echo (int)$formStartTs; ?>">
    <input type="hidden" name="content_type" value="<?php echo htmlspecialchars($contentType, ENT_QUOTES); ?>">
    <input type="hidden" name="content_id" value="<?php echo (int)$contentId; ?>">

    <!-- honeypot -->
    <div style="position:absolute;left:-5000px;opacity:0;" aria-hidden="true">
        <label>Leave this field empty</label>
        <input type="text" name="website_url_hp" tabindex="-1" autocomplete="off">
    </div>

    <div>
        <label for="c_name">Name *</label>
        <input id="c_name" type="text" name="name" required maxlength="120">
    </div>
    <div>
        <label for="c_email">Email *</label>
        <input id="c_email" type="email" name="email" required maxlength="190">
    </div>
    <div>
        <label for="c_body">Comment *</label>
        <textarea id="c_body" name="comment" required rows="5" maxlength="4000"></textarea>
    </div>
    <button type="submit">Post Comment</button>
    <p id="comment-form-msg" role="status" aria-live="polite"></p>
</form>

<script>
    document.getElementById('comment-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        const msg = document.getElementById('comment-form-msg');

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });
            const json = await res.json();
            if (!res.ok || !json.ok) {
                msg.textContent = (json.errors && json.errors.join(' ')) || json.error || 'Could not post comment.';
                msg.style.color = '#b00020';
            } else {
                msg.textContent = json.message || 'Thanks! Your comment is pending approval.';
                msg.style.color = '#0a7a2f';
                form.reset();
            }
        } catch (err) {
            msg.textContent = 'Network error. Please try again.';
            msg.style.color = '#b00020';
        }
    });
</script>