document.addEventListener("DOMContentLoaded", async () => {
  // --- Helpers --------------------------------------------------------------
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  const hasjQuery = () => !!window.jQuery;
  const hasMagnific = () =>
    !!(hasjQuery() && jQuery.fn && jQuery.fn.magnificPopup);

  // --- HOME CAROUSEL (#galleryList) ----------------------------------------
  const listEl = document.getElementById("galleryList");
  if (listEl) {
    try {
      // IMPORTANT: relative URL; & not &amp;
      const res = await fetch(
        "api/gallery-images.php?limit=15&random=1&lightbox=large",
        {
          cache: "no-store",
        },
      );
      const { images = [] } = await res.json();

      const normalize = (p) => {
        if (!p) return "";
        p = p.replace(/^\/sites\/production\/davidschu_new\/public\//, "");
        p = p.replace(/^\//, "");
        return p;
      };

      listEl.innerHTML = images
        .map((img) => {
          const src = normalize(img.url);
          const href = src; // use thumb/full split later if you have it
          const alt = escapeHtml(img.alt || "");
          const cap = img.caption
            ? `<div class="caption">${escapeHtml(img.caption)}</div>`
            : "";

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

      // Mount Splide AFTER slides are in the DOM (only if Splide is present)
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
      } else {
        console.warn("[script.js] Splide not found; skipping carousel init.");
      }

      // Lightbox for home list (delegated)
      if (hasMagnific()) {
        jQuery("#galleryList").magnificPopup({
          delegate: "a.lightbox",
          type: "image",
          gallery: { enabled: true },
          image: { titleSrc: "title" },
          removalDelay: 200,
          mainClass: "mfp-fade",
        });
      } else {
        console.warn(
          "[script.js] Magnific not found (home). Verify load order/paths.",
        );
      }

      // Diagnostics (optional)
      console.log("First image from API:", images[0]);
      const firstImg = document.querySelector("#galleryList img");
      console.log("Rendered <img src>:", firstImg?.getAttribute("src"));
    } catch (e) {
      console.error(e);
      listEl.innerHTML =
        '<li class="splide__slide">Could not load images.</li>';
    }
  }

  // --- GALLERY GRID (#galleryGrid) -----------------------------------------
  const gridEl = document.getElementById("galleryGrid");
  if (gridEl) {
    if (hasMagnific()) {
      jQuery("#galleryGrid").magnificPopup({
        delegate: "a.lightbox",
        type: "image",
        gallery: { enabled: true },
        image: { titleSrc: "title" },
        removalDelay: 200,
        mainClass: "mfp-fade",
      });
    } else {
      console.warn(
        "[script.js] Magnific not found (gallery). Verify load order/paths.",
      );
    }
  }
});
