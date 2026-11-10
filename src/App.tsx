import { useCallback, useRef, useState } from 'react';
import { AppIcon } from './components/AppIcon';
import { MenuBar } from './components/MenuBar';
import { Window } from './components/Window';
import { apps, type AppId } from './data/apps';
import './styles/main.css';
export default function App() {
  const [active, setActive] = useState<AppId | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const open = (id: AppId) => { lastFocus.current = document.activeElement as HTMLElement; setActive(id); };
  const close = useCallback(() => { setActive(null); requestAnimationFrame(() => lastFocus.current?.focus()); }, []);
  return <main className="desktop"><div className="wallpaper-glow" aria-hidden="true"/><div className="wallpaper-lines" aria-hidden="true"/><MenuBar/><div className="desktop-intro"><div className="intro-line"><span className="status-dot"/> A PERSONAL SPACE ON THE INTERNET</div><h1>Welcome to<br/><em>my desktop.</em></h1><p>A little space for big ideas, works in progress,<br className="intro-break"/> and everything in between.</p><span className="intro-hint">✳ &nbsp; MAKE YOURSELF AT HOME</span></div><section className="desktop-apps" aria-label="Portfolio apps">{apps.map(app => <AppIcon key={app.id} app={app} onClick={() => open(app.id)}/>)}</section><div className="desktop-caption"><span>DESIGNED TO EXPLORE</span><span>✳</span><span>EST. 2026</span></div><nav className="dock" aria-label="App dock"><div className="dock-inner">{apps.filter(app => app.dock).map(app => <AppIcon key={app.id} app={app} dock active={active === app.id} onClick={() => open(app.id)}/>)}<span className="dock-divider"/>{apps.filter(app => app.id === 'instagram' || app.id === 'github').map(app => <AppIcon key={app.id} app={app} dock active={active === app.id} onClick={() => open(app.id)}/>)}</div></nav><div className="dock-hint">CLICK AN ICON TO EXPLORE <span>↗</span></div>{active && <Window id={active} onClose={close}/>}</main>;
}
