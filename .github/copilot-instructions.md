# Copilot Instructions for AI Agents

## Project Overview
This project is a static HTML/CSS/JS web application for managing a school uniform business. It includes pages for billing, dashboard, home, inventory, login, profile, schools, signup, and students. The structure is duplicated under a `free/` subdirectory, likely for demo or alternate access.

## Key Structure
- Main HTML files are in the root and in `free/`.
- Shared assets are in `assets/`, `css/`, `image/`, and `js/` directories.
- Stylesheets: `style.css` (root, `css/`, and `free/css/`).
- Scripts: `js/script.js` and `free/js/script.js`.

## Patterns & Conventions
- All navigation and UI logic is handled client-side; there is no backend code.
- Duplicate structure in `free/` suggests a parallel version (possibly for unauthenticated/demo users).
- Use relative paths for linking assets (e.g., `css/style.css`, `js/script.js`).
- Images are stored in `image/` and referenced with relative paths.
- No build system or package manager is present; edit files directly.

## Developer Workflows
- **Edit HTML/CSS/JS directly.** No build or test commands are required.
- **Preview:** Open any HTML file in a browser to view changes.
- **Debug:** Use browser dev tools for inspecting layout, styles, and JS errors.

## Project-Specific Notes
- Keep the structure of `free/` in sync with the root if making global UI changes.
- When adding new pages, update both root and `free/` directories as needed.
- Avoid introducing backend dependencies; this is a static site.
- Use consistent naming for new assets and scripts.

## Key Files & Directories
- `dashboard.html`, `inventory.html`, etc.: Main UI pages
- `style.css`, `css/style.css`, `free/css/style.css`: Stylesheets
- `js/script.js`, `free/js/script.js`: JavaScript logic
- `image/`, `assets/`: Static assets

## Example: Adding a New Page
1. Create `newpage.html` in the root and `free/`.
2. Add any new styles to `css/style.css` and `free/css/style.css`.
3. Add scripts to `js/script.js` and `free/js/script.js` if needed.
4. Link assets using relative paths.

---

For questions or unclear conventions, review existing files for examples or ask for clarification.
