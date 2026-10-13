# ReachBloom

A complete static frontend adapted from the supplied HTML5 UP Multiverse project.

## Open on a Mac
1. Extract the ZIP and open the `business-directory` folder in VS Code.
2. Right-click `index.html` in Finder and choose Open With → your browser. No server, install or build is required.
3. Optionally use VS Code's Live Server extension and choose **Open with Live Server** on `index.html` for automatic refresh while editing.

## Files and architecture
- `index.html`: discovery page, three semantic gallery tiles, search, categories, About and footer.
- `stores/`: three independent, fully rendered storefront HTML pages. These remain accessible without JavaScript.
- `assets/css/reachbloom.css`: shared responsive styles, with per-store accent colours.
- `assets/js/reachbloom.js`: vanilla DOM filtering. Name, category, description and location are stored on cards as `data-search`; each search word must match, and the selected category is combined with the search.
- `images/reachbloom/`: original local SVG illustrations for offerings; no remote image dependencies.
- `original-template/index.html`: unchanged supplied homepage for reference. To preview it, copy it to the project root under a different filename so its original relative paths resolve.
- Original template CSS, scripts, fonts, photos, Sass, README.txt and LICENSE.txt are retained unchanged.

The original `.thumb` / `.image` gallery structure is adapted into real storefront anchors. The old Poptrox and main.js scripts are retained but not loaded: their lightbox intercepts gallery links and their panel/header code conflicts with accessible native navigation. The new page uses its own stylesheet to transform the supplied gallery into a discovery interface. The original contact form was removed because this scope has no backend.

## Editing
Add a static card to the homepage with `data-category` and `data-search`, a matching category button, and an independent page in `stores/`. Add new local illustrations as needed. Update the initial count and explanatory copy when adding businesses. Product content lives in each storefront; shared styles live in one CSS file. No package manager or framework is needed.

## Manual check
- Search `bloom`, `tailoring`, `food`, `Wi-Fi` and `networking`.
- Select Technology while searching `tailoring`: no matches. Clear the search: only Brightleaf Tech appears. Reset filters: all three return.
- Search an unknown term and use Show all businesses.
- Open every tile, inspect all three offerings and follow Back to all businesses.
- Resize the browser to phone and tablet widths; tab through controls and links.
- Disable JavaScript: storefront navigation and all content still work; filtering is unavailable with an explanatory notice.

## Scope and attribution
All businesses and prices are fictional demonstration content; illustrations are not product photographs. No checkout, booking, authentication, enquiry sending, database or dashboard is implemented. HTML5 UP attribution is visible on every page. Original CCA 3.0 licence is preserved in LICENSE.txt; original photo credits remain in README.txt.
