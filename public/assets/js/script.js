document.addEventListener("DOMContentLoaded", async () => {
  const listEl = document.getElementById("galleryList");

  try {
    // IMPORTANT: Relative URL (no leading slash) and use & not &amp;
    const res = await fetch(
      "api/gallery-images.php?limit=15&random=1&lightbox=large",
      { cache: "no-store" },
    );
    const { images } = await res.json();

    // Normalize: strip the server path prefix and leading slash
    const normalize = (p) => {
      if (!p) return "";
      p = p.replace(/^\/sites\/production\/davidschu_new\/public\//, ""); // remove server path prefix
      p = p.replace(/^\//, ""); // ensure it's project-relative
      return p; // e.g., assets/images/galleries/gallery-one/art-img12.jpg
    };

    listEl.innerHTML = images
      .map((img) => {
        // For now: use the ORIGINAL URL for both href and src
        const src = normalize(img.url);
        const href = src;

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

    // Mount Splide AFTER slides are in the DOM
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

    // Optional: Magnific Popup
    if (window.jQuery && jQuery.fn.magnificPopup) {
      jQuery("#galleryList").magnificPopup({
        delegate: "a.lightbox",
        type: "image",
        gallery: { enabled: true },
      });
    }

    // Quick diagnostics
    console.log("First image from API:", images[0]);
    const firstImg = document.querySelector("#galleryList img");
    console.log("Rendered <img src>:", firstImg?.getAttribute("src"));
  } catch (e) {
    console.error(e);
    listEl.innerHTML = '<li class="splide__slide">Could not load images.</li>';
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
});
