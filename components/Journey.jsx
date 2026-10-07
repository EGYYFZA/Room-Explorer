'use client';

import { useEffect } from 'react';
import { createJourney } from '../lib/journey.mjs';
import { createSectionMotion } from '../lib/section-motion.mjs';
import { rooms, rituals, money } from '../lib/content.mjs';
import BrandMark from './BrandMark';

export default function Journey({ filter, setFilter, saved, toggleSaved, visibleRooms, ritual, setRitual, openStay, setModal, setGalleryIndex }) {
  useEffect(() => { const journey = createJourney(); const motion = createSectionMotion(); return () => { motion(); journey(); }; }, []);

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <nav className="site-topbar" aria-label="Sela House navigation">
    <a className="floating-brand" href="#arrival" aria-label="Sela House home"><BrandMark /></a>
    <button className="menu-button floating-menu" aria-label="Menu" aria-haspopup="dialog" onClick={() => setModal({ type: 'menu' })}><span className="menu-lines" aria-hidden="true"><i /><i /><i /></span></button>
    </nav>

    <main id="main" className="journey-shell" tabIndex={-1}>
      <div className="journey-sticky"><div className="journey-track">
        <section className="journey-panel hero" id="arrival" data-chapter="The arrival" aria-labelledby="hero-heading">
          <div className="hero-content"><p className="eyebrow reveal">UBUD, BALI / A BOUTIQUE HIDEAWAY</p><h1 id="hero-heading"><span className="title-line"><span>A little{' '}</span></span><span className="title-line"><span>closer to{' '}</span></span><span className="title-line"><em>quiet.</em></span></h1><div className="hero-sub reveal"><p>Less hurry. More wonder. A thoughtful little house in the green heart of Bali.</p></div><span className="hero-caption">A SOFTER WAY TO STAY.</span></div>
          <div className="hero-photo"><img src="media/garden-pool.jpg" alt="A beautiful tropical hotel surrounded by palms and a turquoise swimming pool" fetchPriority="high" data-parallax /><div className="hero-photo-shade" /><button className="gallery-trigger" onClick={() => { setGalleryIndex(0); setModal({ type: 'gallery' }); }}><span className="gallery-icon" aria-hidden="true">⊞</span><span>Explore the house</span><span aria-hidden="true">↗</span></button></div>
          <a className="hero-next" href="#story"><span>SCROLL TO DISCOVER</span><span aria-hidden="true">→</span></a>
        </section>

        <section className="journey-panel story" id="story" data-chapter="The Sela way" aria-labelledby="story-title"><div className="story-photo"><img src="media/garden.jpg" alt="A warm room opening onto a lush private garden" loading="lazy" data-parallax /><div className="story-inset"><img src="media/lounge.jpg" alt="A sunlit lounge with warm textures" loading="lazy" /></div><span className="image-footnote">NATURAL TEXTURES. THOUGHTFUL SPACES.</span></div><div className="story-content"><p className="eyebrow reveal">01 / THE SELA WAY</p><h2 id="story-title" className="reveal">A pause.<br />A place.<br /><em>A little Sela.</em></h2><div className="story-copy reveal"><p>Sela means a pause. A little space between one thing and the next. Our fictional boutique house in Ubud is imagined as exactly that.</p><p>Mornings without an alarm. A garden at your door. A place to settle in and rediscover the beauty of taking your time.</p></div><a className="underlined-link animated-link reveal" href="#rooms">Find your space <span aria-hidden="true">↗</span></a><span className="story-symbol" aria-hidden="true">✳</span></div></section>

        <section className="journey-panel rooms" id="rooms" data-chapter="Your space" aria-labelledby="rooms-title"><div className="panel-backdrop"><img src="media/retreat.jpg" alt="" loading="lazy" data-parallax /></div><div className="section-heading"><div><p className="eyebrow reveal">02 / FIND YOUR SPACE</p><h2 id="rooms-title" className="reveal">Stay a little. <em>Feel a lot.</em></h2></div><p className="section-note reveal">Three spaces. Three ways<br />to make yourself at home.</p></div><div className="room-toolbar"><div className="filter-tabs" aria-label="Filter rooms">{['All rooms', 'Studio', 'Suite', 'Villa', 'Saved'].map(tab => <button key={tab} data-filter={tab} aria-pressed={filter === tab} className={filter === tab ? 'active' : ''} onClick={() => setFilter(tab)}>{tab}{tab === 'Saved' && saved.length > 0 ? ` (${saved.length})` : ''}</button>)}</div><span className="room-count" role="status" aria-live="polite">{String(visibleRooms.length).padStart(2, '0')} SPACES TO CALL YOUR OWN</span></div>
          <div className="room-grid">{visibleRooms.map(room => <article className="room-card" key={room.id} data-room-id={room.id} data-room-type={room.type}><div className="room-image"><button className="image-open" aria-label={`View ${room.name} details`} onClick={() => setModal({ type: 'room', room })}><img src={`media/${room.image}`} loading="lazy" alt={`${room.name}, an inviting space with warm natural textures`} /></button><span className="room-badge">{room.label}</span><button className={`save-button ${saved.includes(room.id) ? 'is-saved' : ''}`} aria-label={`${saved.includes(room.id) ? 'Unsave' : 'Save'} ${room.name}`} aria-pressed={saved.includes(room.id)} onClick={() => toggleSaved(room.id)}>{saved.includes(room.id) ? '♥' : '♡'}</button></div><div className="room-meta"><span>0{rooms.indexOf(room) + 1} / {room.type.toUpperCase()}</span><span>{room.area} M² · {room.guests} GUESTS</span></div><div className="room-title-row"><h3><a href={`/rooms/${room.id}/`} aria-label={`Explore ${room.name}`}>{room.name}</a></h3><button className="round-arrow" aria-label={`View ${room.name}`} onClick={() => setModal({ type: 'room', room })}><span aria-hidden="true">↗</span></button></div><p className="room-price">From <strong>{money(room.price)}</strong><span> / night</span></p></article>)}</div>
          {visibleRooms.length === 0 && <div className="empty-state"><span aria-hidden="true">♡</span><h3>A space worth keeping.</h3><p>Tap the heart on a room to save it here for this visit.</p><button className="underlined-link" onClick={() => setFilter('All rooms')}>Explore all rooms <span aria-hidden="true">↗</span></button></div>}
          <p className="demo-note">AN IMAGINED RETREAT. ROOMS AND PRICES ARE ILLUSTRATIVE.</p>
        </section>

        <section className="journey-panel rituals" id="rituals" data-chapter="Slow living" aria-labelledby="rituals-title"><div className="ritual-image"><img key={ritual} src={`media/${rituals[ritual].image}`} loading="lazy" alt={rituals[ritual].title} data-parallax /><span className="image-footnote">THE LUXURY OF AN UNPLANNED DAY.</span></div><div className="ritual-content"><p className="eyebrow reveal">03 / THE ART OF DOING LESS</p><h2 id="rituals-title" className="reveal">Little rituals.<br /><em>Lasting feelings.</em></h2><div className="ritual-tabs reveal" aria-label="Explore experiences">{rituals.map((r, i) => <button key={r.title} data-ritual={i} aria-expanded={i === ritual} className={i === ritual ? 'active' : ''} onClick={() => setRitual(i)}><span className="ritual-category">{r.category}</span><span className="ritual-title">{r.title}<span aria-hidden="true">{i === ritual ? '−' : '+'}</span></span>{i === ritual && <span className="ritual-description">{r.description}</span>}</button>)}</div></div></section>

        <section className="journey-panel closing" id="stay" data-chapter="Your escape" aria-labelledby="closing-title"><div className="panel-backdrop"><img src="media/bali-landscape.jpg" alt="A peaceful coastal temple at sunset in Bali" loading="lazy" data-parallax /></div><p className="eyebrow reveal">04 / YOUR NEXT CHAPTER, A LITTLE SLOWER</p><span className="closing-flower" aria-hidden="true">✳</span><h2 id="closing-title" className="reveal">Leave the everyday.<br /><em>Find your Sela.</em></h2><button className="pill-button reveal" onClick={() => openStay()}>Let's plan your stay <span aria-hidden="true">↗</span></button><p className="closing-note reveal">A small escape. A big exhale.</p></section>
      </div></div>
    </main>
  </>;
}
