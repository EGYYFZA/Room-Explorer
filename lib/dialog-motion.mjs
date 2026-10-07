// Keep content mounted until the closing animation has completed.
export function closeDialog(dialog, after = () => dialog.close()) {
  if (!dialog?.open || dialog.dataset.closing) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { after(); return; }
  dialog.dataset.closing = 'true';
  const menu = dialog.classList.contains('menu-modal');
  const toggle = document.querySelector('.floating-menu');
  const box = toggle?.getBoundingClientRect();
  const x = box ? box.left + box.width / 2 : innerWidth - 50;
  const y = box ? box.top + box.height / 2 : 50;
  const animation = dialog.animate(menu ? [
    { clipPath: getComputedStyle(dialog).clipPath },
    { clipPath: `circle(0px at ${x}px ${y}px)` },
  ] : [
    { opacity: 1, transform: 'translateY(0) scale(1)' },
    { opacity: 0, transform: 'translateY(14px) scale(.97)' },
  ], { duration: menu ? 700 : 240, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' });
  animation.finished.catch(() => {}).then(() => {
    delete dialog.dataset.closing;
    after();
    animation.cancel();
  });
}
