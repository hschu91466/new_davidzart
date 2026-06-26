# CSS Reorganization Notes

## New structure

```
styles/
  main.css                    <- import index (or use as a build entry point)
  core/
    tokens.css                <- EDIT THIS PER SITE (colors, fonts, spacing)
    base.css                  <- global element resets, leave alone
  components/
    buttons.css
    forms.css
    tables.css
    badges.css
    navigation.css
    auth.css
    banner.css                <- renamed from brand.css
    lightbox.css
    footer.css
  layout/
    layout.css                <- app shell, container, about/contact page shells
  features/
    home/
      home.css
    gallery/
      gallery-grid.css        <- grid rules pulled out of old layout.css
      gallery.css             <- deduplicated
    comments/
      comments.css            <- public comment list/form
    admin/
      admin-layout.css        <- tokenized version of old admin.css
      admin-comments.css      <- moderation table; page wrapper renamed
```

## To launch a new site from this codebase

1. Edit `core/tokens.css` only — colors, fonts, spacing.
2. Swap site images / logo / content.
3. Point at the new site's database.
4. Everything else should work unchanged.

## Issues found and fixed during reorg

**1. `.status-badge` was defined twice with different colors.**
Old `components.css` (contact messages) used orange/green. Old
`admin-comments.css` (comment moderation) used gray/green/orange. Same
class name, different values, both loaded globally — last-loaded file
silently won. Merged into `components/badges.css`, driven by new
tokens (`--color-status-pending`, `--color-status-approved`,
`--color-status-spam`). If you want pending messages to look visually
different from pending comments, give them a second class instead of
diverging the shared one again (e.g. `.status-badge.pending.is-message`).

**2. `.quote-text` was defined twice for two different things.**
`brand.css` used it for the static banner quote. `components.css`
used it for a fading/rotating quote with `.fade-in`/`.fade-out`. Kept
the banner version as `.quote-text` (now in `components/banner.css`).
Renamed the rotating one to `.rotating-quote-text` in
`features/home/home.css`. **You'll need to update the markup** wherever
the rotating quote widget renders, to use the new class name.

**3. `.comments-page` was used for two different pages.**
Public comment list/form vs. the admin moderation table both used
`.comments-page` as their outer wrapper. Didn't appear to cause a
visible bug (the two pages likely never render together), but it's
fragile. Renamed the admin one to `.admin-comments-page`. **Update
the admin comments page markup** to match.

**4. Duplicate CSS block in `gallery.css`.**
The image/hover rules for `.gallery-tile` were pasted twice, verbatim.
Removed the duplicate — no behavior change.

**5. Hardcoded colors in `admin.css` / `admin-comments.css`.**
Things like `#333`, `#4caf50`, `#f44336`, `red` were hardcoded instead
of using tokens, meaning the admin panel wouldn't follow brand colors
on a new site. Converted to token references in `admin-layout.css`,
`buttons.css`, and `badges.css`.

**6. `.site-banner` gradient had a hardcoded `#cfd6d6`.**
Moved to a new token, `--color-banner-fade`, in `core/tokens.css`.

## Not changed, but worth knowing about

- `home-slideshow`, `lightbox`, and `banner` components still use a
  few one-off hardcoded values (`#f8f8f8`, `#ccc`, drop-shadow rgba
  values). These aren't full conflicts, just not yet tokenized. Low
  priority — only worth fixing if a future site needs a noticeably
  different look for those pieces.
- If your build tool doesn't support CSS `@import` (or you want one
  bundled file for performance), `main.css` can be swapped for your
  bundler's own entry point — just keep the same import order: tokens
  → base → components → layout → features.
