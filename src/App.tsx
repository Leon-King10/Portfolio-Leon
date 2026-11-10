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
  return <main className="desktop"><div className="wallpaper-glow" aria-hidden="true"/><div className="wallpaper-lines" aria-hidden="true"/><MenuBar/><section className="desktop-apps" aria-label="Portfolio apps">{apps.filter(app => app.id !== 'about').map(app => <AppIcon key={app.id} app={app} onClick={() => open(app.id)}/>)}</section><nav className="dock" aria-label="App dock"><div className="dock-inner">{apps.filter(app => app.dock).map(app => <AppIcon key={app.id} app={app} dock active={active === app.id} onClick={() => open(app.id)}/>)}<span className="dock-divider"/>{apps.filter(app => app.id === 'instagram' || app.id === 'github').map(app => <AppIcon key={app.id} app={app} dock active={active === app.id} onClick={() => open(app.id)}/>)}</div></nav>{active && <Window id={active} onClose={close}/>}</main>;
}
