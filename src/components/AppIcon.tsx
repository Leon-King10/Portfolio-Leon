import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import type { AppDefinition } from '../data/apps';

type Props = { app: AppDefinition; onClick: () => void; dock?: boolean; active?: boolean };
export function AppIcon({ app, onClick, dock, active }: Props) {
  const Icon = app.icon;
  const [showTouchLabel, setShowTouchLabel] = useState(false);
  const holdTimer = useRef<number | undefined>(undefined);
  const dismissTimer = useRef<number | undefined>(undefined);
  const held = useRef(false);
  const start = useRef<{ x: number; y: number } | null>(null);
  const clearHold = () => window.clearTimeout(holdTimer.current);
  useEffect(() => () => { window.clearTimeout(holdTimer.current); window.clearTimeout(dismissTimer.current); }, []);
  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (!dock || event.pointerType !== 'touch') return;
    held.current = false;
    start.current = { x: event.clientX, y: event.clientY };
    setShowTouchLabel(false);
    window.clearTimeout(dismissTimer.current);
    holdTimer.current = window.setTimeout(() => { held.current = true; setShowTouchLabel(true); }, 500);
  };
  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (start.current && Math.hypot(event.clientX - start.current.x, event.clientY - start.current.y) > 10) { clearHold(); start.current = null; }
  };
  const onPointerUp = () => {
    clearHold(); start.current = null;
    if (held.current) dismissTimer.current = window.setTimeout(() => setShowTouchLabel(false), 1800);
  };
  const onPointerCancel = () => { clearHold(); start.current = null; held.current = false; setShowTouchLabel(false); };
  return <button className={`app-button ${dock ? 'dock-button' : 'desktop-button'} ${showTouchLabel ? 'show-touch-label' : ''}`} onClick={() => { if (held.current) { held.current = false; return; } setShowTouchLabel(false); onClick(); }} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerCancel} onContextMenu={event => { if (dock) event.preventDefault(); }} aria-label={`Open ${app.label}`}>
    <span className={`app-icon ${app.tone}`}>
      {app.id === 'about' ? <img src="/assets/portrait.png" alt="" /> : app.id === 'notes' ? <img className="native-notes" src="/assets/notes-macos.png" alt="" /> : app.id === 'projects' ? <span className="native-folder"><span /></span> : <Icon strokeWidth={1.65} aria-hidden="true" />}
    </span>
    {dock ? <><span className="dock-tooltip" aria-hidden="true">{app.label}</span><span className={`dock-indicator ${active ? 'visible' : ''}`} /></> : <span className="app-label">{app.label}</span>}
  </button>;
}
