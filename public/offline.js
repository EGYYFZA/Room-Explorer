// Direct-open companion. The main application uses React; this adapter keeps
// the exported learning artifact interactive even under file://.
(() => {
  const { rooms, rituals, houseGallery } = window.SELA;
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const money = value => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  const media = file => `public/media/${file}`;
  const dialog = $('dialog');
  const dismiss = () => window.closeSelaDialog(dialog);
  const saved = new Set();
  let filter = 'All rooms';
  let lastFocus;
  let galleryIndex = 0;
  let currentType;
  const gallery = houseGallery;
  const arrow = '<span aria-hidden="true">↗</span>';
  const closeButton = '<button class="modal-close" aria-label="Close dialog">×</button>';

  function open(type, content) {
    if (!dialog.open) lastFocus = document.activeElement;
    currentType = type;
    dialog.className = 'modal' + (type === 'gallery' ? ' gallery-modal' : type === 'menu' ? ' menu-modal' : type === 'room' ? ' room-modal' : type === 'stay' ? ' stay-modal' : '');
    dialog.innerHTML = closeButton + content;
    $('.modal-close', dialog).onclick = dismiss;
    if (!dialog.open) dialog.showModal();
    $('.modal-close', dialog).focus();
    document.body.style.overflow = 'hidden';
  }
  dialog.addEventListener('cancel', e => { e.preventDefault(); dismiss(); });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; lastFocus?.focus(); });
  dialog.addEventListener('click', e => {
    if (e.target !== dialog) return;
    const b = dialog.getBoundingClientRect();
    if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) dismiss();
  });
  dialog.addEventListener('keydown', e => {
    if (currentType !== 'gallery') return;
    if (e.key === 'ArrowRight') showGallery(1);
    if (e.key === 'ArrowLeft') showGallery(-1);
  });

  function updateRooms() {
    let count = 0;
    $$('.room-card').forEach(card => {
      const visible = filter === 'All rooms' || (filter === 'Saved' ? saved.has(card.dataset.roomId) : card.dataset.roomType === filter);
      card.style.display = visible ? '' : 'none';
      if (visible) count++;
      const save = $('.save-button', card);
      const isSaved = saved.has(card.dataset.roomId);
      save.classList.toggle('is-saved', isSaved);
      save.setAttribute('aria-pressed', String(isSaved));
      save.setAttribute('aria-label', `${isSaved ? 'Unsave' : 'Save'} ${rooms.find(r => r.id === card.dataset.roomId).name}`);
      save.textContent = isSaved ? '♥' : '♡';
    });
    $$('.filter-tabs button').forEach(b => {
      b.classList.toggle('active', b.dataset.filter === filter);
      b.setAttribute('aria-pressed', String(b.dataset.filter === filter));
      if (b.dataset.filter === 'Saved') b.textContent = saved.size ? `Saved (${saved.size})` : 'Saved';
    });
    $('.room-count').textContent = `${String(count).padStart(2, '0')} SPACES TO CALL YOUR OWN`;
    $('.empty-state')?.remove();
    if (!count) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.innerHTML = `<span aria-hidden="true">♡</span><h3>A space worth keeping.</h3><p>Tap the heart on a room to save it here for this visit.</p><button class="underlined-link">Explore all rooms ${arrow}</button>`;
      $('.room-grid').after(empty);
      $('button', empty).onclick = () => { filter = 'All rooms'; updateRooms(); };
    }
  }
  $$('.filter-tabs button').forEach(b => b.onclick = () => { filter = b.dataset.filter; updateRooms(); });
  $$('.room-card').forEach(card => {
    const room = rooms.find(r => r.id === card.dataset.roomId);
    $('.save-button', card).onclick = () => { saved.has(room.id) ? saved.delete(room.id) : saved.add(room.id); updateRooms(); };
    $$('.image-open, .round-arrow', card).forEach(b => b.onclick = () => showRoom(room));
  });
  function showRoom(r) {
    open('room', `<div class="room-detail"><img src="${media(r.image)}" alt="${r.name}"><div class="detail-copy"><p class="eyebrow">${r.type} / ${r.area} M² / UP TO ${r.guests} GUESTS</p><h2 id="modal-title">${r.name}</h2><p>${r.description}</p><ul>${r.amenities.map(a => `<li>${a}</li>`).join('')}</ul><a class="underlined-link detail-page-link" href="room-pages/${r.id}.html">Explore the full room ${arrow}</a><div class="detail-bottom"><p><strong>${money(r.price)}</strong> / night</p><button class="pill-button">Choose this space ${arrow}</button></div></div></div>`);
    $('.pill-button', dialog).onclick = () => showStay(r.id);
  }
  function showGallery(step = 0) {
    galleryIndex = (galleryIndex + step + gallery.length) % gallery.length;
    const g = gallery[galleryIndex];
    open('gallery', `<img class="gallery-photo" src="${media(g.image)}" alt="${g.caption}"><div class="gallery-controls"><button aria-label="Previous image">←</button><div><h2 id="modal-title">${g.caption}</h2><p>${galleryIndex + 1} / ${gallery.length}</p></div><button aria-label="Next image">→</button></div>`);
    $('[aria-label="Previous image"]', dialog).onclick = () => showGallery(-1);
    $('[aria-label="Next image"]', dialog).onclick = () => showGallery(1);
  }
  $('.gallery-trigger').onclick = () => { galleryIndex = 0; showGallery(); };
  $$('[data-ritual]').forEach(b => b.onclick = () => {
    const current = Number(b.dataset.ritual);
    const r = rituals[current];
    $('.ritual-image img').src = media(r.image);
    $('.ritual-image img').alt = r.title;
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) $('.ritual-image img').animate([{ opacity: .5, filter: 'blur(4px)' }, { opacity: 1, filter: 'blur(0)' }], { duration: 800, easing: 'ease-out' });
    $$('[data-ritual]').forEach(tab => {
      const index = Number(tab.dataset.ritual);
      tab.classList.toggle('active', index === current);
      tab.setAttribute('aria-expanded', String(index === current));
      $('.ritual-title>span', tab).textContent = index === current ? '−' : '+';
      $('.ritual-description', tab)?.remove();
      if (index === current) { const p = document.createElement('span'); p.className = 'ritual-description'; p.textContent = r.description; tab.append(p); }
    });
  });
  function showStay(id = 'garden', values = {}) {
    const date = new Date();
    const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    open('stay', `<div class="stay-content"><img class="stay-cover" src="${media(rooms.find(r => r.id === id).image)}" alt=""><p class="eyebrow">A LITTLE SOMETHING TO LOOK FORWARD TO</p><h2 id="modal-title">Make room for quiet.</h2><p class="stay-intro">Imagine your stay. Choose a space and see how it feels.</p><form><label>Your space<select name="room">${rooms.map(r => `<option value="${r.id}">${r.name} — ${money(r.price)} / night</option>`).join('')}</select></label><div class="date-fields"><label>Arrival<input type="date" name="arrival" min="${today}" required></label><label>Departure<input type="date" name="departure" min="${today}" required></label></div><label>Guests<select name="guests">${[1,2,3,4].map(n => `<option value="${n}">${n} guest${n > 1 ? 's' : ''}</option>`).join('')}</select></label><div class="stay-estimate" aria-live="polite"><span>From / per night</span><strong></strong></div><p class="form-error" role="alert" hidden></p><button class="pill-button" type="submit">Preview my stay ${arrow}</button><p class="demo-note">Demo only. No booking, payment, or personal details are collected.</p></form></div>`);
    const form = $('form', dialog);
    form.elements.room.value = id;
    form.elements.guests.value = values.guests || '2';
    form.elements.arrival.value = values.arrival || '';
    form.elements.departure.value = values.departure || '';
    const details = () => ({ room: rooms.find(r => r.id === form.elements.room.value), nights: Math.round((Date.parse(form.elements.departure.value) - Date.parse(form.elements.arrival.value)) / 86400000), guests: Number(form.elements.guests.value), arrival: form.elements.arrival.value, departure: form.elements.departure.value });
    const estimate = () => {
      const d = details();
      $('.stay-cover', dialog).src = media(d.room.image);
      $('.stay-estimate span', form).textContent = d.nights > 0 ? `${d.nights} night${d.nights > 1 ? 's' : ''} · Estimated total` : 'From / per night';
      $('.stay-estimate strong', form).textContent = money(d.room.price * (d.nights > 0 ? d.nights : 1));
      form.elements.departure.min = d.arrival || today;
    };
    form.oninput = estimate; estimate();
    form.onsubmit = e => {
      e.preventDefault();
      const d = details();
      const error = $('.form-error', form);
      if (!d.arrival || !d.departure || d.nights < 1 || d.arrival < today || d.guests > d.room.guests) {
        error.hidden = false;
        error.textContent = d.guests > d.room.guests ? `This room welcomes up to ${d.room.guests} guests. Choose a larger room or fewer guests.` : 'Please choose a future arrival and a departure at least one night later.';
        return;
      }
      open('stay', `<div class="stay-content"><img class="stay-cover" src="${media(d.room.image)}" alt=""><p class="eyebrow">A LITTLE SOMETHING TO LOOK FORWARD TO</p><h2 id="modal-title">Your little escape.</h2><p class="stay-intro">Your stay summary is ready. This is a demo; no reservation has been made.</p><div class="confirmation"><span class="confirmation-sun" aria-hidden="true">✳</span><h3>${d.room.name}</h3><p>${d.arrival} → ${d.departure}</p><p>${d.nights} night${d.nights > 1 ? 's' : ''} · ${d.guests} guest${d.guests > 1 ? 's' : ''}</p><strong>${money(d.room.price * d.nights)}</strong><p>Illustrative total · Breakfast included</p><button class="pill-button">Adjust your stay ↗</button></div></div>`);
      $('.pill-button', dialog).onclick = () => showStay(d.room.id, d);
    };
  }
  $$('.stay-link, .closing .pill-button').forEach(b => b.onclick = () => showStay());
  $('.menu-button').onclick = () => {
    open('menu', `<div class="menu-content"><img class="menu-backdrop" src="${media('garden-pool.jpg')}" alt=""><p class="eyebrow" id="modal-title">MAKE YOURSELF AT HOME</p>${[['00','The arrival','#arrival'],['01','Our story','#story'],['02','The rooms','#rooms'],['03','Slow living','#rituals'],['04','Your escape','#stay']].map(([n,t,h]) => `<a href="${h}"><small>${n}</small>${t}${arrow}</a>`).join('')}<button class="pill-button">Plan your stay ${arrow}</button><p>UBUD, BALI · A SOFTER WAY TO STAY</p></div>`);
    $$('a', dialog).forEach(a => a.onclick = dismiss);
    $('.pill-button', dialog).onclick = () => showStay();
  };
})();
