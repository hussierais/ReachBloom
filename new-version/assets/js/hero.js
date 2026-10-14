/* Optional local hero film. Empty configuration means a real poster, never a missing request. */
(() => {
  'use strict';
  const video = document.querySelector('#hero-video');
  if (!video) return;
  const button = document.querySelector('#hero-video-toggle');
  const status = document.querySelector('#hero-media-status');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const source = video.dataset.videoSrc.trim();
  let userPaused = false;
  let failed = false;

  function showPoster(text) {
    video.hidden = true;
    status.textContent = text;
  }
  function updateButton() {
    button.textContent = video.paused ? 'Play video' : 'Pause video';
    button.setAttribute('aria-label', video.paused ? 'Play promotional video' : 'Pause promotional video');
  }
  async function play() {
    if (!source || failed || motion.matches || document.hidden || userPaused) return;
    try {
      video.muted = true;
      video.defaultMuted = true;
      await video.play();
    } catch (error) {
      // A late rejected play promise must not overwrite a load-error or reduced-motion fallback.
      if (failed || motion.matches) return;
      showPoster('Poster shown · Select Play video to start');
      updateButton();
    }
  }
  function configure() {
    if (!source) {
      showPoster('AI-generated poster · Temporary video visual');
      button.hidden = true;
      return;
    }
    if (motion.matches) {
      video.pause();
      video.removeAttribute('src');
      video.load();
      showPoster('Static poster · Reduced motion');
      button.hidden = true;
      return;
    }
    if (failed) return;
    button.hidden = false;
    if (!video.getAttribute('src')) {
      video.src = source;
      video.preload = 'metadata';
    }
    play();
  }
  video.addEventListener('playing', () => {
    if (motion.matches) { configure(); return; }
    video.hidden = false;
    status.textContent = 'Discover independent businesses';
    updateButton();
  });
  video.addEventListener('pause', updateButton);
  video.addEventListener('error', () => {
    // load() without a source during reduced-motion changes is intentional.
    if (!video.getAttribute('src')) return;
    failed = true;
    showPoster('Poster shown · Video unavailable');
    button.hidden = true;
  });
  button.addEventListener('click', () => {
    if (video.paused) { userPaused = false; play(); }
    else { userPaused = true; video.pause(); updateButton(); }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
    else play();
  });
  motion.addEventListener('change', configure);
  configure();
})();
