// Shared native horizontal viewport: mouse wheel, touch, keyboard and anchors.
export function createJourney() {
  const shell = document.querySelector('.journey-shell');
  const track = shell?.querySelector('.journey-track');
  if (!track) return () => {};
  const panels = [...track.querySelectorAll('.journey-panel')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let max = 0, target = 0, current = 0, frame = 0, lastTime = 0;
  let active = -1, previousWidth = 0, disposed = false;
  const clamp = n => Math.max(0, Math.min(n, max));
  function render() {
    const width = shell.clientWidth;
    shell.dataset.scrollMode = 'horizontal';
    shell.dataset.progress = String(Math.round(shell.scrollLeft / Math.max(1, max) * 100));
    let best = 0;
    panels.forEach((panel, i) => {
      const left = panel.offsetLeft - shell.scrollLeft;
      const right = left + panel.offsetWidth;
      if (left <= width / 2 && right > width / 2) best = i;
      if (left < width * .9 && right > width * .1) panel.classList.add('is-revealed');
      panel.querySelectorAll('[data-parallax]').forEach(img => {
        const shift = motion.matches ? 0 : Math.max(-1, Math.min(1, left / width)) * 7;
        img.style.transform = motion.matches ? '' : `translate3d(${shift}%,0,0) scale(1.16)`;
      });
    });
    active = best;
    shell.dataset.chapter = panels[best]?.dataset.chapter || '';
    panels.forEach((panel, i) => panel.dataset.active = String(i === best));
  }
  function stop() { cancelAnimationFrame(frame); frame = 0; lastTime = 0; current = target = shell.scrollLeft; }
  function tick(time) {
    if (disposed) return;
    const delta = lastTime ? Math.min(time - lastTime, 64) : 16;
    lastTime = time;
    current = motion.matches ? target : current + (target - current) * (1 - Math.exp(-delta / 115));
    if (Math.abs(target - current) < .3) current = target;
    shell.scrollLeft = current;
    render();
    if (Math.abs(target - current) >= .3) frame = requestAnimationFrame(tick);
    else { frame = 0; lastTime = 0; }
  }
  function measure() {
    const width = shell.clientWidth;
    max = Math.max(0, shell.scrollWidth - width);
    if (previousWidth && previousWidth !== width && active >= 0) shell.scrollLeft = clamp(panels[active].offsetLeft);
    previousWidth = width;
    current = target = clamp(shell.scrollLeft);
    render();
  }
  function navigate(id, updateUrl = true) {
    const element = document.getElementById(id);
    const panel = element?.closest('.journey-panel');
    if (!panel || !track.contains(panel)) return;
    stop();
    const inset = Math.min(48, shell.clientWidth * .06);
    const left = element === panel ? panel.offsetLeft : shell.scrollLeft + element.getBoundingClientRect().left - shell.getBoundingClientRect().left - inset;
    shell.scrollTo({ left: clamp(left), top: 0, behavior: motion.matches ? 'instant' : 'smooth' });
    if (updateUrl) history.replaceState(null, '', `#${id}`);
  }
  function onClick(event) {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const id = link.getAttribute('href').slice(1);
    if (id === shell.id) { event.preventDefault(); navigate(panels[0].id); shell.focus({ preventScroll: true }); return; }
    const element = document.getElementById(id);
    if (!element || !track.contains(element)) return;
    event.preventDefault(); navigate(id);
  }
  function onKey(event) {
    if (document.documentElement.dataset.intro) return;
    if (document.querySelector('dialog[open]') || /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(event.target.tagName) || event.target.isContentEditable) return;
    if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) return;
    event.preventDefault();
    const next = Math.max(0, Math.min(panels.length - 1, active + (event.key === 'ArrowRight' ? 1 : -1)));
    navigate(panels[next].id);
  }
  function onWheel(event) {
    if (document.documentElement.dataset.intro) { event.preventDefault(); return; }
    if (event.ctrlKey || document.querySelector('dialog[open]')) return;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    // Long content remains readable on unusually short windows.
    const inner = event.target.closest('[data-panel-content]');
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX) && inner && inner.scrollHeight > inner.clientHeight + 2) {
      if ((delta > 0 && inner.scrollTop + inner.clientHeight < inner.scrollHeight - 2) || (delta < 0 && inner.scrollTop > 0)) return;
    }
    event.preventDefault();
    if (!frame) current = target = shell.scrollLeft;
    const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? shell.clientWidth : 1;
    target = clamp(target + delta * scale);
    if (!frame) frame = requestAnimationFrame(tick);
  }
  function onScroll() {
    if (document.documentElement.dataset.intro && shell.scrollLeft !== 0) { stop(); shell.scrollLeft = 0; }
    if (!frame) current = target = shell.scrollLeft;
    render();
  }
  function onHash() { navigate(location.hash.slice(1), false); }
  function onFocus(event) {
    if (document.documentElement.dataset.intro) return;
    if (document.querySelector('dialog[open]') || !track.contains(event.target)) return;
    const box = event.target.getBoundingClientRect();
    if (box.left < 0 || box.right > shell.clientWidth) {
      stop(); shell.scrollTo({ left: clamp(shell.scrollLeft + box.left - shell.clientWidth * .06), behavior: motion.matches ? 'instant' : 'smooth' });
    }
  }
  shell.addEventListener('scroll', onScroll, { passive: true });
  shell.addEventListener('wheel', onWheel, { passive: false });
  shell.addEventListener('pointerdown', stop, { passive: true });
  window.addEventListener('resize', measure);
  window.addEventListener('hashchange', onHash);
  document.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);
  document.addEventListener('focusin', onFocus);
  motion.addEventListener('change', render);
  const observer = new ResizeObserver(measure);
  observer.observe(shell); observer.observe(track);
  measure();
  const initial = requestAnimationFrame(() => { if (location.hash && !document.documentElement.dataset.intro) onHash(); });
  document.fonts?.ready.then(() => { if (!disposed) measure(); });
  return () => {
    disposed = true; stop(); cancelAnimationFrame(initial); observer.disconnect();
    shell.removeEventListener('scroll', onScroll); shell.removeEventListener('wheel', onWheel); shell.removeEventListener('pointerdown', stop);
    window.removeEventListener('resize', measure); window.removeEventListener('hashchange', onHash);
    document.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); document.removeEventListener('focusin', onFocus);
    motion.removeEventListener('change', render);
  };
}
