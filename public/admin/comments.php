<?php

declare(strict_types=1);

require_once __DIR__ . '/../../app/config/bootstrap.php';
require_once __DIR__ . '/../../app/includes/header.php';
require_once __DIR__ . '/../../app/includes/nav.php';

?>
<main class="container">
    <h1>Comments Moderation</h1>
    <p><em>Note:</em> Until login is ready, this page will prompt for an admin token and store it in this browser session.</p>

    <section id="sec-pending">
        <h2>Pending</h2>
        <div id="pending-list"></div>
        <button id="pending-more" style="display:none;">Load more</button>
    </section>

    <hr>

    <section id="sec-spam">
        <h2>Spam</h2>
        <div id="spam-list"></div>
        <button id="spam-more" style="display:none;">Load more</button>
    </section>
</main>
<?php
require_once __DIR__ . '/../../app/includes/footer.php';
?>

<script>
    (function() {
        const api = {
            list: '/api/admin-comments-list.php', // GET status, page, limit
            approve: '/api/comments-approve.php', // POST id
            unapprove: '/api/comments-unapprove.php', // POST id
            spam: '/api/comments-mark-spam.php', // POST id
            unspam: '/api/comments-unspam.php', // POST id
            del: '/api/comments-delete.php', // POST id
        };

        function getToken() {
            let t = sessionStorage.getItem('admin_token');
            if (!t) {
                t = prompt('Enter admin token:');
                if (t) sessionStorage.setItem('admin_token', t);
            }
            return t || '';
        }

        async function fetchList(status, page = 1, limit = 20) {
            const token = getToken();
            const url = `${api.list}?status=${encodeURIComponent(status)}&page=${page}&limit=${limit}`;
            const res = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'X-Admin-Token': token
                }
            });
            if (!res.ok) throw new Error('Failed to load list');
            return await res.json();
        }

        async function postAction(endpoint, id) {
            const token = getToken();
            const body = new URLSearchParams({
                id: String(id)
            });
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-Admin-Token': token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body
            });
            const json = await res.json();
            if (!res.ok || !json.ok) throw new Error(json.error || 'Action failed');
            return json;
        }

        function escapeHtml(str) {
            return (str || '').replace(/[&<>"']/g, s => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            } [s]));
        }

        function renderItems(container, items, status) {
            if (!items || items.length === 0) {
                if (!container.querySelector('ul')) container.innerHTML = '<p>No items.</p>';
                return;
            }
            let ul = container.querySelector('ul');
            if (!ul) {
                ul = document.createElement('ul');
                container.innerHTML = '';
                container.appendChild(ul);
            }
            items.forEach(c => {
                const li = document.createElement('li');
                li.dataset.id = c.comment_id;
                li.innerHTML = `
        <div><strong>${escapeHtml(c.name)}</strong> <small>${escapeHtml(c.email || '')}</small> — <small>${escapeHtml(c.content_type)} #${c.content_id}</small> — <small>${c.created_at}</small></div>
        <div style="margin:4px 0;">${c.body_html}</div>
        <div class="actions" style="display:flex; gap:.5rem; flex-wrap:wrap;">
          ${status === 'pending'
            ? `<button data-action="approve">Approve</button>
               <button data-action="spam">Mark spam</button>`
            : `<button data-action="unspam">Unspam</button>
               <button data-action="approve">Approve</button>`}
          <button data-action="unapprove">Unapprove</button>
          <button data-action="delete" style="color:#b00020;">Delete</button>
        </div>
      `;
                ul.appendChild(li);
            });
        }

        function wireActions(container) {
            container.addEventListener('click', async (e) => {
                const btn = e.target.closest('button[data-action]');
                if (!btn) return;
                const li = btn.closest('li[data-id]');
                const id = li?.dataset.id;
                if (!id) return;

                const action = btn.dataset.action;
                try {
                    if (action === 'approve') await postAction(api.approve, id);
                    if (action === 'unapprove') await postAction(api.unapprove, id);
                    if (action === 'spam') await postAction(api.spam, id);
                    if (action === 'unspam') await postAction(api.unspam, id);
                    if (action === 'delete') {
                        if (!confirm('Delete this comment?')) return;
                        await postAction(api.del, id);
                    }
                    li.remove();
                } catch (err) {
                    alert(err.message || 'Action failed');
                }
            });
        }

        // Sections (with pagination)
        const pending = {
            container: document.getElementById('pending-list'),
            btn: document.getElementById('pending-more'),
            page: 1,
            pages: 1
        };
        const spam = {
            container: document.getElementById('spam-list'),
            btn: document.getElementById('spam-more'),
            page: 1,
            pages: 1
        };

        async function loadSection(sec, status) {
            try {
                const json = await fetchList(status, sec.page, 20);
                sec.pages = json.pages || 1;
                // update header counts
                const header = sec.container.parentElement.querySelector('h2');
                if (header && typeof json.total === 'number') header.textContent = `${status.charAt(0).toUpperCase()+status.slice(1)} (${json.total})`;
                renderItems(sec.container, json.data || [], status);
                sec.btn.style.display = (sec.page < sec.pages) ? '' : 'none';
            } catch (err) {
                sec.container.innerHTML = `<p style="color:#b00020;">${escapeHtml(err.message || 'Failed to load')}</p>`;
                sec.btn.style.display = 'none';
            }
        }

        wireActions(pending.container);
        wireActions(spam.container);

        pending.btn.addEventListener('click', () => {
            pending.page += 1;
            loadSection(pending, 'pending');
        });
        spam.btn.addEventListener('click', () => {
            spam.page += 1;
            loadSection(spam, 'spam');
        });

        // initial loads
        loadSection(pending, 'pending');
        loadSection(spam, 'spam');
    })();
</script>