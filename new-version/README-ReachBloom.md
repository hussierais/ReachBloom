# ReachBloom — cinematic discovery frontend

Where businesses reach further and bloom.

This extends the existing ReachBloom repository at commit `1a3f8dc3cbd8ec4263f6dafe4010ed88c1e1af26`. Its original palette, typography, homepage sections, gallery cards, storefront paths, illustrations and HTML5 UP attribution remain. No framework, build step or application dependency was added.

## Run on your Mac

1. Extract the complete project and open its `ReachBloom` folder in VS Code.
2. Install VS Code's **Live Server** extension if needed.
3. Right-click `index.html` → **Open with Live Server**.
4. Keep using the same browser and server address for every page. Browser data is tied to the origin, so changing the hostname or port creates a separate demo workspace.

Alternatively, if Python 3 is installed, run `python3 -m http.server 8000` from the project folder and open `http://localhost:8000`.

Use a local server for this version. Opening `file://` files directly may give each page separate browser storage and is no longer a supported way to test the connected workflows. The earlier static version worked directly from Finder; coordinated applications, claims and sessions need a shared origin.

## Demo accounts

Use **fictional data only**. All demo accounts use the deliberately public passphrase **BloomDemo!**. Do not enter a real password. The passphrase is never stored or sent to a server.

| Role | Entry | Demo account |
| --- | --- | --- |
| Customer | `login.html` | `customer@example.com` |
| Business owner | `login.html` | `owner@example.com` |
| Administrator | `admin-demo.html` | `reviewer@example.com` |

The shared login offers only Customer and Business Owner. The selected account type communicates intent; the account record determines the actual role. Customers go directly to `index.html#discover` after login; owners and administrators go to their respective dashboards. The customer dashboard remains available through the account link on other pages. A mismatch produces a helpful dashboard message. Entering the administrator alias on shared login does not grant administrator access.

The separate administrator entry is an openly documented **simulation**, not a protected production portal. Every dashboard displays this limitation. Registration creates a synthetic `alias@example.com` account in this browser; it does not verify email or establish a real account. New owners receive no access to other listings automatically.

## Try the full journey

`demo-guide.html` contains the same walkthrough and a two-step reset control.

1. Log in as the owner. Open **List Your Business**, enter fictional details and submit. Optional PNG/JPG/WebP images preview locally, with a 400 KB limit per image.
2. The application receives a unique RB reference and **Pending Review** status. It appears in the owner's workspace and is absent from public discovery and direct storefront viewing.
3. Prepare the profile and add, edit or remove sample offerings in the owner workspace. An optional price can be left blank.
4. Log out; use `admin-demo.html` and inspect the application details, images, contact fields, offerings and history. Approve it.
5. The public directory now displays the business. Its link opens the generic independent storefront at `stores/business.html?id=...`. Existing storefront URLs remain unchanged.
6. Suspend the listing with a reason. It disappears from search, categories, location filters, saved/recent customer views and direct public storefronts. Reactivation restores it.
7. Try **Request changes** or **Reject** on another pending application. The owner sees feedback and can edit and resubmit for review. Owners cannot approve or reactivate their own records.
8. As owner, open the unassigned Savanna Kitchen storefront and choose **Claim This Business**. Submit a fictional explanation. Pending claims grant no management access. The administrator approves or rejects the claim and records a simulated verification explanation. Approval assigns the listing; rejection leaves it unassigned.
9. As customer, save an approved storefront and visit the customer dashboard for saved and recently viewed businesses.
10. Reset via `demo-guide.html` to restore all fictional starter records and clear demo accounts, applications, sessions, claims and saved businesses.

The initial owner workspace includes Draft, Pending Review, Changes Requested, Rejected and Suspended examples, plus the approved Bloom & Stitch business. Administrator-created listings can be added directly as Approved, unassigned records. Every public view filters on `status === 'Approved'`.

## Architecture and changed files

- **Modified:** `index.html`: expanded native navigation, location and extra category filters; approved-only cards use the existing layout. Hero and About design retained.
- **Modified:** `stores/bloom-and-stitch.html`, `stores/savanna-kitchen.html`, `stores/brightleaf-tech.html`: established paths retained, shared rendering adds publication checks, contacts, hours, saves and claims.
- **Modified:** `assets/css/reachbloom.css`: original rules retained; shared form/dashboard/responsive styles appended.
- **Modified:** `assets/js/reachbloom.js`: retains word-based search and combined category filtering, adds location, shared initialization and approved-only rendering.
- **Added:** `assets/js/demo-seed.js`: extracted fictional starter storefront content, local illustration paths and sample account-independent business data.
- **Added:** `assets/js/demo-model.js`: shared state, role/ownership checks, status transitions, claims, products, history and persistence. No network calls.
- **Added:** `assets/js/demo-ui.js`: reusable form controls, validation, previews, dashboard and storefront rendering. User-entered text is HTML escaped.
- **Added:** `list-business.html`, `login.html`, `register.html`, `customer-dashboard.html`, `owner-dashboard.html`, `admin-dashboard.html`, `admin-demo.html`, `claim-business.html`, `demo-guide.html`, `stores/business.html`.
- **Added:** repeatable checks in `tests/`, plus `BACKEND-REQUIREMENTS.md` and `CHANGELOG.md`.
- **Updated:** this file and `VERIFICATION.md`.
- **Removed:** no existing files. Original Multiverse CSS, JS, Sass, fonts, photos, README.txt, LICENSE.txt and original-template/index.html remain unchanged. Poptrox is still retained but not loaded on the active site, so storefront anchors navigate normally.

Data is stored under `reachbloom.demo.v2` in localStorage; the signed-in synthetic account ID is stored under `reachbloom.session.v2` in sessionStorage. Passwords are not stored. Browser quota failures report an error without committing a partial change. Data is local, editable, unencrypted and disposable; never enter personal, confidential or production data. Separate browsers/devices do not share state. Public directory and customer/storefront views refresh on storage events; dashboards can be reloaded after another tab changes a record.

Static fallback storefront markup is retained, but active public content requires JavaScript to check approval state. With JavaScript disabled, a notice is shown instead of stale public listings.

## Recovery and applying changes to your GitHub checkout

The latest hero update uses branch `feature/cinematic-hero` with recovery branch `checkpoint/before-cinematic-hero` at `a2fb4f2` (the connected frontend). The earlier `checkpoint/frontend-before-workflows` still preserves the original version. The delivered history bundle preserves both branches. No changes were pushed to GitHub.

To use the supplied patch in your existing ReachBloom checkout:

```bash
git status --short
# If there are edits, commit or stash them first.
git switch -c feature/cinematic-hero
git apply --check /path/to/ReachBloom-expansion.patch
git apply /path/to/ReachBloom-expansion.patch
```

The latest supplied patch is based on connected-frontend commit `a2fb4f210d840cd6bc11ee1589bc15ca0e46e7c9`. If your checkout has changed, do not force it; use the complete ZIP as a reference and review the differences. You can also clone the bundled history into a new folder:

```bash
git clone /path/to/ReachBloom-history.bundle ReachBloom-recovered
```

## Testing

See `VERIFICATION.md` for performed tests and remaining limits. `node tests/workflows.cjs` runs model checks without dependencies. `python3 tests/check-links.py` checks static references. Optional integration/browser tests require test-only jsdom or Playwright; the application itself still requires no packages.

## Limitations and future backend

There is no real authentication, email verification/recovery, remote saving, identity verification, checkout, payment, booking, dashboard security or contact sending. Sample emails use example.com; fictional contact details are displayed without active telephone/email/WhatsApp actions. No real statistics or reviews are claimed. An administrator approval is only a browser-state change; an approved claim establishes no legal ownership.

See `BACKEND-REQUIREMENTS.md` before making this production-ready. The server must enforce authorization independently of these demo controls.

## Attribution

Adapted from Multiverse by HTML5 UP (html5up.net / @ajlkn). Original CCA 3.0 licence remains in LICENSE.txt, with visible attribution on every active page. Original photo credits remain in README.txt.

## Cinematic homepage update

The homepage now has the requested “Discover More. Shop Beyond.” heading and supporting copy over a realistic, AI-generated poster showing African shoppers among separate arcade vendors. The exact four-link homepage navigation is Home, About, Login and Sign Up. About is a same-page smooth-scroll link; reduced-motion users get immediate scrolling. Explore Businesses targets the directory, and List Your Business targets the existing owner application page. The About copy explains the discovery platform rather than a single physical shop.

No video-generation tool or existing video was available. **The current hero is a static temporary poster, not a generated film.** It is labelled on the homepage. The complete future-video integration is in `assets/js/hero.js`; no missing video file is requested. Connect a real video only after supplying it, following `assets/media/README.md`. That file includes the exact replacement steps, the requested full film story, poster provenance and final image-generation prompt.

Latest changed files: `index.html`, `assets/css/reachbloom.css` (appended hero styles), `assets/js/demo-ui.js` (customer login destination only, plus message wording), test/documentation files. Added: `assets/js/hero.js`, `assets/media/hero-poster.jpg`, `assets/media/README.md`, `tests/hero.cjs`. No existing files were deleted. The approval/ownership model in `assets/js/demo-model.js` is unchanged.
