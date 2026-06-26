/* ==========================================================================
   STYLE ENTRY POINT
   Single place that lists every CSS file, grouped the same way as the
   folder structure (core -> components -> layout -> features).
   Imported once in main.jsx. Vite bundles these into one optimized
   CSS file at build time — unlike CSS @import, there's no extra
   runtime request per file.

   Import order matters: tokens/base first, then shared components,
   then layout, then page-specific features.
   ========================================================================== */

// Core
import "./core/tokens.css";
import "./core/base.css";

// Shared components
import "./components/buttons.css";
import "./components/forms.css";
import "./components/tables.css";
import "./components/badges.css";
import "./components/navigation.css";
import "./components/auth.css";
import "./components/banner.css";
import "./components/lightbox.css";
import "./components/footer.css";

// Page-level layout
import "./layout/layout.css";

// Feature/page-specific
import "./features/home/home.css";
import "./features/gallery/gallery-grid.css";
import "./features/gallery/gallery.css";
import "./features/comments/comments.css";
import "./features/admin/admin-layout.css";
import "./features/admin/admin-comments.css";
