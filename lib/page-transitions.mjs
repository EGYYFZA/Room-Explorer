// A small curtain transition works for both Next.js routes and file:// pages.
export function createPageTransitions() {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  let introTimer;
  let navigating = false;
  const reset = () => { clearTimeout(timer); navigating = false; delete document.documentElement.dataset.leaving; };
  const finishIntro = () => {
    clearTimeout(introTimer);
    delete document.documentElement.dataset.intro;
    document.querySelector('.journey-shell')?.removeAttribute('inert');
    document.querySelectorAll('.floating-menu, .floating-brand').forEach(el => el.removeAttribute('inert'));
  };
  function follow(event) {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || link.download || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, location.href);
    if (!['http:', 'https:', 'file:'].includes(url.protocol) || url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search) || (!url.pathname.endsWith('/') && !url.pathname.endsWith('.html'))) return;
    if (motion.matches) return;
    event.preventDefault();
    if (navigating) return;
    navigating = true;
    document.documentElement.dataset.leaving = 'true';
    timer = setTimeout(() => location.assign(url.href), 340);
  }
  reset();
  const navigation = performance.getEntriesByType('navigation')[0];
  const landing = document.querySelector('#arrival');
  const intro = landing && navigation?.type !== 'back_forward' && (!location.hash || navigation?.type === 'reload');
  if (intro) {
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    document.querySelector('.journey-shell')?.scrollTo({ left: 0, top: 0, behavior: 'instant' });
    if (!motion.matches) {
      document.documentElement.dataset.intro = 'active';
      document.querySelector('.journey-shell')?.setAttribute('inert', '');
      document.querySelectorAll('.floating-menu, .floating-brand').forEach(el => el.setAttribute('inert', ''));
      introTimer = setTimeout(finishIntro, 2800);
    }
  }
  document.addEventListener('click', follow);
  window.addEventListener('pageshow', reset);
  const onMotion = () => { if (motion.matches) finishIntro(); };
  motion.addEventListener('change', onMotion);
  return () => { reset(); finishIntro(); document.removeEventListener('click', follow); window.removeEventListener('pageshow', reset); motion.removeEventListener('change', onMotion); };
}
