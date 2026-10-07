'use client';
import { useEffect } from 'react';
import { createPageTransitions } from '../lib/page-transitions.mjs';
import BrandMark from './BrandMark';
export default function PageTransitions() {
  useEffect(() => createPageTransitions(), []);
  return <><div className="page-wipe" aria-hidden="true" /><div className="splash-screen" aria-hidden="true"><div className="splash-brand"><BrandMark /><i /></div></div></>;
}
