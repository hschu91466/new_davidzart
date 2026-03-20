console.log("[gallery] script.js loaded (marker at top)");
document.addEventListener("DOMContentLoaded", async () => {
  console.log("[gallery] data-page =", document.body?.dataset?.page);
  if (document.body.dataset.page !== "home") return; // Only run on homepage (where the gallery is)
  // === Get DOM elements ===
  const container = document.getElementById("randomGallery");
  const listEl = document.getElementById("galleryList");

  if (!container || !listEl) {
    console.error("[gallery] Missing #randomGallery or #galleryList.");
    return;
  }

  // === Read the API endpoint from HTML (built by PHP with base_url) ===
  // const endpointUrl = container.dataset.endpoint;
  const endpointUrl = toAbsUrl(container.dataset.endpoint);

  if (!endpointUrl) {
    console.error("[gallery] data-endpoint missing on #randomGallery");
    return;
  }
  console.log("[gallery] Fetching:", endpointUrl);

  // === Helpers ===
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function toAbsUrl(u) {
    if (!u) return "";
    // Already absolute (http(s) or data URI)
    if (/^(?:https?:)?\/\//i.test(u) || /^data:/i.test(u)) return u;

    // Normalize
    if (u.startsWith("/")) {
      // '/assets/...' -> BASE_URL + '/assets/...'
      return (window.BASE_URL || "") + u;
    }
    // 'assets/...' -> BASE_URL + '/assets/...'
    return (window.BASE_URL || "") + "/" + u.replace(/^\/+/, "");
  }

  function coerceImages(payload) {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.images)) return payload.images;

    if (typeof payload.images === "string") {
      try {
        const parsed = JSON.parse(payload.images);
        if (Array.isArray(parsed)) return parsed;
      } catch (_) {}
    }

    if (payload.images && Array.isArray(payload.images.data)) {
      return payload.images.data;
    }

    if (payload.images && typeof payload.images === "object") {
      const vals = Object.values(payload.images);
      if (vals.length && vals.every((v) => typeof v === "object")) return vals;
    }

    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.results)) return payload.results;

    return [];
  }

  try {
    const res = await fetch(endpointUrl, { cache: "no-store" });
    console.log("[gallery] HTTP", res.status, res.statusText);

    const text = await res.text();
    let raw;
    try {
      raw = JSON.parse(text);
    } catch (e) {
      console.error("[gallery] JSON parse error. Raw text:", text);
      listEl.innerHTML = `<li class="splide__slide">API did not return valid JSON.</li>`;
      return;
    }

    console.log("[gallery] Raw JSON keys:", Object.keys(raw || {}));
    const images = coerceImages(raw);
    console.log("[gallery] Parsed images length:", images.length);

    if (!images.length) {
      listEl.innerHTML = `<li class="splide__slide">No images returned by the API.</li>`;
      console.warn("[gallery] typeof raw.images =", typeof raw.images);
      if (typeof raw.images === "string") {
        console.warn(
          "[gallery] raw.images (string) preview:",
          raw.images.slice(0, 200),
        );
      } else if (raw.images && typeof raw.images === "object") {
        console.warn(
          "[gallery] raw.images (object) keys:",
          Object.keys(raw.images),
        );
      }
      return;
    }

    // === Render Slides ===
    listEl.innerHTML = images
      .map((img, i) => {
        // const src = img.url || img.src || img.image_url || "";
        const raw = img.url || img.src || img.image_url || "";
        const src = toAbsUrl(raw);

        const alt = escapeHtml(img.alt || img.title || `image-${i}`);
        const cap = img.caption
          ? `<div class="caption">${escapeHtml(img.caption)}</div>`
          : "";
        if (!src) console.warn("[gallery] Missing URL for item:", img);

        // const href = src; // keep as-is
        const href = toAbsUrl(
          img.href || img.url || img.src || img.image_url || src,
        );
        console.log(
          "[gallery] BASE:",
          window.BASE_URL,
          "endpoint:",
          endpointUrl,
          "raw:",
          raw,
          "src:",
          src,
        );
        return `        
          <li class="splide__slide">
            <a href="${href}" class="lightbox" aria-label="Open image">
              <div class="img-wrap">
                <img src="${src}" alt="${alt}" loading="lazy" decoding="async">
              </div>
            </a>
            ${cap}
          </li>
        `;
      })
      .join("");

    // === Init Splide ===
    if (window.Splide) {
      new Splide("#randomGallery", {
        type: "loop",
        perPage: 3,
        perMove: 1,
        gap: "1rem",
        autoplay: true,
        interval: 3500,
        pauseOnHover: true,
        breakpoints: { 1024: { perPage: 2 }, 640: { perPage: 1 } },
      }).mount();
    }

    // === Optional: Magnific Popup ===
    if (window.jQuery && jQuery.fn && jQuery.fn.magnificPopup) {
      jQuery("#galleryList").magnificPopup({
        delegate: "a.lightbox",
        type: "image",
        gallery: { enabled: true },
        image: { titleSrc: "title" },
        removalDelay: 200,
        mainClass: "mfp-fade",
      });
    }
  } catch (err) {
    console.error("[gallery] Exception:", err);
    listEl.innerHTML = `<li class="splide__slide">Could not load images.</li>`;
  }
});
