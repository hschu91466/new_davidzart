<?php
// app/includes/comments-list.php
$contentType = $_GET['content_type'] ?? 'image';
$contentId   = (int)($_GET['content_id'] ?? 0);
?>
<div id="comments-container"
    data-type="<?php echo htmlspecialchars($contentType, ENT_QUOTES); ?>"
    data-id="<?php echo (int)$contentId; ?>">
    <h2>Comments</h2>
    <ol id="comments-list"></ol>
    <button id="comments-loadmore" style="display:none;">Load more</button>
</div>

<script>
    (function() {
        const container = document.getElementById('comments-container');
        const list = document.getElementById('comments-list');
        const loadBtn = document.getElementById('comments-loadmore');
        const type = container.dataset.type || 'image';
        const id = parseInt(container.dataset.id || '0', 10);

        let page = 1,
            pages = 1,
            limit = 10;

        async function load() {
            const url = `/api/comments-list.php?content_type=${encodeURIComponent(type)}&content_id=${encodeURIComponent(id)}&page=${page}&limit=${limit}`;
            const res = await fetch(url, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            const json = await res.json();

            pages = json.pages || Math.ceil((json.total || 0) / limit) || 1;

            (json.data || []).forEach(c => {
                const li = document.createElement('li');
                li.innerHTML = `
        <div><strong>${escapeHtml(c.name)}</strong> <small>${c.created_at}</small></div>
        <div>${c.body_html ? c.body_html : escapeHtml(c.body).replace(/\n/g,'<br>')}</div>`;
                list.appendChild(li);
            });

            loadBtn.style.display = (page < pages) ? '' : 'none';
        }

        loadBtn.addEventListener('click', () => {
            page += 1;
            load();
        });

        function escapeHtml(str) {
            return (str || '').replace(/[&<>"']/g, s => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            } [s]));
        }

        // initial load
        load();
    })();
</script>