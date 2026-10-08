# Aventine — Lobby + Navbar Pass

Based directly on the original uploaded project, not either earlier redesign/polish version.

## Open
Extract the complete ZIP. Open hotel/index.html or hotel/hotel_m.html, preferably with VS Code Live Server. Internet is required for the original CDN scripts and media.

## This pass changes only
1. Lobby: after the original entrance, scrolling slowly moves and zooms out the photo, sweeps a soft warm light across it, gently shifts the copy and advances a thin gold line. Scrolling back reverses these effects.
2. Navbar: the selection pill is positioned within the navigation group and sized to the selected tab. Desktop/mobile links, Reserve and sidebar follow the rendered section. Click destinations now use actual timeline markers, including the longer dining chapter. Select Room uses that same corrected Reserve destination.

The original sunset animation values and its scroll distance are preserved. The loader, theme, original stylesheet, other sections and widgets retain their original implementation. This is a scoped iteration, not a complete bug-fix pass.

## Source
- hotel_m.css: original file, unchanged.
- lobby_nav.css: new lobby and navbar styling.
- hotel_gsap.js: lobby chapter, timeline section markers and corresponding active state.
- hotel_m.js: navbar sizing/state and navigation destinations.
- index.html / hotel_m.html: matching entry files with the small lobby overlay additions.
- original-backup/: untouched uploaded source.

## Check this pass
Let the loader finish, scroll through the entire sunset, then reach the Lobby. Continue slowly: watch the image drift, zoom and light sweep. Reverse scroll to compare. Click Arrival, Lobby, Suites and Reserve; verify the highlighted tab follows the visible section.

## Validation and limits
Run `node tests/timing.cjs` from this folder. Schedule-model checks pass for unchanged sunset animation values and scroll distance, added lobby duration, all seven markers, and forward/reverse active states. JavaScript syntax and local asset references were checked. These tests do not render GSAP. The supplied recording was visually inspected; this updated version has not been browser-rendered in this environment.

## Portal removal
The enlarged image between sunset and Lobby has been removed. Lobby now rises directly over the sunset while the title fades. The actual Lobby photo and its parallax remain. Sunset animation values and scroll speed are unchanged.

## Ambient Climate widget removal
Removed the bottom-left Ambient Climate controls from both entry pages.

## Night moon update
Choose the moon icon in the navbar. The navy sky shows stars and a waxing crescent that becomes half then full moon during the opening scroll. It fades as Lobby enters. Reverse scroll reverses the phase. Switching themes retains scroll position. This is a decorative sequence, not a live astronomical phase. Reduced-motion mode displays a full moon without travel. Browser visual verification remains pending; phase geometry and timing tests pass.

## Soft ambient audio
Replaced the external SoundHelix song with an original locally generated 48-second stereo ambient loop: slow pads and gentle bell notes, without vocals or drums. The WAV is bundled under hotel/assets and starts only via the existing sound button at 25% volume. Keep the assets folder when copying the site.
