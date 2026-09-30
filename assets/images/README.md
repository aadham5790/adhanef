# Image Assets

## Current placeholders
- `assets/images/projects/*.svg` — project thumbnails and full-size placeholders
- `assets/images/blog/*.svg` — blog cover placeholders
- `assets/images/social-icons.svg` — shared icon sprite

## Expected real-image layout
When adding real photography or raster images, use this structure so the existing responsive-image code keeps working:

- `assets/images/projects/<id>-<slug>.jpg`
  - Recommended sizes: 600w, 1200w
  - Use `.webp` when possible for smaller payloads

- `assets/images/blog/<id>-<slug>.jpg`
  - Recommended sizes: 800w, 1200w
  - Use `.webp` when possible for smaller payloads

## Responsive image behavior
- `js/projects.js` builds `srcset` from `thumb` + `full`
- `js/blog.js` builds `srcset` from `cover`
- `index.html` previews can be upgraded to real `<img srcset>` the same way
- Container sizing is controlled in `css/pages/*.css`

## Notes
- Keep filenames lowercase and hyphen-separated
- Keep `alt` text descriptive for accessibility
- Avoid very large files; prefer optimized formats and reasonable dimensions
