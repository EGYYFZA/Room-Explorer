import { notFound } from 'next/navigation';
import { rooms } from '../../../lib/content.mjs';
import RoomExperience from '../../../components/RoomExperience';

export const dynamicParams = false;
export function generateStaticParams() { return rooms.map(room => ({ id: room.id })); }
export async function generateMetadata({ params }) {
  const { id } = await params;
  const room = rooms.find(r => r.id === id);
  return { title: room ? `${room.name} — Sela House` : 'Room not found', description: room?.description };
}
export default async function RoomPage({ params }) {
  const { id } = await params;
  const room = rooms.find(r => r.id === id);
  if (!room) notFound();
  return <RoomExperience room={room} />;
}
