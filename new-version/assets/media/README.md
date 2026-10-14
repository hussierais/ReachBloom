# ReachBloom hero media

`hero-poster.jpg` is the supplied **AI-generated temporary cinematic poster**, not video footage or a real ReachBloom shopping location. It depicts young African shoppers and distinct independent vendor storefronts. Generated with the built-in image-generation tool; no video-generation tool was available. A full motion story has not been generated or claimed.

## Connect an actual film later

1. Produce or obtain licensed footage for the story below. Export a web-friendly MP4 using H.264, yuv420p, preferably without an audio track. Keep the file compact; a 1280×720 loop is a sensible starting point. An independently art-directed mobile crop can be added later if needed.
2. Save the **actual file** as `assets/media/reachbloom-arcade.mp4`.
3. In `index.html`, locate `id="hero-video"` and change only `data-video-src=""` to `data-video-src="assets/media/reachbloom-arcade.mp4"`.
4. Keep `autoplay muted loop playsinline` and the poster attributes. No JS or CSS change is required. Do not set the source until the file exists.
5. Run using Live Server, refresh, and check desktop/mobile plus reduced-motion mode. Test with the browser's network panel and playback controls.

`assets/js/hero.js` loads the configured film only when reduced motion is off. Playback is muted, inline and looping. A visible pause/play control is provided when a film is configured. Autoplay rejection keeps the poster and allows a manual start; load errors keep the poster. Reduced-motion preferences use the static poster and remove the video source, including when preferences change during a visit. Background tabs pause playback; returning resumes unless the visitor paused it. Autoplay is still subject to browser/device policy.

The delivered page has **no video source configured**, so it requests no missing film and makes no claim that a video exists. The hero visibly identifies the temporary AI poster. No test clips are included as promotional footage.

## Future film story brief

A realistic cinematic commercial inside a beautiful modern Nigerian shopping arcade with multiple clearly separate independent vendors. ReachBloom represents discovery across businesses, not one physical shop.

- A young African man and woman arrive looking for a laptop and a dress.
- They discover distinct laptop, dress, shoe, handbag, beauty, accessory and home-goods stalls, pleasantly surprised by the variety.
- They buy their intended items and explore other businesses.
- They stop to order food at an independent vendor.
- They leave happy with shopping bags; the woman calls a loved one to recommend the experience.
- Compose the action so the left side can hold legible heading/button overlays. Use a smooth start/end transition for a continuous loop. Avoid brands, fabricated real-business endorsements or text that portrays ReachBloom as a single shop.

## Poster generation prompt

Use case: ads-marketing. Asset type: photorealistic cinematic wide website hero poster, landscape 16:9. Create a realistic premium commercial still set inside a beautiful modern shopping arcade in Nigeria, showing multiple distinctly separate independent vendor stalls, NOT one department store and not one ReachBloom shop. On right-hand half foreground a stylish young adult African man and woman in their late twenties walking together, pleasantly surprised and smiling, carrying tasteful plain shopping bags; the man has a boxed laptop under one arm and the woman carries a clothing shopping bag with a dress visible on a nearby boutique mannequin. Background distinct open storefronts for laptop computers, dresses, shoes and handbags, beauty and accessories, home goods, and a small food counter with seated diners. Clear architecture, warm natural skylight, contemporary welcoming interiors, cinematic editorial photography, realistic anatomy, lifelike skin, tasteful teal and warm wood accents, rich realistic detail. Frame the couple mostly on the right, leave the left third as darker softly focused architectural space suitable for white website heading overlay. No text, no logos, no captions, no watermark. This is a single coherent cinematic scene, not a collage or storyboard. This still is a temporary poster, not a video.
