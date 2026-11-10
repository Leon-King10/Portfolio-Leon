import { useEffect, useRef, useState } from 'react';
import { AppContent } from '../apps/AppContent';
import { getApp, type AppId } from '../data/apps';
export function Window({ id, onClose }: { id: AppId; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const windowRef = useRef<HTMLElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [closing, setClosing] = useState(false);
  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timer.current = window.setTimeout(onClose, reduced ? 0 : 180);
  };
  useEffect(() => { closeRef.current?.focus(); return () => window.clearTimeout(timer.current); }, []);
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') { event.preventDefault(); requestClose(); }
    if (event.key !== 'Tab') return;
    const focusable = windowRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])');
    if (!focusable?.length) return;
    const first = focusable[0]; const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  return <div className={`window-backdrop ${closing ? 'is-closing' : ''}`} onMouseDown={event => { if (event.target === event.currentTarget) requestClose(); }}><section ref={windowRef} onKeyDown={onKeyDown} className={`app-window window-${id}`} role="dialog" aria-modal="true" aria-label={`${getApp(id).label} window`}><header className="window-bar"><div className="traffic-lights"><button ref={closeRef} className="traffic close" onClick={requestClose} aria-label="Close window">×</button><span className="traffic amber"/><span className="traffic green"/></div><span className="window-title">{getApp(id).label}</span><span className="window-bar-end">✳</span></header><div className="window-body"><AppContent id={id}/></div></section></div>;
}
