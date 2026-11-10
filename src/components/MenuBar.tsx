import { useEffect, useState } from 'react';
import { BatteryFull, Search, Wifi } from 'lucide-react';
export function MenuBar() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const id = window.setInterval(() => setNow(new Date()), 10000); return () => window.clearInterval(id); }, []);
  const date = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(now);
  const time = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(now);
  return <header className="menu-bar"><div className="menu-left"><span className="menu-mark">✳</span><strong>Samiul Azim Leon</strong><span className="menu-desktop">Portfolio</span><span className="menu-desktop muted-menu">Welcome</span></div><div className="menu-right"><Search size={15} className="menu-desktop" aria-hidden="true"/><Wifi size={16} aria-hidden="true"/><BatteryFull size={19} className="menu-desktop" aria-hidden="true"/><time dateTime={now.toISOString()}><span className="menu-date">{date} &nbsp;</span>{time}</time></div></header>;
}
