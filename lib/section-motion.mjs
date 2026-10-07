// Shared scroll entrances for React and the directly openable HTML pages.
export function createSectionMotion() {
  const shell = document.querySelector('.journey-shell');
  if (!shell || !window.IntersectionObserver || !Element.prototype.animate) return () => {};
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const items = new Map();
  let disposed = false;
  let pointerFocus = false;
  const selector = [
    '.title-line', 'h1:not(#hero-heading)', 'h2', '.eyebrow', '.hero-sub',
    '.gallery-trigger', '.hero-next', '.story-copy', '.story-inset', '.image-footnote',
    '.underlined-link', '.room-toolbar', '.room-card', '.demo-note', '.ritual-tabs',
    '.closing-flower', '.closing-note', '.pill-button', '.space-heading > p',
    '.space-hero-label', '.space-facts > span', '.space-description', '.space-story figure',
    '.photo-mosaic > button', '.amenity-list > p', '.stay-editorial > p',
    '.stay-editorial > img', '.stay-editorial > span', '.space-booking',
    '.space-notes details', '.related-card',
  ].join(',');

  function settle(item, state = 'settled') {
    const animation = item.animation;
    item.animation = null;
    animation?.cancel();
    item.node.dataset.motionState = state;
  }
  function enter(item) {
    if (disposed || !item.visible || item.played || document.documentElement.dataset.intro) return;
    item.played = true;
    if (preference.matches || item.node.contains(document.activeElement)) { settle(item, 'static'); return; }
    const distance = shell.clientWidth < 600 ? 16 : 28;
    let frames, duration = 950;
    if (item.kind === 'line') {
      frames = [
        { opacity: 0, transform: 'translate3d(0,108%,0)', filter: 'blur(5px)' },
        { opacity: 1, transform: 'translate3d(0,0,0)', filter: 'blur(0px)' },
      ];
      duration = 1500;
    } else if (item.kind === 'photo') {
      frames = [{ opacity: .65, scale: '1.045' }, { opacity: 1, scale: '1' }];
      duration = 1800;
    } else {
      frames = [
        { opacity: 0, transform: `translate3d(0,${distance}px,0) scale(${item.kind === 'card' ? '.985' : '1'})`, filter: 'blur(2px)' },
        { opacity: 1, transform: 'translate3d(0,0,0) scale(1)', filter: 'blur(0px)' },
      ];
      if (item.kind === 'heading' || item.kind === 'card') duration = 1200;
    }
    item.node.dataset.motionState = 'playing';
    const animation = item.target.animate(frames, {
      duration, delay: item.delay, easing: 'cubic-bezier(.22,.75,.25,1)', fill: 'backwards',
    });
    item.animation = animation;
    animation.finished.then(() => {
      if (item.animation === animation) {
        item.animation = null; item.node.dataset.motionState = item.visible ? 'settled' : 'waiting';
        if (!item.visible) item.played = false;
      }
    }, () => {});
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const item = items.get(entry.target);
      if (!item) continue;
      if (!entry.isIntersecting) {
        item.visible = false;
        // The entrance itself can briefly move a low caption outside the viewport.
        if (item.animation) continue;
        item.played = false;
        settle(item, 'waiting');
      } else if (entry.intersectionRatio >= .12) {
        item.visible = true;
        enter(item);
      }
    }
  }, { root: shell, threshold: [0, .12] });

  function refresh() {
    if (disposed) return;
    const candidates = [...shell.querySelectorAll(selector)].filter(node => node.closest('.journey-panel'));
    const selected = new Set(candidates);
    // Animate cards/form blocks together; avoid nesting multiple entrance transforms.
    const roots = candidates.filter(node => {
      for (let parent = node.parentElement; parent && parent !== shell; parent = parent.parentElement) {
        if (selected.has(parent)) return false;
      }
      return true;
    });
    const photos = [...shell.querySelectorAll('.hero-photo > img, .story-photo > img, .ritual-image > img, .panel-backdrop > img, .space-hero > img')];
    const current = new Set([...roots, ...photos]);
    for (const [node, item] of items) {
      if (!current.has(node)) {
        settle(item); observer.unobserve(node); items.delete(node);
        delete node.dataset.motionKind; delete node.dataset.motionState;
      }
    }
    const ranks = new Map();
    for (const node of current) {
      const panel = node.closest('.journey-panel');
      const rank = ranks.get(panel) || 0;
      const kind = photos.includes(node) ? 'photo' : node.matches('.title-line') ? 'line' :
        node.matches('.room-card, .related-card, .photo-mosaic > button, .space-story figure, .space-booking') ? 'card' :
        node.matches('h1, h2') ? 'heading' : 'content';
      if (kind !== 'photo') ranks.set(panel, rank + 1);
      if (items.has(node)) continue;
      const line = kind === 'line' ? [...node.parentElement.querySelectorAll('.title-line')].indexOf(node) : 0;
      const delay = kind === 'line' ? 100 + line * 160 : kind === 'photo' || node.matches('.eyebrow') ? 0 : Math.min(rank * 65, 390);
      const item = { node, target: kind === 'line' ? node.firstElementChild : node, kind, delay, visible: false, played: false, animation: null };
      node.dataset.motionKind = kind;
      node.dataset.motionState = 'waiting';
      items.set(node, item);
      observer.observe(node);
    }
  }
  function onPreference() {
    if (preference.matches) for (const item of items.values()) { item.played = true; settle(item, 'static'); }
  }
  function onFocus(event) {
    // Mouse focus must not move a button between pointer-down and its click.
    if (pointerFocus) return;
    for (const item of items.values()) if (item.node.contains(event.target)) { item.played = true; settle(item); }
  }
  const onPointerDown = () => { pointerFocus = true; };
  const onPointerEnd = () => { pointerFocus = false; };
  const intro = new MutationObserver(() => { if (!document.documentElement.dataset.intro) items.forEach(enter); });
  intro.observe(document.documentElement, { attributes: true, attributeFilter: ['data-intro'] });
  const content = new MutationObserver(records => {
    if (records.some(r => [...r.addedNodes, ...r.removedNodes].some(n => n.nodeType === 1))) refresh();
  });
  content.observe(shell, { childList: true, subtree: true });
  shell.dataset.sectionMotion = 'enabled';
  preference.addEventListener('change', onPreference);
  shell.addEventListener('focusin', onFocus);
  shell.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('pointerup', onPointerEnd, true);
  document.addEventListener('pointercancel', onPointerEnd, true);
  document.addEventListener('keydown', onPointerEnd, true);
  refresh();
  return () => {
    disposed = true; observer.disconnect(); intro.disconnect(); content.disconnect();
    preference.removeEventListener('change', onPreference); shell.removeEventListener('focusin', onFocus);
    shell.removeEventListener('pointerdown', onPointerDown, true);
    document.removeEventListener('pointerup', onPointerEnd, true);
    document.removeEventListener('pointercancel', onPointerEnd, true);
    document.removeEventListener('keydown', onPointerEnd, true);
    for (const item of items.values()) {
      settle(item); delete item.node.dataset.motionKind; delete item.node.dataset.motionState;
    }
    items.clear(); delete shell.dataset.sectionMotion;
  };
}
