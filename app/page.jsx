'use client';

import { useEffect, useRef, useState } from 'react';
import { rooms, money, houseGallery } from '../lib/content.mjs';
import Journey from '../components/Journey';
import { closeDialog } from '../lib/dialog-motion.mjs';

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
  const gallery = houseGallery;
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
  const close = () => closeDialog(dialog.current, () => { dialog.current.close(); setModal(null); });
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
    <Journey {...{ filter, setFilter, saved, toggleSaved, visibleRooms, ritual, setRitual, openStay, setModal, setGalleryIndex }} />

    <dialog ref={dialog} className={`modal ${modal?.type === 'gallery' ? 'gallery-modal' : ''} ${modal?.type === 'menu' ? 'menu-modal' : ''} ${modal?.type === 'room' ? 'room-modal' : ''} ${modal?.type === 'stay' ? 'stay-modal' : ''}`} aria-labelledby="modal-title" onCancel={e => { e.preventDefault(); close(); }} onClose={() => setModal(null)} onClick={e => { if (e.target === e.currentTarget) { const b = e.currentTarget.getBoundingClientRect(); if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) close(); } }} onKeyDown={e => { if (modal?.type === 'gallery' && e.key === 'ArrowRight') nextGallery(1); if (modal?.type === 'gallery' && e.key === 'ArrowLeft') nextGallery(-1); }}>
      <button className="modal-close" aria-label="Close dialog" onClick={close}>×</button>
      {modal?.type === 'menu' && <div className="menu-content"><img className="menu-backdrop" src="media/garden-pool.jpg" alt="" /><p className="eyebrow" id="modal-title">MAKE YOURSELF AT HOME</p>{[['00', 'The arrival', '#arrival'], ['01', 'Our story', '#story'], ['02', 'The rooms', '#rooms'], ['03', 'Slow living', '#rituals'], ['04', 'Your escape', '#stay']].map(([n, text, href]) => <a key={href} href={href} onClick={close}><small>{n}</small>{text}<Arrow /></a>)}<button className="pill-button" onClick={() => openStay()}>Plan your stay <Arrow /></button><p>UBUD, BALI · A SOFTER WAY TO STAY</p></div>}
      {modal?.type === 'gallery' && <><img className="gallery-photo" src={`media/${gallery[galleryIndex].image}`} alt={gallery[galleryIndex].caption} /><div className="gallery-controls"><button aria-label="Previous image" onClick={() => nextGallery(-1)}>←</button><div><h2 id="modal-title">{gallery[galleryIndex].caption}</h2><p>{galleryIndex + 1} / {gallery.length}</p></div><button aria-label="Next image" onClick={() => nextGallery(1)}>→</button></div></>}
      {modal?.type === 'room' && <div className="room-detail"><img src={`media/${modal.room.image}`} alt={modal.room.name} /><div className="detail-copy"><p className="eyebrow">{modal.room.type} / {modal.room.area} M² / UP TO {modal.room.guests} GUESTS</p><h2 id="modal-title">{modal.room.name}</h2><p>{modal.room.description}</p><ul>{modal.room.amenities.map(a => <li key={a}>{a}</li>)}</ul><a className="underlined-link detail-page-link" href={`/rooms/${modal.room.id}/`}>Explore the full room <Arrow /></a><div className="detail-bottom"><p><strong>{money(modal.room.price)}</strong> / night</p><button className="pill-button" onClick={() => openStay(modal.room.id)}>Choose this space <Arrow /></button></div></div></div>}
      {modal?.type === 'stay' && <div className="stay-content"><img className="stay-cover" src={`media/${selectedRoom.image}`} alt="" /><p className="eyebrow">A LITTLE SOMETHING TO LOOK FORWARD TO</p><h2 id="modal-title">{confirmation ? 'Your little escape.' : 'Make room for quiet.'}</h2><p className="stay-intro">{confirmation ? 'Your stay summary is ready. This is a demo; no reservation has been made.' : 'Imagine your stay. Choose a space and see how it feels.'}</p>{confirmation ? <div className="confirmation"><span className="confirmation-sun" aria-hidden="true">✳</span><h3>{selectedRoom.name}</h3><p>{checkIn} → {checkOut}</p><p>{nights} night{nights > 1 ? 's' : ''} · {guests} guest{guests > 1 ? 's' : ''}</p><strong>{money(nights * selectedRoom.price)}</strong><p>Illustrative total · Breakfast included</p><button className="pill-button" onClick={() => setConfirmation(false)}>Adjust your stay ↗</button></div> : <form onSubmit={submitStay}><label>Your space<select value={stayRoom} onChange={e => { setStayRoom(e.target.value); setError(''); }}>{rooms.map(r => <option key={r.id} value={r.id}>{r.name} — {money(r.price)} / night</option>)}</select></label><div className="date-fields"><label>Arrival<input type="date" required value={checkIn} min={today} onChange={e => setCheckIn(e.target.value)} /></label><label>Departure<input type="date" required value={checkOut} min={checkIn || today} onChange={e => setCheckOut(e.target.value)} /></label></div><label>Guests<select value={guests} onChange={e => setGuests(e.target.value)}>{[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}</select></label><div className="stay-estimate" aria-live="polite"><span>{nights > 0 ? `${nights} night${nights > 1 ? 's' : ''} · Estimated total` : 'From / per night'}</span><strong>{money(selectedRoom.price * (nights > 0 ? nights : 1))}</strong></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="pill-button" type="submit">Preview my stay <Arrow /></button><p className="demo-note">Demo only. No booking, payment, or personal details are collected.</p></form>}</div>}
    </dialog>
  </>;
}
