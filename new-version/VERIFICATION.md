# Verification — connected ReachBloom frontend

Validated the implementation against the clean repository at commit `1a3f8dc3cbd8ec4263f6dafe4010ed88c1e1af26`.

## Checks actually run

| Check | Result |
| --- | --- |
| Node syntax checks on shared JavaScript | Passed |
| `node tests/workflows.cjs` | Passed: fixed account roles, invalid login and inputs, application draft/submission, owner isolation, forbidden owner approvals, review feedback/resubmission, approval/rejection/suspension/reactivation, direct administrator listing, claims approval/rejection, product create/edit/remove, favourites/recent, reload, quota failure and reset |
| `python3 tests/check-links.py` | Passed: internal file paths, fragment targets and unique static IDs on 14 active HTML pages |
| Optional jsdom integration suite | Passed: 12 page types, scripts and dynamic rendering, no runtime exceptions, unique rendered IDs, search/category/location and form validation |
| Real Chromium 153 + Playwright suite | Passed: connected browser journey, search/categories/location, each original storefront, application validation/image preview, role mismatch routing and admin denial through shared login, offerings, application review/change request/resubmission/rejection, suspension/reactivation, claim approval, registration, customer save/recent views and reset |
| Browser page/console/HTTP errors | None recorded in the final browser suite |
| Images on active rendered pages | All loaded in the final browser suite |
| Responsive browser checks | No horizontal overflow at 1440×1000, 768×1024 or 390×844 on the active public/authentication pages and each dashboard under its matching role |
| Visual inspection | Desktop and mobile homepage screenshots and mobile owner workspace inspected; established ReachBloom layout retained |
| Original template asset comparison | Existing photos, SVGs, Sass, fonts, licence, README.txt, original-template and legacy template CSS/JS remain byte-identical to the original repository commit |

The browser suite found an invalid modern HTML `pattern` character class in registration. The pattern and optional phone pattern were corrected, and the full suite passed afterwards. Initial test harness failures selecting the wrong seeded application or multiple buttons were corrected; they were test-selector errors, not unaddressed application failures.

The earlier Chromium downloader failed. A test-only Chromium build was subsequently made available and real browser tests were successfully completed. No browser or testing package is added as an application dependency.

## Repeat tests

No app install is needed. From the project folder:

```bash
node tests/workflows.cjs
python3 tests/check-links.py
```

Optional integration checks need test-only dependencies installed somewhere outside the project:

```bash
npm install --prefix /tmp/reachbloom-tests jsdom playwright
NODE_PATH=/tmp/reachbloom-tests/node_modules node tests/dom.cjs
NODE_PATH=/tmp/reachbloom-tests/node_modules /tmp/reachbloom-tests/node_modules/.bin/playwright install chromium
NODE_PATH=/tmp/reachbloom-tests/node_modules node tests/browser.cjs
```

Each integration suite starts and stops its own temporary local HTTP server. `CHROMIUM_EXECUTABLE` can specify an existing Chromium executable. Browser screenshots used for verification are temporary and are not part of the deliverable.

## Remaining limits

- Only Chromium was used for real browser testing. Safari, Firefox and physical iOS/Android devices were not tested.
- Viewport checks demonstrate responsive CSS, not a complete accessibility audit. Native labels, focus outlines, semantic controls and keyboard-operable details are provided, but no screen-reader audit was performed.
- State isolation and publication checks are browser simulations; no server security or persistence has been tested or claimed.
- Browser storage can be blocked or cleared and has size limits. Save failures are handled. File URLs are not supported for the connected demo; use a local server.
- Claim verification, recovery, contact sending, account creation and administrator approval are not real services.
- JavaScript is required to load public approval state and dashboards. Stale static storefront content stays hidden when JavaScript is disabled.

See README-ReachBloom.md for the exact demo journey and BACKEND-REQUIREMENTS.md for server enforcement requirements.

## Latest update: cinematic homepage and customer directory landing

The current update continues commit `a2fb4f2` and preserves the existing application/claim model byte-for-byte.

Actually rerun:

- Node workflow suite: passed; roles, ownership isolation, approval transitions, rejected/suspended hiding, claims, offerings and persistence checks remain green.
- Static path/fragment checks on all 14 active HTML pages: passed.
- jsdom page integration suite: passed. The test environment supplies a matchMedia stub; real media preferences are checked in Chromium.
- Complete Chromium connected journey: passed, updated to assert customers land at `index.html#discover`, while owner/admin destinations remain unchanged. Also checks product-name search (`Everyday tote`). No page/console/asset errors in that suite.
- New `tests/hero.cjs`: passed hero text, exact Home/About/Login/Sign Up navigation, same-page About/Explore links, application CTA, poster loading, no video request with empty configuration, and the native autoplay/muted/loop/playsinline flags.
- Hero playback was tested with a real, temporary two-second WebM fixture generated by ffmpeg **only for testing**. It is not supplied as promotional video. Playback advanced; pause/play worked; initial and changed reduced-motion preferences removed the source and prevented film requests; autoplay denial retained a manual-play poster; an invalid film retained the poster; the no-JavaScript hero remained visible.
- Hero and connected pages checked at 1440×1000, 768×1024 and 390×844; no horizontal overflow. Desktop and mobile hero screenshots visually inspected.
- Testing caught a playback-promise timing issue which could overwrite a media-load error message. The controller now preserves load-error and reduced-motion fallback states; the hero suite passed after the fix.

The delivered page contains an AI-generated static poster, no configured video source and no promotional video file. Actual narrative film content, final-film encoding/quality and real iOS/Safari autoplay remain untested because no such film was available and Safari was not used.

To rerun the optional hero suite after installing test-only Playwright, run `node tests/hero.cjs` with the same NODE_PATH/CHROMIUM_EXECUTABLE setup as the other browser suite. ffmpeg must be available, or set FFMPEG to its executable path. The test starts its own local server and removes its temporary film afterwards.
