// Shared by the React route and its directly openable HTML companion.
export function createRoomExperience(room, dismiss = el => el.close()) {
  const root = document.querySelector('.room-page');
  if (!root) return;
  const $ = s => root.querySelector(s);
  const listeners = [];
  const on = (el, type, fn) => { el.addEventListener(type, fn); listeners.push(() => el.removeEventListener(type, fn)); };
  const money = n => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
  const dialog = $('[data-room-dialog]');
  const menu = $('[data-room-menu]');
  const menuToggle = $('[data-room-menu-toggle]');
  let menuFocus;
  on(menuToggle, 'click', () => { menuFocus = document.activeElement; menu.showModal(); document.body.style.overflow = 'hidden'; });
  on($('[data-room-menu-close]'), 'click', () => dismiss(menu));
  on(menu, 'cancel', e => { e.preventDefault(); dismiss(menu); });
  on(menu, 'close', () => { document.body.style.overflow = ''; menuFocus?.focus({ preventScroll: true }); });
  menu.querySelectorAll('a').forEach(link => on(link, 'click', () => dismiss(menu)));
  const photos = [...root.querySelectorAll('[data-room-photo]')];
  let index = 0;
  let previousFocus;
  function showPhoto(i) {
    index = (i + photos.length) % photos.length;
    const thumb = photos[index];
    $('[data-large-photo]').src = thumb.querySelector('img').src;
    $('[data-large-photo]').alt = thumb.dataset.caption;
    $('#room-photo-title').textContent = thumb.dataset.caption;
    $('[data-photo-count]').textContent = `${index + 1} / ${photos.length}`;
    if (!dialog.open) { previousFocus = document.activeElement; dialog.showModal(); document.body.style.overflow = 'hidden'; }
  }
  photos.forEach((photo, i) => on(photo, 'click', () => showPhoto(i)));
  on($('[data-open-photos]'), 'click', () => showPhoto(0));
  on($('[data-close-photos]'), 'click', () => dismiss(dialog));
  on(dialog, 'cancel', e => { e.preventDefault(); dismiss(dialog); });
  on($('[data-photo-prev]'), 'click', () => showPhoto(index - 1));
  on($('[data-photo-next]'), 'click', () => showPhoto(index + 1));
  on(dialog, 'keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); showPhoto(index + (e.key === 'ArrowRight' ? 1 : -1)); } });
  on(dialog, 'close', () => { document.body.style.overflow = ''; previousFocus?.focus({ preventScroll: true }); });
  on(dialog, 'click', e => { if (e.target === dialog) { const b = dialog.getBoundingClientRect(); if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) dismiss(dialog); } });
  const form = $('[data-room-form]');
  const arrival = form.elements.arrival;
  const departure = form.elements.departure;
  const guests = form.elements.guests;
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  arrival.min = departure.min = today;
  const nights = () => Math.round((Date.parse(departure.value) - Date.parse(arrival.value)) / 86400000);
  function update() {
    const n = nights();
    departure.min = arrival.value || today;
    $('[data-night-label]').textContent = n > 0 ? `${n} night${n > 1 ? 's' : ''} · Estimated total` : 'From / per night';
    $('[data-room-total]').textContent = money(room.price * (n > 0 ? n : 1));
    $('[data-room-error]').hidden = true;
  }
  on(form, 'input', update);
  on(form, 'submit', e => {
    e.preventDefault();
    const n = nights();
    const error = $('[data-room-error]');
    if (!arrival.value || !departure.value || arrival.value < today || !(n > 0) || Number(guests.value) < 1 || Number(guests.value) > room.guests) {
      error.textContent = 'Choose a future arrival, a departure at least one night later, and guests within this room’s capacity.';
      error.hidden = false;
      return;
    }
    $('[data-confirm-summary]').textContent = `${room.name} · ${arrival.value} → ${departure.value} · ${n} night${n > 1 ? 's' : ''} · ${guests.value} guest${Number(guests.value) > 1 ? 's' : ''}`;
    $('[data-confirm-total]').textContent = money(n * room.price);
    form.hidden = true;
    $('[data-room-confirmation]').hidden = false;
    $('[data-room-confirmation]').focus({ preventScroll: true });
  });
  on($('[data-adjust-stay]'), 'click', () => { $('[data-room-confirmation]').hidden = true; form.hidden = false; arrival.focus({ preventScroll: true }); });
  update();
  return () => { listeners.forEach(remove => remove()); if (dialog.open) dialog.close(); if (menu.open) menu.close(); document.body.style.overflow = ''; };
}
