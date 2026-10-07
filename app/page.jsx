'use client';

import { useEffect, useRef, useState } from 'react';
import { rooms, rituals, money } from '../lib/content.mjs';

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function Home() {
  const [filter, setFilter] = useState('All rooms');
  const [saved, setSaved] = useState([]);
  const [ritual, setRitual] = useState(0);
  const [modal, setModal] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [stayRoom, setStayRoom] = useState('garden');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [confirmation, setConfirmation] = useState(false);
  const [error, setError] = useState('');
  const [today, setToday] = useState('');
  const dialog = useRef(null);
  const gallery = [{ image: 'retreat.jpg', caption: 'A softer pace, by the pool' }, ...rooms.map(r => ({ image: r.image, caption: r.name })), { image: 'ubud.jpg', caption: 'The green heart of Ubud' }];
  const selectedRoom = rooms.find(r => r.id === stayRoom);
  const nights = checkIn && checkOut ? Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 86400000) : 0;
  const visibleRooms = rooms.filter(r => filter === 'All rooms' || (filter === 'Saved' ? saved.includes(r.id) : r.type === filter));

  useEffect(() => {
    const d = new Date();
    setToday(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  }, []);
  useEffect(() => {
    if (modal && !dialog.current.open) dialog.current.showModal();
    if (!modal && dialog.current.open) dialog.current.close();
    document.body.style.overflow = modal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modal]);
  const close = () => setModal(null);
  const openStay = (id = 'garden') => { setStayRoom(id); setConfirmation(false); setError(''); setModal({ type: 'stay' }); };
  const toggleSaved = id => setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const nextGallery = n => setGalleryIndex(i => (i + n + gallery.length) % gallery.length);
  const submitStay = e => {
    e.preventDefault();
    if (!checkIn || !checkOut || nights < 1 || checkIn < today) return setError('Please choose a future arrival and a departure at least one night later.');
    if (Number(guests) > selectedRoom.guests) return setError(`This room welcomes up to ${selectedRoom.guests} guests. Choose a larger room or fewer guests.`);
    setError(''); setConfirmation(true);
  };

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="header">
      <a className="wordmark" href="#" aria-label="Sela House home">sela<span className="wordmark-dot">✳</span><small>HOUSE</small></a>
      <nav className="desktop-nav" aria-label="Main navigation"><a href="#story">Our story</a><a href="#rooms">The rooms</a><a href="#rituals">Slow living</a></nav>
      <div className="header-actions"><button className="text-button stay-link" onClick={() => openStay()}>Plan your stay <Arrow /></button><button className="menu-button" onClick={() => setModal({ type: 'menu' })}>Menu <span aria-hidden="true">☰</span></button></div>
    </header>

    <main id="main">
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-top"><p className="eyebrow"><span className="tiny-sun">✳</span> A BOUTIQUE HIDEAWAY IN UBUD, BALI</p><p className="edition">8°30′ S &nbsp; 115°15′ E</p></div>
        <div className="hero-heading-row"><h1 id="hero-heading">A little closer<br />to <em>quiet.</em></h1><div className="hero-note"><span className="line-art" aria-hidden="true">✳</span><p>Less hurry. More wonder.<br />A thoughtful little house in the<br />green heart of Bali.</p><a className="underlined-link" href="#rooms">Find your space <Arrow /></a></div></div>
        <div className="hero-photo"><img src="media/retreat.jpg" alt="A palm-lined swimming pool surrounded by tropical greenery and warm architecture" fetchPriority="high" /><div className="photo-caption"><span>ROOM TO BREATHE. SPACE TO BE.</span><button className="gallery-trigger" onClick={() => { setGalleryIndex(0); setModal({ type: 'gallery' }); }}>Explore the house <span aria-hidden="true">⊞</span></button></div><a href="#story" className="scroll-circle" aria-label="Discover our story">↓</a></div>
        <div className="hero-bottom"><span>A softer way to stay.</span><span>DESIGNED AROUND YOU, AND NOTHING ELSE.</span><span>SCROLL TO SLOW DOWN ↓</span></div>
      </section>

      <section className="story section" id="story" aria-labelledby="story-title"><div><p className="eyebrow">01 / THE SELA WAY</p><span className="story-symbol" aria-hidden="true">✳</span></div><div className="story-content"><h2 id="story-title">Some places ask you to do more.<br />We invite you to <em>just be.</em></h2><div className="story-copy"><p>Sela means a pause. A little space between one thing and the next. Tucked into Ubud's green landscape, our fictional boutique house is imagined as exactly that.</p><p>Natural textures. Thoughtful spaces. Mornings without an alarm. A place to settle in, feel at home, and rediscover the beauty of taking your time.</p></div><div className="values"><span>Rooted in nature</span><span>Made with intention</span><span>Yours to discover</span></div></div></section>

      <section className="rooms section" id="rooms" aria-labelledby="rooms-title"><div className="section-heading"><div><p className="eyebrow">02 / FIND YOUR SPACE</p><h2 id="rooms-title">Stay a little.<br /><em>Feel a lot.</em></h2></div><p className="section-note">Three ways to make yourself at home.<br />Each with a character all its own.</p></div>
        <div className="room-toolbar"><div className="filter-tabs" aria-label="Filter rooms">{['All rooms', 'Studio', 'Suite', 'Villa', 'Saved'].map(tab => <button key={tab} data-filter={tab} aria-pressed={filter === tab} className={filter === tab ? 'active' : ''} onClick={() => setFilter(tab)}>{tab}{tab === 'Saved' && saved.length > 0 ? ` (${saved.length})` : ''}</button>)}</div><span className="room-count" role="status" aria-live="polite">{String(visibleRooms.length).padStart(2, '0')} SPACES TO CALL YOUR OWN</span></div>
        <div className="room-grid">{visibleRooms.map((room, i) => <article className="room-card" key={room.id} data-room-id={room.id} data-room-type={room.type}>
          <div className="room-image"><button className="image-open" aria-label={`View ${room.name} details`} onClick={() => setModal({ type: 'room', room })}><img src={`media/${room.image}`} loading="lazy" alt={`${room.name}, an inviting hotel interior with natural textures`} /></button><span className="room-badge">{room.label}</span><button className={`save-button ${saved.includes(room.id) ? 'is-saved' : ''}`} aria-label={`${saved.includes(room.id) ? 'Unsave' : 'Save'} ${room.name}`} aria-pressed={saved.includes(room.id)} onClick={() => toggleSaved(room.id)}>{saved.includes(room.id) ? '♥' : '♡'}</button></div>
          <div className="room-meta"><span>0{rooms.indexOf(room) + 1} / {room.type.toUpperCase()}</span><span>{room.area} M² &nbsp; · &nbsp; {room.guests} GUESTS</span></div><div className="room-title-row"><h3>{room.name}</h3><button className="round-arrow" aria-label={`View ${room.name}`} onClick={() => setModal({ type: 'room', room })}><Arrow /></button></div><p className="room-price">From <strong>{money(room.price)}</strong><span> / night</span></p>
        </article>)}</div>
        {visibleRooms.length === 0 && <div className="empty-state"><span aria-hidden="true">♡</span><h3>A space worth keeping.</h3><p>Tap the heart on a room to save it here for this visit.</p><button className="underlined-link" onClick={() => setFilter('All rooms')}>Explore all rooms <Arrow /></button></div>}
        <p className="demo-note">An imagined retreat. All rooms, prices, and availability are illustrative.</p>
      </section>

      <section className="rituals section" id="rituals" aria-labelledby="rituals-title"><div className="ritual-image"><img src={`media/${rituals[ritual].image}`} loading="lazy" alt={rituals[ritual].title} /></div><div className="ritual-content"><p className="eyebrow">03 / THE ART OF DOING LESS</p><h2 id="rituals-title">Little rituals.<br /><em>Lasting feelings.</em></h2><p className="ritual-intro">The luxury of an unplanned day.<br />Fill it with whatever feels like you.</p><div className="ritual-tabs" aria-label="Explore experiences">{rituals.map((r, i) => <button key={r.title} data-ritual={i} aria-expanded={i === ritual} className={i === ritual ? 'active' : ''} onClick={() => setRitual(i)}><span className="ritual-category">{r.category}</span><span className="ritual-title">{r.title}<span aria-hidden="true">{i === ritual ? '−' : '+'}</span></span>{i === ritual && <span className="ritual-description">{r.description}</span>}</button>)}</div></div></section>

      <section className="journal-strip"><span>LESS HURRY</span><span aria-hidden="true">✳</span><span>MORE WONDER</span><span aria-hidden="true">✳</span><span>STAY PRESENT</span><span aria-hidden="true">✳</span></section>
      <section className="closing section"><p className="eyebrow">YOUR NEXT CHAPTER, A LITTLE SLOWER.</p><h2>Leave the everyday.<br /><em>Find your Sela.</em></h2><button className="pill-button" onClick={() => openStay()}>Let's plan your stay <Arrow /></button><p>A small escape. A big exhale.</p></section>
    </main>
    <footer className="footer"><div className="footer-top"><a href="#" className="wordmark footer-wordmark">sela<span>✳</span><small>HOUSE</small></a><p>An imagined home in Ubud, Bali.<br />A real invitation to slow down.</p><a href="#rooms">Explore the rooms ↗</a><a href="#rituals">Discover slow living ↗</a></div><div className="footer-bottom"><span>© 2026 SELA HOUSE · A FICTIONAL HOTEL</span><span>DESIGN EXPLORATION / HOTEL ROOM EXPLORER</span><a href="media/credits.txt" target="_blank" rel="noreferrer">Image credits ↗</a></div></footer>

    <dialog ref={dialog} className={`modal ${modal?.type === 'gallery' ? 'gallery-modal' : ''} ${modal?.type === 'menu' ? 'menu-modal' : ''}`} aria-labelledby="modal-title" onCancel={close} onClose={close} onClick={e => { if (e.target === e.currentTarget) { const b = e.currentTarget.getBoundingClientRect(); if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) close(); } }} onKeyDown={e => { if (modal?.type === 'gallery' && e.key === 'ArrowRight') nextGallery(1); if (modal?.type === 'gallery' && e.key === 'ArrowLeft') nextGallery(-1); }}>
      <button className="modal-close" aria-label="Close dialog" onClick={close}>×</button>
      {modal?.type === 'menu' && <div className="menu-content"><p className="eyebrow" id="modal-title">MAKE YOURSELF AT HOME</p>{[['01', 'Our story', '#story'], ['02', 'The rooms', '#rooms'], ['03', 'Slow living', '#rituals']].map(([n, text, href]) => <a key={href} href={href} onClick={close}><small>{n}</small>{text}<Arrow /></a>)}<button className="pill-button" onClick={() => openStay()}>Plan your stay <Arrow /></button><p>UBUD, BALI · A SOFTER WAY TO STAY</p></div>}
      {modal?.type === 'gallery' && <><img className="gallery-photo" src={`media/${gallery[galleryIndex].image}`} alt={gallery[galleryIndex].caption} /><div className="gallery-controls"><button aria-label="Previous image" onClick={() => nextGallery(-1)}>←</button><div><h2 id="modal-title">{gallery[galleryIndex].caption}</h2><p>{galleryIndex + 1} / {gallery.length}</p></div><button aria-label="Next image" onClick={() => nextGallery(1)}>→</button></div></>}
      {modal?.type === 'room' && <div className="room-detail"><img src={`media/${modal.room.image}`} alt={modal.room.name} /><div className="detail-copy"><p className="eyebrow">{modal.room.type} / {modal.room.area} M² / UP TO {modal.room.guests} GUESTS</p><h2 id="modal-title">{modal.room.name}</h2><p>{modal.room.description}</p><ul>{modal.room.amenities.map(a => <li key={a}>{a}</li>)}</ul><div className="detail-bottom"><p><strong>{money(modal.room.price)}</strong> / night</p><button className="pill-button" onClick={() => openStay(modal.room.id)}>Choose this space <Arrow /></button></div></div></div>}
      {modal?.type === 'stay' && <div className="stay-content"><p className="eyebrow">A LITTLE SOMETHING TO LOOK FORWARD TO</p><h2 id="modal-title">{confirmation ? 'Your little escape.' : 'Make room for quiet.'}</h2><p className="stay-intro">{confirmation ? 'Your stay summary is ready. This is a demo; no reservation has been made.' : 'Imagine your stay. Choose a space and see how it feels.'}</p>{confirmation ? <div className="confirmation"><span className="confirmation-sun" aria-hidden="true">✳</span><h3>{selectedRoom.name}</h3><p>{checkIn} → {checkOut}</p><p>{nights} night{nights > 1 ? 's' : ''} · {guests} guest{guests > 1 ? 's' : ''}</p><strong>{money(nights * selectedRoom.price)}</strong><p>Illustrative total · Breakfast included</p><button className="pill-button" onClick={() => setConfirmation(false)}>Adjust your stay ↗</button></div> : <form onSubmit={submitStay}><label>Your space<select value={stayRoom} onChange={e => { setStayRoom(e.target.value); setError(''); }}>{rooms.map(r => <option key={r.id} value={r.id}>{r.name} — {money(r.price)} / night</option>)}</select></label><div className="date-fields"><label>Arrival<input type="date" required value={checkIn} min={today} onChange={e => setCheckIn(e.target.value)} /></label><label>Departure<input type="date" required value={checkOut} min={checkIn || today} onChange={e => setCheckOut(e.target.value)} /></label></div><label>Guests<select value={guests} onChange={e => setGuests(e.target.value)}>{[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}</select></label><div className="stay-estimate" aria-live="polite"><span>{nights > 0 ? `${nights} night${nights > 1 ? 's' : ''} · Estimated total` : 'From / per night'}</span><strong>{money(selectedRoom.price * (nights > 0 ? nights : 1))}</strong></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="pill-button" type="submit">Preview my stay <Arrow /></button><p className="demo-note">Demo only. No booking, payment, or personal details are collected.</p></form>}</div>}
    </dialog>
  </>;
}
